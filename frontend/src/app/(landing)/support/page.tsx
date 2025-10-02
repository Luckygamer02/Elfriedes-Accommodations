"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useAuthGuard } from "@/lib/auth/use-auth";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { UserResponse } from "@/models/backend";
import { Role } from "@/models/user/UserResponse";
import httpClient from "@/lib/httpClient";



// Define types for messages and websocket communication
interface WebSocketMessage {
    type: string;
    senderId: number;
    senderName?: string;
    recipientId: number | null;
    content?: string;
    timestamp?: string;
    role?: string;
    data?: Record<string, unknown>;
}

interface MessageDto {
    id: number;
    senderId: number;
    senderName: string;
    recipientId: number;
    content: string;
    timestamp: string;
    read: boolean;
}

interface UserWithUnread extends UserResponse {
    unreadCount: number;
}

export default function SupportPage() {
    const { user } = useAuthGuard({
        middleware: "auth",
        redirectIfAuthenticated: "/support"
    });

    if (!user) return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Support Dashboard</h1>
            <div className="bg-white rounded-lg shadow p-4">
                <p className="text-gray-500">Please login to access the support dashboard</p>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Support Dashboard</h1>
            <div className="bg-white rounded-lg shadow p-4">
                <ChatInterface user={user} />
            </div>
        </div>
    );
}

interface ChatInterfaceProps {
    user: UserResponse;
}

function ChatInterface({ user }: ChatInterfaceProps) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<MessageDto[]>([]);
    const [activeChat, setActiveChat] = useState<number | null>(null);
    const [users, setUsers] = useState<UserWithUnread[]>([]);
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [adminId, setAdminId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(!user?.role || user.role !== Role.ADMIN);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Check if user is admin
    const isAdmin = user?.role === Role.ADMIN;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchUsers = async () => {
        try {
            const response = await httpClient.get("/api/support/users");
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleNewMessage = useCallback((data: WebSocketMessage) => {
        // For all users: validate message relevance
        const isRelevant = isAdmin
            ? (activeChat === data.senderId || activeChat === data.recipientId)
            : (data.senderId === adminId || data.recipientId === adminId);

        if (isRelevant) {
            setMessages(prev => {
                // Filter out temporary optimistic messages
                const existingIds = new Set(prev.map(m => m.id));
                return existingIds.has(data.id)
                    ? prev
                    : [...prev, data as MessageDto];
            });
        }
    }, [isAdmin, activeChat, adminId]);

    const fetchChatHistory = async (userId: number) => {
        try {
            const response = await httpClient.get(`/api/support/chat/${userId}`);
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching chat history:", error);
        }
    };

    // Fetch admin ID when component mounts for regular users
    useEffect(() => {
        if (!isAdmin) {
            httpClient.get('/api/support/admin')
                .then(res => {
                    setAdminId(Number(res.data.adminId));
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching admin ID:", error);
                    setIsLoading(false);
                });
        }
    }, [isAdmin]);

    useEffect(() => {
        // Load initial chat when admin ID is available for regular users
        if (!isAdmin && adminId) {
            setActiveChat(adminId);
            fetchChatHistory(adminId);
        }
    }, [adminId, isAdmin]); // Add this useEffect

    useEffect(() => {
        if (!isAdmin && adminId) {
            // Refresh messages every 5 seconds (fallback for WS issues)
            const interval = setInterval(() => {
                fetchChatHistory(adminId);
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [adminId, isAdmin]);


    // Initialize WebSocket connection
    useEffect(() => {
        // Initialize STOMP client
        const socket = new SockJS(process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8080/ws");
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            // Subscribe to personal messages
            client.subscribe(`/user/queue/messages`, message => {
                const receivedMessage = JSON.parse(message.body);
                handleNewMessage(receivedMessage);
            });

            // Admin subscribes to user list updates
            if (isAdmin) {
                client.subscribe(`/user/queue/users`, message => {
                    const data = JSON.parse(message.body);
                    if (data.type === "userList") {
                        setUsers(data.data || []);
                    }
                });
            }

            // Identify user to the server
            client.publish({
                destination: '/app/chat',
                body: JSON.stringify({
                    type: "identify",
                    senderId: user.id,
                    role: user.role
                })
            });

            // If admin, fetch all users with support requests
            if (isAdmin) {
                fetchUsers();
            }
        };

        client.onStompError = (frame) => {
            console.error('STOMP error', frame);
        };

        client.activate();
        setStompClient(client);

        return () => {
            if (client && client.connected) {
                client.deactivate();
            }
        };
    }, [user, isAdmin, handleNewMessage]);

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const selectChat = (userId: number) => {
        setActiveChat(userId);
        fetchChatHistory(userId);
    };

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !stompClient || !stompClient.connected) return;

        // Make sure we have valid recipient ID
        const recipientId = isAdmin ? activeChat : adminId;

        if (!recipientId) return;
        const newMessage: WebSocketMessage = {
            type: "message",
            content: message,
            senderId: user.id,
            senderName: isAdmin ? `Admin` : `${user.firstName} ${user.lastName}`,
            timestamp: new Date().toISOString(),
            recipientId: recipientId
        };
        stompClient.publish({
            destination: '/app/chat',
            body: JSON.stringify(newMessage)
        });

        // Optimistically add to messages
        setMessages(prev => [...prev, newMessage as unknown as MessageDto]);
        setMessage("");
    };

    // Show loading while fetching admin ID for regular users
    if (isLoading) {
        return <div>Loading chat...</div>;
    }

    // Render different views for admin and user
    return (
        <div className="flex flex-col md:flex-row gap-4">
            {/* Users list for admin */}
            {isAdmin && (
                <div className="w-full md:w-1/4 border rounded-lg p-2">
                    <h2 className="font-bold mb-2">Users</h2>
                    {users.length === 0 ? (
                        <p className="text-gray-500">No active support requests</p>
                    ) : (
                        <ul>
                            {users.map((u) => (
                                <li
                                    key={u.id}
                                    className={`p-2 cursor-pointer rounded ${activeChat === u.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                                    onClick={() => selectChat(u.id)}
                                >
                                    {u.firstName} {u.lastName}
                                    {u.unreadCount > 0 && (
                                        <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                                            {u.unreadCount}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* Chat area */}
            <div className="flex-1">
                <div className="h-96 border rounded-lg p-4 mb-4 overflow-y-auto">
                    {isAdmin && !activeChat ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            Select a user to start chatting
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            No messages yet
                        </div>
                    ) : (
                        <div>
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`p-2 rounded-lg mb-2 max-w-3/4 ${
                                        msg.senderId === user.id ? 'ml-auto bg-blue-100' : 'bg-gray-100'
                                    }`}
                                >
                                    <div className="font-bold text-sm">{msg.senderId === user.id ? 'You' : msg.senderName}</div>
                                    <div>{msg.content}</div>
                                    <div className="text-xs text-gray-500">
                                        {new Date(msg.timestamp).toLocaleTimeString()}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Message input - disabled if admin hasn't selected a user */}
                <form onSubmit={sendMessage} className="flex gap-2">
                    <input
                        type="text"
                        className="border rounded-lg p-2 flex-1"
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={isAdmin && !activeChat}
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-300"
                        disabled={isAdmin && !activeChat}
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}