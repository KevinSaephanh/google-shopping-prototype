import React from 'react';

interface AccordionItemProps {
    step: number;
    title: string;
    summaryContent?: string;
    isOpen: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ 
    step, 
    title, 
    summaryContent, 
    isOpen, 
    onClick, 
    children 
}) => {
    const panelId = `panel-${step}`;

    return (
        <div className={`border border-gray-700 rounded-lg bg-gray-800 transition-colors duration-300 ${isOpen ? 'ring-1 ring-purple-500' : ''}`}>
            
            {/* Header/Clickable Toggle */}
            <div
                className="flex justify-between items-center p-6 cursor-pointer"
                onClick={onClick}
                aria-expanded={isOpen}
                aria-controls={panelId}
            >
                <h3 className="text-xl font-medium">
                    <span className="mr-2 font-bold text-gray-400">{step}</span>
                    {title}
                </h3>
                <div className="flex items-center">
                    {/* Summary Content (when closed) */}
                    {!isOpen && summaryContent && <span className="text-sm text-gray-400 mr-4">{summaryContent}</span>}

                    {/* Chevron Icon */}
                    <span className="text-purple-400 transform transition-transform duration-300">
                        {isOpen ? '▲' : '▼'}
                    </span>
                </div>
            </div>

            {/* Content Panel */}
            {isOpen && (
                <div id={panelId} className="px-6 pb-6 pt-4 border-t border-gray-700">
                    {children}
                </div>
            )}
        </div>
    );
};

export default AccordionItem;