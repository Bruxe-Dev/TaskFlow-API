import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Home, Layers, CheckSquare, Users, Bell, FileText, AlertCircle,
    Settings, LogOut, ChevronDown, ChevronRight, Star, Archive,
    Briefcase, Building2, LayoutDashboard, MessageSquare, Zap,
    BarChart2, Key, ClipboardList, X
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
    { label: 'Home', icon: Home, path: '/dashboard', exact: true },
    { label: 'AI Flow', icon: Zap, path: '/ai', badge: 'AI' },
    { label: 'Tasks', icon: CheckSquare, path: '/tasks' },
];

const PROJECTS = [
    { label: 'Sales Forecast', icon: BarChart2, path: '/projects/1', count: 2, color: 'bg-orange-400' },
    { label: 'Sentiment AI', icon: Zap, path: '/projects/2', count: 7, color: 'bg-purple-400' },
    { label: 'Task Automate', icon: CheckSquare, path: '/projects/3', count: 18, color: 'bg-blue-400', active: true },
    { label: 'Script AI', icon: FileText, path: '/projects/4', count: 3, color: 'bg-green-400' },
    { label: 'Lead Scoring', icon: Star, path: '/projects/5', count: 15, color: 'bg-yellow-400' },
    { label: 'Heatmap AI', icon: Layers, path: '/projects/6', count: 6, color: 'bg-pink-400' },
    { label: 'Social Boost', icon: MessageSquare, path: '/projects/7', count: 9, color: 'bg-cyan-400' },
];

const CATEGORIES = [
    { label: 'Marketing AI', path: '/categories/marketing', color: 'bg-orange-400' },
    { label: 'Chatbots', path: '/categories/chatbots', color: 'bg-purple-400' },
    { label: 'Finance AI', path: '/categories/finance', color: 'bg-blue-400' },
];

const BOTTOM_NAV = [
    { label: 'Teams', icon: Users, path: '/teams' },
    { label: 'Workspace', icon: Briefcase, path: '/workspace' },
    { label: 'Organizations', icon: Building2, path: '/organizations' },
    { label: 'Reports', icon: AlertCircle, path: '/reports' },
    { label: 'Access Requests', icon: Key, path: '/access-requests' },
    { label: 'Submissions', icon: ClipboardList, path: '/submissions' },
    { label: 'Notifications', icon: Bell, path: '/notifications' },
    { label: 'Analytics', icon: BarChart2, path: '/analytics' },
    { label: 'Settings', icon: Settings, path: '/settings' },
];

function NavItem({ item, collapsed }) {
    const location = useLocation();
    const isActive = item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

    return (
        <Link
            to={item.path}
            className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            )}
        >
            <item.icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-primary' : '')} />
            {!collapsed && (
                <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                        <span className="text-[10px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                            {item.badge}
                        </span>
                    )}
                </>
            )}
        </Link>
    );
}

