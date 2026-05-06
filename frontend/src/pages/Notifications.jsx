import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell, CheckCircle2, AlertCircle, Users, CheckSquare,
    Trash2, CheckCheck, Circle
} from 'lucide-react';

const MOCK_NOTIFS = [
    { id: 1, type: 'task', title: 'New task assigned to you', desc: '"Optimize Lead Scoring" was assigned by Maria S.', time: '2 minutes ago', read: false, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 2, type: 'team', title: 'You were added to AI Engineering', desc: 'Alex J. added you as a team member', time: '1 hour ago', read: false, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { id: 3, type: 'alert', title: 'Task overdue: Train AI Chatbot', desc: 'This task was due yesterday and is still pending', time: '3 hours ago', read: false, color: 'text-red-500', bg: 'bg-red-500/10' },
    { id: 4, type: 'task', title: 'Task completed by James K.', desc: '"Launch AI Dashboard" marked as done', time: 'Yesterday', read: true, color: 'text-green-500', bg: 'bg-green-500/10' },
    { id: 5, type: 'team', title: 'New team member joined', desc: 'Priya N. joined Marketing AI team', time: '2 days ago', read: true, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { id: 6, type: 'alert', title: 'Access request pending', desc: 'Tom W. requested access to Finance AI project', time: '2 days ago', read: true, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { id: 7, type: 'task', title: 'Comment on your task', desc: 'Sarah C. commented on "Generate AI Blog Draft"', time: '3 days ago', read: true, color: 'text-blue-500', bg: 'bg-blue-500/10' },
];

const ICON_MAP = {
    task: CheckSquare,
    team: Users,
    alert: AlertCircle,
};

export default function Notifications() {
    const [notifs, setNotifs] = useState(MOCK_NOTIFS);
    const [filter, setFilter] = useState('all');

    const unread = notifs.filter(n => !n.read).length;
    const displayed = filter === 'unread' ? notifs.filter(n => !n.read) : notifs;

    const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    const markRead = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    const deleteNotif = (id) => setNotifs(prev => prev.filter(n => n.id !== id));

    return (
        <DashboardLayout title="Notifications" subtitle={`${unread} unread`}>
            <div className="max-w-2xl">
                {/* Header actions */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 bg-secondary border border-border rounded-lg p-1">
                        {['all', 'unread'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-all capitalize ${filter === f ? 'bg-card text-foreground shadow-sm border border-border' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {f} {f === 'unread' && unread > 0 && `(${unread})`}
                            </button>
                        ))}
                    </div>
                    {unread > 0 && (
                        <button
                            onClick={markAllRead}
                            className="flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold"
                        >
                            <CheckCheck className="w-3.5 h-3.5" />
                            Mark all as read
                        </button>
                    )}
                </div>

                <div className="space-y-1">
                    <AnimatePresence>
                        {displayed.map((n) => {
                            const Icon = ICON_MAP[n.type] || Bell;
                            return (
                                <motion.div
                                    key={n.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10, height: 0 }}
                                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-colors cursor-pointer group ${n.read
                                            ? 'bg-card border-border hover:bg-accent/40'
                                            : 'bg-primary/5 border-primary/20 hover:bg-primary/10'
                                        }`}
                                    onClick={() => markRead(n.id)}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.bg}`}>
                                        <Icon className={`w-4 h-4 ${n.color}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className={`text-sm font-medium ${n.read ? 'text-foreground' : 'text-foreground'}`}>
                                                {n.title}
                                            </p>
                                            <span className="text-[10px] text-muted-foreground shrink-0">{n.time}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                        {!n.read && (
                                            <button
                                                onClick={e => { e.stopPropagation(); markRead(n.id); }}
                                                className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground"
                                                title="Mark as read"
                                            >
                                                <Circle className="w-3 h-3" />
                                            </button>
                                        )}
                                        <button
                                            onClick={e => { e.stopPropagation(); deleteNotif(n.id); }}
                                            className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                    {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {displayed.length === 0 && (
                        <div className="text-center py-12">
                            <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
                            <p className="font-semibold text-foreground">All caught up!</p>
                            <p className="text-sm text-muted-foreground">No {filter === 'unread' ? 'unread' : ''} notifications</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}