import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCheck, Trash2, MessageSquare, UserPlus, CheckSquare, AlertTriangle, Zap } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';

const notifs = [
    { id: 1, type: 'task', title: 'Task assigned to you', desc: 'Generate AI Blog Draft has been assigned to you by Sarah K.', time: '2 min ago', read: false, icon: CheckSquare, color: 'text-violet-500 bg-violet-500/10' },
    { id: 2, type: 'comment', title: 'New comment on your task', desc: 'Mike R commented on "Set Up AI Lead Scoring": Looks good, but we need to review the scoring threshold.', time: '15 min ago', read: false, icon: MessageSquare, color: 'text-blue-500 bg-blue-500/10' },
    { id: 3, type: 'member', title: 'New team member', desc: 'Emma L has joined the AI Development team.', time: '1 hour ago', read: false, icon: UserPlus, color: 'text-emerald-500 bg-emerald-500/10' },
    { id: 4, type: 'alert', title: 'Task overdue', desc: '"Optimize Lead Scoring" is 2 days overdue. Please update the status.', time: '3 hours ago', read: false, icon: AlertTriangle, color: 'text-red-500 bg-red-500/10' },
    { id: 5, type: 'task', title: 'Task completed', desc: '"Launch AI Dashboard" was marked as complete by Jordan P.', time: '5 hours ago', read: true, icon: CheckSquare, color: 'text-emerald-500 bg-emerald-500/10' },
    { id: 6, type: 'ai', title: 'AI Suggestion available', desc: 'Taskflow AI has prioritized 3 tasks for you based on deadlines and impact.', time: '1 day ago', read: true, icon: Zap, color: 'text-amber-500 bg-amber-500/10' },
    { id: 7, type: 'comment', title: 'Mentioned in comment', desc: 'Lisa M mentioned you in "Refine AI Blog Text": @Alex, can you review this draft?', time: '1 day ago', read: true, icon: MessageSquare, color: 'text-blue-500 bg-blue-500/10' },
];

export default function Notifications() {
    const [items, setItems] = useState(notifs);
    const [filter, setFilter] = useState('all');

    const markAllRead = () => setItems(prev => prev.map(n => ({ ...n, read: true })));
    const clearAll = () => setItems([]);
    const markRead = (id) => setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    const remove = (id) => setItems(prev => prev.filter(n => n.id !== id));

    const filtered = items.filter(n => filter === 'all' || (filter === 'unread' && !n.read) || n.type === filter);
    const unreadCount = items.filter(n => !n.read).length;

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <TopBar title="Notifications" />
            <div className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-foreground" />
                        <h2 className="font-bold text-foreground text-lg">Notifications</h2>
                        {unreadCount > 0 && (
                            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-medium">{unreadCount}</span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button onClick={markAllRead} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                            <CheckCheck className="w-4 h-4" /> Mark all read
                        </button>
                        <button onClick={clearAll} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="w-4 h-4" /> Clear all
                        </button>
                    </div>
                </div>

                <div className="flex gap-2 mb-4">
                    {['all', 'unread', 'task', 'comment', 'alert'].map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
                            {f}
                        </button>
                    ))}
                </div>

                <div className="space-y-2">
                    {filtered.length === 0 && (
                        <div className="text-center py-16 text-muted-foreground">
                            <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p className="text-sm">No notifications</p>
                        </div>
                    )}
                    {filtered.map((notif, i) => (
                        <motion.div key={notif.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                            className={`flex items-start gap-4 p-4 rounded-xl border transition-all group cursor-pointer ${notif.read ? 'bg-card border-border' : 'bg-primary/5 border-primary/20'}`}
                            onClick={() => markRead(notif.id)}>
                            <div className={`w-9 h-9 rounded-xl ${notif.color} flex items-center justify-center shrink-0`}>
                                <notif.icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm font-semibold ${notif.read ? 'text-foreground' : 'text-foreground'}`}>{notif.title}</span>
                                    {!notif.read && <div className="w-2 h-2 rounded-full bg-primary" />}
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{notif.desc}</p>
                                <span className="text-xs text-muted-foreground/60 mt-1 block">{notif.time}</span>
                            </div>
                            <button onClick={e => { e.stopPropagation(); remove(notif.id); }}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-accent rounded-md text-muted-foreground hover:text-destructive transition-all">
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}