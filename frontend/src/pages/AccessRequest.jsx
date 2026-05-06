import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { Plus, CheckCircle2, XCircle, Clock, Key, MoreHorizontal } from 'lucide-react';

const REQUESTS = [
    { id: 1, user: 'Tom Williams', email: 'tom@acme.com', resource: 'Finance AI Project', type: 'project', status: 'pending', requested: '1 hour ago', avatar: '#f59e0b' },
    { id: 2, user: 'Lisa Park', email: 'lisa@startup.io', resource: 'Data Insights Team', type: 'team', status: 'approved', requested: '3 hours ago', avatar: '#ec4899' },
    { id: 3, user: 'Marcus Lee', email: 'marcus@corp.com', resource: 'Lead Scoring Project', type: 'project', status: 'denied', requested: 'Yesterday', avatar: '#10b981' },
    { id: 4, user: 'Amy Chen', email: 'amy@ventures.com', resource: 'Analytics Field', type: 'field', status: 'pending', requested: '2 days ago', avatar: '#6366f1' },
    { id: 5, user: 'Raj Kumar', email: 'raj@tech.io', resource: 'Social Boost Project', type: 'project', status: 'pending', requested: '2 days ago', avatar: '#8b5cf6' },
];

const STATUS_CONFIG = {
    pending: { label: 'Pending', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    approved: { label: 'Approved', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
    denied: { label: 'Denied', icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
};

export default function AccessRequests() {
    const [requests, setRequests] = useState(REQUESTS);
    const [filter, setFilter] = useState('all');

    const handle = (id, action) => {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
    };

    const displayed = filter === 'all' ? requests : requests.filter(r => r.status === filter);

    return (
        <DashboardLayout title="Access Requests" subtitle="Manage resource access">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-1 bg-secondary border border-border rounded-lg p-1">
                    {['all', 'pending', 'approved', 'denied'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-all capitalize ${filter === f ? 'bg-card text-foreground shadow-sm border border-border' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {f}
                            {f === 'pending' && requests.filter(r => r.status === 'pending').length > 0 && (
                                <span className="ml-1 bg-primary text-primary-foreground text-[9px] px-1 rounded-full">
                                    {requests.filter(r => r.status === 'pending').length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
                <button className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                    New Request
                </button>
            </div>

            <div className="space-y-3">
                {displayed.map((req, i) => {
                    const status = STATUS_CONFIG[req.status];
                    const StatusIcon = status.icon;
                    return (
                        <motion.div
                            key={req.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="bg-card border border-border rounded-xl p-4 hover:shadow-sm transition-shadow"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor: req.avatar }}>
                                    {req.user[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="font-semibold text-sm text-foreground">{req.user}</p>
                                        <span className="text-[10px] text-muted-foreground">{req.requested}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{req.email}</p>
                                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Key className="w-3 h-3" />
                                            <span>Requested access to</span>
                                            <span className="font-semibold text-foreground">{req.resource}</span>
                                        </div>
                                        <span className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded capitalize">{req.type}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                                <div className={`flex items-center gap-1.5 text-xs font-medium ${status.color}`}>
                                    <StatusIcon className="w-3.5 h-3.5" />
                                    {status.label}
                                </div>
                                {req.status === 'pending' && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handle(req.id, 'denied')}
                                            className="flex items-center gap-1 text-xs text-red-500 hover:bg-red-500/10 px-2.5 py-1 rounded-lg transition-colors font-medium"
                                        >
                                            <XCircle className="w-3.5 h-3.5" />
                                            Deny
                                        </button>
                                        <button
                                            onClick={() => handle(req.id, 'approved')}
                                            className="flex items-center gap-1 text-xs text-white bg-green-500 hover:bg-green-600 px-2.5 py-1 rounded-lg transition-colors font-medium"
                                        >
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            Approve
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </DashboardLayout>
    );
}