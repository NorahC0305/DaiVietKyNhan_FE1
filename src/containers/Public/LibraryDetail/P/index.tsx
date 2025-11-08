import React from 'react'

const PLibDetail = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <p className={`text-[13px] lg:text-base text-black leading-relaxed ${className}`}>
            {children}
        </p>
    )
};

export default PLibDetail;