export default function Sidebar() {
    const { sidebarOpen, setSidebarOpen, user, logout } = useApp();
    const [projectsOpen, setProjectsOpen] = useState(true);
    const [categoriesOpen, setCategoriesOpen] = useState(true);
    const [archiveOpen, setArchiveOpen] = useState(false);
    const location = useLocation();

    return (
        <>
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside className={cn(
                'fixed left-0 top-0 h-full z-40 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300',
                sidebarOpen ? 'w-56' : 'w-0 lg:w-14 overflow-hidden'
            )}>
                {/* Logo */}
                <div className="flex items-center gap-2.5 px-4 py-4 border-b border-sidebar-border shrink-0">
                    <img src="https://media.base44.com/images/public/69f614189797919daf3749bb/9acd298b7_generated_image.png" alt="Taskflow" className="w-7 h-7 rounded-lg object-cover shrink-0" />
                    {sidebarOpen && (
                        <span className="font-bold text-base text-foreground tracking-tight">Taskflow</span>
                    )}
                </div>

                {/* User info */}
                {sidebarOpen && user && (
                    <div className="px-3 py-3 border-b border-sidebar-border shrink-0">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-primary">
                                    {user.name?.[0]?.toUpperCase()}
                                </span>
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                                <p className="text-[10px] text-muted-foreground truncate capitalize">{user.role?.replace('_', ' ')}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Scrollable nav */}
                <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
                    {/* Main nav */}
                    {NAV_ITEMS.map(item => (
                        <NavItem key={item.path} item={item} collapsed={!sidebarOpen} />
                    ))}

                    {sidebarOpen && (
                        <>
                            {/* Favorites section */}
                            <div className="pt-3">
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 pb-1.5">Favorites</p>
                                {[{ label: 'AI Writer', icon: Zap, path: '/projects/ai-writer', color: 'bg-blue-400' },
                                { label: 'Data Insights', icon: BarChart2, path: '/projects/data-insights', color: 'bg-green-400' },
                                { label: 'Predictive AI', icon: Layers, path: '/projects/predictive-ai', color: 'bg-purple-400' }
                                ].map(p => (
                                    <Link key={p.path} to={p.path} className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
                                        <div className={cn('w-2 h-2 rounded-sm shrink-0', p.color)} />
                                        <span className="truncate">{p.label}</span>
                                    </Link>
                                ))}
                            </div>

                            {/* All Projects */}
                            <div className="pt-3">
                                <button
                                    onClick={() => setProjectsOpen(v => !v)}
                                    className="w-full flex items-center gap-1 px-3 pb-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                                >
                                    {projectsOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                    All Projects
                                </button>
                                {projectsOpen && PROJECTS.map(p => {
                                    const isActive = location.pathname === p.path;
                                    return (
                                        <Link key={p.path} to={p.path} className={cn(
                                            'flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm transition-colors',
                                            isActive ? 'bg-primary/10 text-primary font-medium' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                                        )}>
                                            <div className={cn('w-2 h-2 rounded-sm shrink-0', p.color)} />
                                            <span className="flex-1 truncate">{p.label}</span>
                                            <span className="text-[10px] text-muted-foreground">{p.count}</span>
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Categories */}
                            <div className="pt-3">
                                <button
                                    onClick={() => setCategoriesOpen(v => !v)}
                                    className="w-full flex items-center gap-1 px-3 pb-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                                >
                                    {categoriesOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                    Categories
                                </button>
                                {categoriesOpen && CATEGORIES.map(c => (
                                    <Link key={c.path} to={c.path} className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
                                        <div className={cn('w-2 h-2 rounded-sm shrink-0', c.color)} />
                                        <span className="truncate">{c.label}</span>
                                    </Link>
                                ))}
                            </div>

                            {/* Archive */}
                            <div className="pt-3">
                                <button
                                    onClick={() => setArchiveOpen(v => !v)}
                                    className="w-full flex items-center gap-1 px-3 pb-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                                >
                                    {archiveOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                    Archive
                                </button>
                            </div>

                            <div className="pt-3 border-t border-sidebar-border">
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 pb-1.5">More</p>
                                {BOTTOM_NAV.map(item => (
                                    <NavItem key={item.path} item={item} collapsed={false} />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Collapsed state - show bottom nav icons */}
                    {!sidebarOpen && BOTTOM_NAV.map(item => (
                        <NavItem key={item.path} item={item} collapsed={true} />
                    ))}
                </nav>

                {/* Bottom - Upgrade & Logout */}
                {sidebarOpen && (
                    <div className="p-3 border-t border-sidebar-border shrink-0 space-y-2">
                        <div className="relative bg-primary/10 rounded-xl p-3">
                            <button className="absolute top-2 right-2 text-muted-foreground hover:text-foreground">
                                <X className="w-3 h-3" />
                            </button>
                            <p className="text-xs font-semibold text-foreground">Unlock Premium</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Advanced AI, automation, and insights.</p>
                            <button className="mt-2 w-full bg-primary text-primary-foreground text-xs font-semibold py-1.5 rounded-lg hover:bg-primary/90 transition-colors">
                                Upgrade to premium
                            </button>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-destructive transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Sign out</span>
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
}