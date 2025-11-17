"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ROUTES } from "@routes";

interface IntroduceLayoutProps {
    children: React.ReactNode;
    className?: string;
}

const IntroduceLayoutClient: React.FC<IntroduceLayoutProps> = ({
    children,
    className = "",
}) => {
    const router = useRouter();

    const handleBack = () => {
        router.push(ROUTES.PUBLIC.HOME);
    };

    return (
        <div
            className={`relative w-full h-screen overflow-hidden ${className}`}
        >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://res.cloudinary.com/dznt9yias/image/upload/v1760721580/background_web_1_mq9ehy.svg"
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Back Button */}
            <button
                onClick={handleBack}
                className="absolute top-4 right-4 z-30 hover:scale-110 transition-transform duration-200"
            >
                <Image
                    src="https://res.cloudinary.com/dauhpllo7/image/upload/v1763390775/%C4%91%C3%B3ng_t9d0ko.png"
                    alt="X"
                    width={40}
                    height={40}
                    className="object-contain cursor-pointer"
                />
            </button>

            {/* Content */}
            <div className="relative z-20 min-h-screen">{children}</div>
        </div>
    );
};

export default IntroduceLayoutClient;
