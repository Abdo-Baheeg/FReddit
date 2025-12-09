import React, { useState, useEffect } from 'react';
import { postApi } from '../api';
import './AISummaryModal.css';

const AISummaryModal = ({ postId, isOpen, onClose }) => {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && postId) {
      generateSummary();
    }
  }, [isOpen, postId]);

  const generateSummary = async () => {
    setIsLoading(true);
    setError('');
    setSummary('');

    try {
      const response = await postApi.generateSummary(postId);
      setSummary(response.summary);
    } catch (err) {
      console.error('Error generating summary:', err);
      setError(err.response?.data?.message || 'Failed to generate summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ai-modal-backdrop" onClick={handleBackdropClick}>
      <div className="ai-modal-container">
        {/* Modal Header */}
        <div className="ai-modal-header">
          <div className="ai-modal-title">
            <div className="ai-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span>AI Summary</span>
          </div>
          <button className="ai-modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="ai-modal-content">
          {isLoading ? (
            <div className="ai-modal-loading">
              <div className="loading-spinner"></div>
              <p>Generating AI summary...</p>
              <span className="loading-subtext">This may take a few seconds</span>
            </div>
          ) : error ? (
            <div className="ai-modal-error">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p>{error}</p>
              <button className="retry-button" onClick={generateSummary}>
                Try Again
              </button>
            </div>
          ) : summary ? (
            <div className="ai-modal-summary">
              <div className="summary-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span>Generated</span>
              </div>
              <p className="summary-text">{summary}</p>
              <div className="summary-footer">
                <span className="summary-disclaimer">
                  AI-generated summaries may contain inaccuracies. Please verify important information.
                </span>
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Actions */}
        {summary && (
          <div className="ai-modal-actions">
            <button className="action-button regenerate" onClick={generateSummary}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M1 4V10H7M23 20V14H17M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14L18.36 18.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Regenerate
            </button>
            <button className="action-button copy" onClick={() => {
              navigator.clipboard.writeText(summary);
              alert('Summary copied to clipboard!');
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Copy
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISummaryModal;
