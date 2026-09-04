"use client"

import React from 'react';

const FlashMessage = ({ message, type = 'info', onClose }) => {
  return (
    <div className={`flash-message ${type}`}>
      <p>{message}</p>
      <button onClick={onClose} className="close-button">&times;</button>
      <style jsx>{`
        .flash-message {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          padding: 15px 25px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: slideIn 0.3s ease-out;
          max-width: 90vw;
          transition: all 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }

        .info {
          background-color: #3498db;
          color: white;
        }

        .success {
          background-color: #2ecc71;
          color: white;
        }

        .error {
          background-color: #e74c3c;
          color: white;
        }

        .warning {
          background-color: #f1c40f;
          color: #2c3e50;
        }

        .close-button {
          background: none;
          border: none;
          color: inherit;
          font-size: 20px;
          cursor: pointer;
          padding: 0 5px;
          opacity: 0.8;
          transition: opacity 0.2s;
        }

        .close-button:hover {
          opacity: 1;
        }

        p {
          margin: 0;
          white-space: pre-line;
        }
      `}</style>
    </div>
  );
};

export default FlashMessage;
