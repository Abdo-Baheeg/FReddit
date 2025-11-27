import React from 'react';
import './AI-summary.css';

const AI_Summary = ({ summary, isLoading }) => {
    if (!summary && !isLoading) return null;

    return (
        <div className="ai-summary-container">
            <div className="ai-summary-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <div className="ai-summary-content">
                <div className="ai-summary-label">AI Summary</div>
                {isLoading ? (
                    <div className="ai-summary-loading">Generating summary...</div>
                ) : (
                    <div className="ai-summary-text">{summary}</div>
                )}
            </div>
        </div>
    );
};

export default AI_Summary;