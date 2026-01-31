import React from 'react';

const SectionHeader = ({ title, subtitle }) => {
    return (
        <div className="text-center mb-10">
            {subtitle && (
                <span className="text-primary font-bold tracking-wider uppercase text-xs mb-2 block">
                    {subtitle}
                </span>
            )}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 relative inline-block">
                {title}
                {/* Decorative underline */}
                <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary rounded-full"></span>
            </h2>
        </div>
    );
};

export default SectionHeader;
