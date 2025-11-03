"use client";

import React from "react";

type Props = {
    children: React.ReactNode;
};

export default function HeaderPublicNonPermissionLayoutClient({ children }: Props) {
    return (
        <>
            {children}
        </>
    );
}


