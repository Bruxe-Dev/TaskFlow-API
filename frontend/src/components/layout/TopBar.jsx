import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Menu, Search, Bell, Plus, Sun, Moon, Settings,
    ChevronDown, MoreVertical
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

export default function TopBar({ title, subtitle }) {
    const { sidebarOpen, setSidebarOpen, user, notifications } = useApp();
    const { isDark, toggleTheme } = useTheme();
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <header className="h-14 border-b border-border bg-background flex items-center px-4 gap-3 shrink-0">
            {/* Sidebar toggle */}
            <button
                onClick={() => setSidebarOpen(v => !v)}
                className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            >
                <Menu className="w-4 h-4" />
            </button>

            {/* Title */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    {title && (
                        <h1 className="text-base font-semibold text-foreground truncate">{title}</h1>
                    )}
                    {subtitle && (
                        <span className="text-xs text-muted-foreground hidden sm:block">{subtitle}</span>
                    )}
                </div>
            </div>

            {/* Search */}
            <div className={cn(
                'flex items-center gap-2 bg-secondary border border-border rounded-lg px-3 py-1.5 transition-all duration-200',
                searchOpen ? 'w-64' : 'w-36 md:w-48'
            )}>
                <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <input
                    type="text"
                    placeholder="Search..."
                    onFocus={() => setSearchOpen(true)}
                    onBlur={() => setSearchOpen(false)}
                    className="bg-transparent text-sm outline-none w-full text-foreground placeholder:text-muted-foreground"
                />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                >
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>

                {/* Notifications */}
                <Link
                    to="/notifications"
                    className="relative p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                >
                    <Bell className="w-4 h-4" />
                    {notifications > 0 && (
                        <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-primary rounded-full" />
                    )}
                </Link>

                {/* Add */}
                <button className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:block">New</span>
                </button>

                {/* Avatar group (decorative) */}
                <div className="hidden md:flex items-center -space-x-1.5 ml-1">
                    {['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6'].map((color, i) => (
                        <div
                            key={i}
                            className="w-6 h-6 rounded-full border-2 border-background flex items-center justify-center text-[9px] font-bold text-white"
                            style={{ backgroundColor: color }}
                        >
                            {String.fromCharCode(65 + i)}
                        </div>
                    ))}
                    <div className="w-6 h-6 rounded-full border-2 border-background bg-accent flex items-center justify-center text-[9px] font-semibold text-muted-foreground">
                        +4
                    </div>
                </div>

                {/* More */}
                <button className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                    <MoreVertical className="w-4 h-4" />
                </button>
            </div>
        </header>
    );
}