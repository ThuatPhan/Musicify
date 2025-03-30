import React, { useEffect } from "react";
import { notification } from "antd";
import { NotificationType } from "@src/types/Enums";

interface NotificationProps {
  message: string;
  type: NotificationType;
}

const NotificationPopup: React.FC<NotificationProps> = ({ message, type }) => {
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    switch (type) {
      case NotificationType.ERROR:
        api.error({
          message: "Error",
          description: message,
        });
        break;
      case NotificationType.SUCCESS:
        api.success({
          message: "Success",
          description: message,
        });
        break;
      case NotificationType.INFO:
        api.info({
          message: "Info",
          description: message,
        });
    }
  }, [api, type, message]);

  return <>{contextHolder}</>;
};

export default NotificationPopup;
