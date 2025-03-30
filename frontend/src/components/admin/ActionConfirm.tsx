import { Popconfirm } from "antd";
import type React from "react";

interface ActionConfirmProps {
  okText?: string;
  cancelText?: string;
  title?: string;
  description: string;
  children: React.ReactNode;
  onConfirm: () => void | Promise<void>;
}

const ActionConfirm: React.FC<ActionConfirmProps> = ({
  okText = "Yes",
  cancelText = "No",
  title = "Action confirm",
  description,
  children,
  onConfirm,
}) => {
  return (
    <Popconfirm
      title={title}
      description={description}
      okText={okText}
      cancelText={cancelText}
      onConfirm={async () => onConfirm()}
    >
      {children}
    </Popconfirm>
  );
};

export default ActionConfirm;
