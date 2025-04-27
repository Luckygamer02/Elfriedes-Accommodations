import React from "react";

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
}

const LandingContainer: React.FC<ContainerProps> = ({children, className = ""}) => {
    return (
        <div className={`max-w-screen-xl mx-auto px-8 ${className}`}>
            {children}
        </div>
    );
};

export default LandingContainer;