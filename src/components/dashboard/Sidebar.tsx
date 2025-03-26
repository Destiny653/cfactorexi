import React from 'react';
import {
    Activity, ShoppingCart, FileText, MessageCircle, Grid, BarChart2, Layers, 
    Settings, Users, CreditCard
} from 'lucide-react';
import { Button } from "../ui/button";
import { useAuth } from '../../context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { SidebarProps, SidebarItem } from '../../types/dashboardTypes';

const Sidebar: React.FC<SidebarProps> = ({ selectedView, setSelectedView, mobileOpen, setMobileOpen }) => {
    const { user, logout } = useAuth();
    const sidebarItems: SidebarItem[] = [
        { icon: Grid, label: 'Dashboard', view: 'dashboard' },
        { icon: ShoppingCart, label: 'Products', view: 'products' },
        { icon: FileText, label: 'Posts', view: 'posts' },
        { icon: MessageCircle, label: 'Comments', view: 'comments' },
        { icon: Users, label: 'Users', view: 'users' },
        { icon: BarChart2, label: 'Analytics', view: 'analytics' },
        { icon: CreditCard, label: 'Orders', view: 'orders' },
        { icon: Layers, label: 'Integrations', view: 'integrations' },
        { icon: Settings, label: 'Settings', view: 'settings' }
    ];

    return (
        <aside className={`w-72 bg-gradient-to-b from-blue-900 to-blue-800 text-white h-screen flex flex-col fixed left-0 shadow-xl z-50 transition-transform duration-300 ease-in-out 
      ${mobileOpen === false ? '-translate-x-full' : 'translate-x-0'} lg:translate-x-0`}>
            <div className="p-6 border-b border-blue-700 flex items-center">
                <div className="bg-white text-blue-600 p-2 rounded-lg mr-3">
                    <Activity size={20} />
                </div>
                <h2 className="text-xl font-bold">AdminPro</h2>
            </div>
            <nav className="flex-grow overflow-y-auto p-4">
                {sidebarItems.map(({ icon: Icon, label, view }) => (
                    <button
                        key={view}
                        className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors mb-1 ${selectedView === view
                            ? 'bg-blue-700 text-white font-medium shadow-md'
                            : 'text-blue-100 hover:bg-blue-700/50 hover:text-white'}
                 `}
                        onClick={() => {
                            setSelectedView(view);
                            if (setMobileOpen) setMobileOpen(false);
                        }}
                    >
                        <Icon className="mr-3" size={20} />
                        <span className="text-sm">{label}</span>
                        {view === 'orders' && (
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">3</span>
                        )}
                    </button>
                ))}
            </nav>
            <div className="border-t border-blue-700 p-4">
                <div className="flex items-center mb-3">
                    <Avatar className="mr-3">
                        <AvatarImage src={(user as any)?.avatar ?? ''} />
                        <AvatarFallback className="bg-blue-600">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-semibold">{user?.username || 'User'}</p>
                        <p className="text-xs text-blue-200">{user?.email}</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-blue-100 hover:text-white hover:bg-blue-700/50"
                    onClick={logout}
                >
                    Logout
                </Button>
            </div>
        </aside>
    );
};

export default Sidebar;