import { useAuth0 } from "@auth0/auth0-react";
import type React from "react";
import MobileNav from "@src/components/MobileNav";

interface RequireLoginScreenProps {
  feature: string;
  message: string;
}

const RequireLoginScreen: React.FC<RequireLoginScreenProps> = ({
  feature,
  message,
}) => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="min-h-screen bg-gray-900">
      <MobileNav />
      <div className="flex flex-col items-center justify-center h-96">
        <h1 className="text-3xl font-bold mb-4">{feature}</h1>
        <p className="text-gray-400 mb-6">{message}</p>
        <button
          className="px-4 py-2 bg-green-600 rounded-md hover:bg-green-500 transition-colors"
          onClick={() => loginWithRedirect()}
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default RequireLoginScreen;
