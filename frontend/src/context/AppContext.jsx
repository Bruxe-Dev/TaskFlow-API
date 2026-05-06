import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(undefined);

// Mock current user - will be replaced with real auth
const mockUser = {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@taskflow.io',
    role: 'org_leader',
    avatar: null,
    organization: 'Taskflow Inc',
};

export function AppProvider({ children }) {
    const [user, setUser] = useState(mockUser);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [notifications, setNotifications] = useState(4);

    const logout = () => {
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AppContext.Provider value={{ user, setUser, sidebarOpen, setSidebarOpen, notifications, logout }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
}