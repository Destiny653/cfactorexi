import { Link } from "react-router-dom";
import { Home, Package, FileText, MessageSquare, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <div className="h-screen w-64 bg-primary text-white p-5">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <ul>
        <li className="mb-4">
          <Link to="/dashboard" className="flex items-center gap-2 hover:text-accent">
            <Home /> Home
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/products" className="flex items-center gap-2 hover:text-accent">
            <Package /> Products
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/posts" className="flex items-center gap-2 hover:text-accent">
            <FileText /> Posts
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/comments" className="flex items-center gap-2 hover:text-accent">
            <MessageSquare /> Comments
          </Link>
        </li>
        <li className="mb-4 cursor-pointer" onClick={logout}>
          <div className="flex items-center gap-2 hover:text-red-500">
            <LogOut /> Logout
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
