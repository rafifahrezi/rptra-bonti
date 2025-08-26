import React from 'react';

const StatusControlButton: React.FC<{ isOpen: boolean; onToggle: () => void }> = ({ isOpen, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="inline-flex items-center px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors font-medium shadow-md hover:shadow-lg"
      aria-label={isOpen ? 'Tutup RPTRA' : 'Buka RPTRA'}
    >
      {isOpen ? (
        <>
          <span className="mr-2">Tutup RPTRA</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </>
      ) : (
        <>
          <span className="mr-2">Buka RPTRA</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </>
      )}
    </button>
  );
};

export default StatusControlButton;