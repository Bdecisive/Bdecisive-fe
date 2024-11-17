// components/ConfirmationModal.tsx
import React from 'react';
import { Modal } from '../../Components/Modal';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  confirmButtonClass?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  confirmButtonClass = "bg-red-600 hover:bg-red-700 focus:ring-red-500"
}) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <p className="text-sm text-gray-500 mb-6">{message}</p>
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${confirmButtonClass}`}
        >
          {confirmText}
        </button>
      </div>
    </div>
  </Modal>
);

export default ConfirmationModal;