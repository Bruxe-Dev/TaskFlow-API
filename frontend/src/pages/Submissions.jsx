import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { Plus, CheckCircle2, XCircle, Clock, Eye, MoreHorizontal } from 'lucide-react';

const SUBMISSIONS = [
    { id: 1, title: 'Q1 Performance Report', type: 'report', submitter: 'Maria Santos', color: '#8b5cf6', status: 'pending', submitted: '2 hours ago', desc: 'Quarterly performance metrics and team achievements summary' },
    { id: 2, title: 'AI Blog Draft - March Edition', type: 'content', submitter: 'James Kim', color: '#ec4899', status: 'approved', submitted: '1 day ago', desc: 'Blog article about AI trends in project management' },
    { id: 3, title: 'Lead Scoring Algorithm v2', type: 'technical', submitter: 'Priya Nair', color: '#14b8a6', status: 'pending', submitted: '2 days ago', desc: 'Updated algorithm for scoring leads based on behavioral data' },
    { id: 4, title: 'Social Media Calendar - April', type: 'content', submitter: 'Amy Chen', color: '#6366f1', status: 'rejected', submitted: '3 days ago', desc: 'Monthly social media posting schedule and content strategy' },
    { id: 5, title: 'Sprint 3 Retrospective', type: 'report', submitter: 'Chris Davis', color: '#ef4444', status: 'approved', submitted: '1 week ago', desc: 'Team retrospective notes and improvement action items' },
];

const STATUS_CONFIG = {
    pending: { label: 'Pending Review', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    approved: { label: 'Approved', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
    rejected: { label: 'Rejected', icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
};

const TYPE_COLORS = {
    report: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
    content: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
    technical: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
};

export default function Submissions() {
    const [submissions, setSubmissions] = useState(SUBMISSIONS);
    const [filter, setFilter] = useState('all');

    const review = (id, action) => {
        setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: action } : s));
    };

    const displayed = filter === 'all' ? submissions : submissions.filter(s => s.status === filter);

    return (
        <DashboardLayout title="Submissions" subtitle="Review submitted work">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-1 bg-secondary border border-border rounded-lg p-1">
                    {['all', 'pending', 'approved', 'rejected'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-all capitalize ${filter === f ? 'bg-card text-foreground shadow-sm border border-border' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {f}
                            {f === 'pending' && submissions.filter(s => s.status === 'pending').length > 0 && (
                                <span className="ml-1 bg-orange-500 text-white text-[9px] px-1 rounded-full">
                                    {submissions.filter(s => s.status === 'pending').length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
                <button className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                    Submit Work
                </button>
            </div>

            <div className="space-y-3">
                {displayed.map((s, i) => {
                    const status = STATUS_CONFIG[s.status];
                    const StatusIcon = status.icon;
                    return (
                        <motion.div
                            key={s.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="bg-card border border-border rounded-xl p-4 hover:shadow-sm transition-shadow"
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor: s.color }}>
                                    {s.submitter[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-semibold text-sm text-foreground">{s.title}</h3>
                                        <span className="text-[10px] text-muted-foreground shrink-0">{s.submitted}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-0.5">{s.submitter}</p>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{s.desc}</p>
                                    <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${TYPE_COLORS[s.type]}`}>
                                            {s.type}
                                        </span>
                                        <div className={`flex items-center gap-1 text-xs font-medium ${status.color}`}>
                                            <StatusIcon className="w-3 h-3" />
                                            {status.label}
                                        </div>
                                        {s.status === 'pending' && (
                                            <div className="flex items-center gap-2 ml-auto">
                                                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground border border-border px-2.5 py-1 rounded-lg transition-colors">
                                                    <Eye className="w-3 h-3" />
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => review(s.id, 'rejected')}
                                                    className="text-xs text-red-500 hover:bg-red-500/10 px-2.5 py-1 rounded-lg transition-colors font-medium"
                                                >
                                                    Reject
                                                </button>
                                                <button
                                                    onClick={() => review(s.id, 'approved')}
                                                    className="text-xs text-white bg-green-500 hover:bg-green-600 px-2.5 py-1 rounded-lg transition-colors font-medium"
                                                >
                                                    Approve
                                                </button>
                                            </div>
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