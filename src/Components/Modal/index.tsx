import React from 'react';

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose }) => (
  <div className="mb-6 flex justify-between items-center">
    <h3 className="text-lg font-medium text-gray-900" id="modal-title">
      {title}
    </h3>
    <button
      onClick={onClose}
      className="text-gray-400 hover:text-gray-500 transition-colors"
      aria-label="Close modal"
    >
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
);

interface ModalFooterProps {
  onClose: () => void;
  closeText?: string;
  children?: React.ReactNode;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({ 
  onClose, 
  closeText = "Close", 
  children 
}) => (
  <div className="mt-6 flex justify-end space-x-3">
    {children}
    <button
      type="button"
      onClick={onClose}
      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {closeText}
    </button>
  </div>
);

export { default as Modal } from './Modal';