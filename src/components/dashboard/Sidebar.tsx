import React from 'react';
import { Activity, ShoppingCart, FileText, Grid, Settings, Users, CreditCard } from 'lucide-react';
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
        { icon: Users, label: 'Users', view: 'users' },
        { icon: CreditCard, label: 'Orders', view: 'orders' },
        { icon: Settings, label: 'Settings', view: 'settings' }
    ];

    return (
        <aside className={`w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white h-screen flex flex-col fixed left-0 shadow-xl z-50 transition-transform duration-300 ease-in-out 
            ${mobileOpen === false ? '-translate-x-full' : 'translate-x-0'} lg:translate-x-0`}>
            
            {/* Header */}
            <div className="p-4 border-b border-blue-700 flex items-center">
                <div className="bg-white text-blue-600 p-1.5 rounded-lg mr-2">
                    <Activity size={18} />
                </div>
                <h2 className="text-lg font-bold">AdminPro</h2>
            </div>
            
            {/* Navigation */}
            <nav className="flex-grow overflow-y-auto py-2 px-3">
                {sidebarItems.map(({ icon: Icon, label, view }) => (
                    
                    <button
                        key={view}
                        className={`w-full flex items-center px-3 py-2 rounded-md transition-colors mb-1 text-sm ${
                            selectedView === view
                                ? 'bg-blue-700 text-white font-medium'
                                : 'text-blue-100 hover:bg-blue-700/50 hover:text-white'
                        }`}
                        onClick={() => {
                            setSelectedView(view);
                            if (setMobileOpen) setMobileOpen(false);
                        }}
                    >
                        <Icon className="mr-2" size={18} />
                        <span>{label}</span>
                        {view === 'orders' && (
                            <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">3</span>
                        )}
                    </button>
                ))}
            </nav>
            
            {/* Footer */}
            <div className="border-t border-blue-700 p-3">
                <div className="flex items-center mb-2">
                    <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={(user as any)?.avatar ?? ''} />
                        <AvatarFallback className="bg-blue-600 text-sm">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-xs font-semibold truncate">{user?.username || 'User'}</p>
                        <p className="text-xs text-blue-200 truncate">{user?.email}</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs text-blue-100 hover:text-white hover:bg-blue-700/50 py-1 h-8"
                    onClick={logout}
                >
                    Logout
                </Button>
            </div>
        </aside>
    );
};

export default Sidebar;