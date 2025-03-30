import AppError from "@src/utils/AppError";
import type React from "react";

interface ErrorCardProps {
  error: AppError;
}

const ErrorCard: React.FC<ErrorCardProps> = ({ error }) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <p className="text-red-400 mb-4">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-black rounded-md hover:bg-primary-hover"
          style={{ cursor: "pointer" }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorCard;
