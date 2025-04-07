import React from "react";
import LandingContainer from "@/components/LandingPage/LandingContainer";

const OverlappingSearch = () => {
    return (
        <div style={{ position: "relative" }}>
            <div
                style={{
                    width: "100%",
                    padding: "80px 0",
                }}
                className="bg-vacation-500"
            >
                <LandingContainer>
                    <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#fff" }}>
                        <strong>
                            Discover Your Perfect Holiday Home
                        </strong>
                    </h1>
                    <p style={{ marginBottom: "2rem", color: "#fff" }}>
                        <strong>
                            Find unique holiday houses and apartments for an unforgettable vacation
                        </strong>
                    </p>
                    <button
                        style={{
                            padding: "10px 20px",
                            border: "none",
                            backgroundColor: "#fff",
                            cursor: "pointer",
                            borderRadius: "4px",
                        }}
                        className="text-vacation-600"
                    >
                        Explore Vacation Rentals
                    </button>
                </LandingContainer>
            </div>

            {/* 3) ÜBERLAPPENDE SUCHLEISTE */}
            <LandingContainer>
            <div
                style={{
                    position: "relative",
                    maxWidth: "1216px",
                    margin: "-40px auto 0", // Negatives Margin für das Überlappen
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "16px",
                    padding: "20px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: "200px" }}>
                        <label style={{ display: "block", marginBottom: "4px" }}>Destination</label>
                        <input
                            type="text"
                            placeholder="City, Region or Accomodation"
                            style={{
                                width: "100%",
                                padding: "8px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                            }}
                        />
                    </div>
                    <div style={{ minWidth: "150px" }}>
                        <label style={{ display: "block", marginBottom: "4px" }}>Arrival</label>
                        <input
                            type="date"
                            style={{
                                width: "100%",
                                padding: "8px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                            }}
                        />
                    </div>
                    <div style={{ minWidth: "150px" }}>
                        <label style={{ display: "block", marginBottom: "4px" }}>Departure</label>
                        <input
                            type="date"
                            style={{
                                width: "100%",
                                padding: "8px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                            }}
                        />
                    </div>
                    <div style={{ minWidth: "100px" }}>
                        <label style={{ display: "block", marginBottom: "4px" }}>Visitors</label>
                        <select
                            style={{
                                width: "100%",
                                height: "60.9%",
                                padding: "8px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                            }}
                        >
                            <option>1 Gast</option>
                            <option>2 Gäste</option>
                            <option>3 Gäste</option>
                            <option>4 Gäste</option>
                        </select>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-end" }}>
                        <button
                            style={{
                                padding: "10px 20px",
                                border: "none",
                                backgroundColor: "#007acc",
                                color: "#fff",
                                cursor: "pointer",
                                borderRadius: "4px",
                                whiteSpace: "nowrap",
                            }}
                        >
                            Search accomodation
                        </button>
                    </div>
                </div>
            </div>
            </LandingContainer>
        </div>
    );
};

export default OverlappingSearch;
