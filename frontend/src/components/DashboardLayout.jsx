import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children, title, subtitle }) {
    const { sidebarOpen } = useApp();

    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar />
            <div className={cn(
                'flex-1 flex flex-col min-w-0 transition-all duration-300',
                sidebarOpen ? 'lg:ml-56' : 'lg:ml-14'
            )}>
                <TopBar title={title} subtitle={subtitle} />
                <main className="flex-1 overflow-auto p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}