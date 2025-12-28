import React from 'react';
import Modal from './Modal';
import Button from './Button';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-slate-600 dark:text-slate-300 mb-6">
        {message}
      </p>
      <div className="flex justify-end space-x-3">
        <Button variant="ghost" onClick={onClose} disabled={isLoading}>
          İptal
        </Button>
        <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
          Onayla
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
