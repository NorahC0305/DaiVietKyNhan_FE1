"use client";

import SocialMediaIcons from "@components/Atoms/SocialMediaIcons";
import React from "react";

type Props = {
    children: React.ReactNode;
};

export default function HeaderPublicNonPermissionLayoutClient({ children }: Props) {
    return (
        <>
            {children}
            <div className="hidden lg:block fixed right-0 top-1/2 transform -translate-y-1/2 z-50 pointer-events-auto">
                <SocialMediaIcons />
            </div>
        </>
    );
}


