import type React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Library, Heart, User } from "lucide-react";

interface NavItem {
  name: string;
  path: string;
  icon: JSX.Element;
}

const Sidebar: React.FC = () => {
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
    <div className="w-64 bg-black flex-shrink-0 hidden md:flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-8 text-primary">Musicify</h1>

        <nav className="mb-8">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-4 p-2 rounded-md transition-colors ${
                    isActive(item.path)
                      ? "bg-surface-light text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mb-6">
          <div className="flex items-center gap-2 text-gray-400 hover:text-white p-2 rounded-md transition-colors cursor-pointer">
            <Heart size={20} />
            <span className="font-medium">Liked Songs</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
