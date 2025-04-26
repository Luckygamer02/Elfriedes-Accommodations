import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-vacation-700 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
                    <div>
                        <h3 className="text-xl font-bold mb-4">Elfriedes Accommodations</h3>
                        <p className="text-vacation-100">
                            Discover the most beautiful holiday apartments and vacation homes for your perfect getaway.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">About us</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about">About us</Link>
                            </li>
                            <li>
                                <Link href="/contact">Contact</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/terms">Terms & Conditions</Link>
                            </li>
                            <li>
                                <Link href="/privacy">Privacy</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <hr className="border-t border-gray-400 my-8"/>
                <div className="justify-items-center">
                    <p>&copy; {new Date().getFullYear()} Elfriedes Accommodations. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;