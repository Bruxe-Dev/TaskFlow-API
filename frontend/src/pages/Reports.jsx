import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { Plus, AlertCircle, Clock, CheckCircle2, User, MoreHorizontal, Filter } from 'lucide-react';

const REPORTS = [
    { id: 1, title: 'Dashboard performance lag', desc: 'The dashboard takes 5+ seconds to load when there are more than 50 tasks', status: 'open', priority: 'high', assignee: 'James K.', color: '#6366f1', created: '2 days ago' },
    { id: 2, title: 'Email notifications not sending', desc: 'Users not receiving email alerts for overdue tasks since March 20', status: 'in_progress', priority: 'critical', assignee: 'Maria S.', color: '#ec4899', created: '3 days ago' },
    { id: 3, title: 'Kanban drag-drop broken on mobile', desc: 'Task cards cannot be reordered on iOS Safari browser', status: 'open', priority: 'medium', assignee: null, color: null, created: '1 week ago' },
    { id: 4, title: 'AI suggestions returning wrong tasks', desc: 'Task suggestion API returning unrelated project tasks', status: 'resolved', priority: 'high', assignee: 'Alex J.', color: '#8b5cf6', created: '2 weeks ago' },
    { id: 5, title: 'Team member cannot view projects', desc: 'New team members with "viewer" role cannot see project list', status: 'in_progress', priority: 'medium', assignee: 'Priya N.', color: '#14b8a6', created: '4 days ago' },
];

const PRIORITY_STYLES = {
    critical: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
    high: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400',
    low: 'bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400',
};

const STATUS_STYLES = {
    open: { label: 'Open', icon: AlertCircle, color: 'text-orange-500' },
    in_progress: { label: 'In Progress', icon: Clock, color: 'text-blue-500' },
    resolved: { label: 'Resolved', icon: CheckCircle2, color: 'text-green-500' },
};

export default function Reports() {
    const [filter, setFilter] = useState('all');

    const displayed = filter === 'all' ? REPORTS : REPORTS.filter(r => r.status === filter);

    return (
        <DashboardLayout title="Problem Reports" subtitle="Track and resolve issues">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-1 bg-secondary border border-border rounded-lg p-1">
                    {['all', 'open', 'in_progress', 'resolved'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-all capitalize ${filter === f ? 'bg-card text-foreground shadow-sm border border-border' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {f.replace('_', ' ')}
                        </button>
                    ))}
                </div>
                <button className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                    Report Issue
                </button>
            </div>

            <div className="space-y-3">
                {displayed.map((r, i) => {
                    const status = STATUS_STYLES[r.status];
                    const StatusIcon = status.icon;
                    return (
                        <motion.div
                            key={r.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="bg-card border border-border rounded-xl p-4 hover:shadow-sm transition-shadow cursor-pointer group"
                        >
                            <div className="flex items-start gap-3">
                                <StatusIcon className={`w-4 h-4 ${status.color} shrink-0 mt-0.5`} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-semibold text-sm text-foreground">{r.title}</h3>
                                        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground shrink-0">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.desc}</p>
                                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${PRIORITY_STYLES[r.priority]}`}>
                                            {r.priority}
                                        </span>
                                        <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
                                        <span className="text-[11px] text-muted-foreground">{r.created}</span>
                                        {r.assignee && (
                                            <div className="flex items-center gap-1.5 ml-auto">
                                                <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ backgroundColor: r.color }}>
                                                    {r.assignee[0]}
                                                </div>
                                                <span className="text-xs text-muted-foreground">{r.assignee}</span>
                                            </div>
                                        )}
                                        {!r.assignee && (
                                            <button className="flex items-center gap-1 text-xs text-primary hover:underline ml-auto">
                                                <User className="w-3 h-3" />
                                                Assign
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </DashboardLayout>
    );
}