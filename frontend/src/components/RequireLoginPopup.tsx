import type React from "react";
import { X } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react"; 

interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const RequireLoginPopup: React.FC<LoginPopupProps> = ({ isOpen, onClose }) => {
  const { loginWithRedirect } = useAuth0(); 

  if (!isOpen) return null;

  const handleLogin = () => {
    loginWithRedirect(); 
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Login Required</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <p className="text-gray-300 mb-6">
          Please log in to access this feature and enjoy the full Musicify
          experience.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
          >
            Cancel
          </button>
          <button
            onClick={handleLogin}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequireLoginPopup;
