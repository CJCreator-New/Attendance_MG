import { create } from 'zustand';

export const useConfirmStore = create((set) => ({
  isOpen: false,
  title: '',
  message: '',
  onConfirm: null,
  onCancel: null,
  
  openConfirm: ({ title, message, onConfirm, onCancel }) => {
    set({
      isOpen: true,
      title,
      message,
      onConfirm,
      onCancel,
    });
  },
  
  closeConfirm: () => {
    set({
      isOpen: false,
      title: '',
      message: '',
      onConfirm: null,
      onCancel: null,
    });
  },
}));

export const confirm = ({ title, message }) => {
  return new Promise((resolve) => {
    useConfirmStore.getState().openConfirm({
      title,
      message,
      onConfirm: () => {
        resolve(true);
        useConfirmStore.getState().closeConfirm();
      },
      onCancel: () => {
        resolve(false);
        useConfirmStore.getState().closeConfirm();
      },
    });
  });
};
