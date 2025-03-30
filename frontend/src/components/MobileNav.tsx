import type React from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Library, User, Menu, X } from "lucide-react";

interface NavItem {
  name: string;
  path: string;
  icon: JSX.Element;
}

const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const location = useLocation();

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  const navItems: NavItem[] = [
    { name: "Home", path: "/", icon: <Home size={20} /> },
    { name: "Search", path: "/search", icon: <Search size={20} /> },
    { name: "Your Library", path: "/library", icon: <Library size={20} /> },
    { name: "Profile", path: "/profile", icon: <User size={20} /> },
  ];

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black z-10 border-t border-gray-800">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center py-3 px-4 ${
                isActive(item.path) ? "text-primary" : "text-gray-400"
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 right-4 z-20 bg-black p-2 rounded-full"
      >
        <Menu size={24} />
      </button>

      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black z-30 p-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-white">Musicify</h1>
            <button onClick={() => setIsOpen(false)} className="p-2">
              <X size={24} />
            </button>
          </div>

          <nav>
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-4 p-3 rounded-md ${
                      isActive(item.path)
                        ? "bg-surface-light text-white"
                        : "text-gray-400"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
};

export default MobileNav;
