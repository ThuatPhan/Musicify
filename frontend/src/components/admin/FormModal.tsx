import React from "react";
import { Modal } from "antd";

interface FormModalProps {
  title?: string;
  children: React.ReactNode;
  open: boolean;
  loading: boolean;
  onOk: () => Promise<void> | void;
  onCancel: () => void;
}

const FormModal: React.FC<FormModalProps> = ({
  title = "Title",
  children,
  open,
  loading,
  onOk,
  onCancel,
}) => {
  const handleOk = async () => {
    await onOk();
  };

  return (
    <Modal
      title={title}
      open={open}
      onOk={handleOk}
      confirmLoading={loading}
      onCancel={onCancel}
    >
      {children}
    </Modal>
  );
};

export default FormModal;
