import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { Plus, MoreHorizontal, Users, CheckSquare, Calendar, BarChart2 } from 'lucide-react';

const PROJECTS = [
    { id: 1, name: 'Task Automate', desc: 'Automate repetitive tasks with AI-driven workflows', tasks: 18, members: 5, progress: 76, status: 'active', color: 'bg-blue-500', dueDate: 'Mar 28' },
    { id: 2, name: 'Lead Scoring', desc: 'AI-powered lead qualification and scoring system', tasks: 15, members: 3, progress: 54, status: 'active', color: 'bg-orange-500', dueDate: 'Apr 10' },
    { id: 3, name: 'Sentiment AI', desc: 'Real-time sentiment analysis for customer feedback', tasks: 7, members: 4, progress: 88, status: 'active', color: 'bg-purple-500', dueDate: 'Apr 5' },
    { id: 4, name: 'Script AI', desc: 'Automated script generation for sales and outreach', tasks: 3, members: 2, progress: 22, status: 'active', color: 'bg-green-500', dueDate: 'May 1' },
    { id: 5, name: 'Social Boost', desc: 'Schedule and optimize social media content with AI', tasks: 9, members: 6, progress: 33, status: 'active', color: 'bg-pink-500', dueDate: 'Apr 20' },
    { id: 6, name: 'Heatmap AI', desc: 'Visual user behavior analysis and heatmapping', tasks: 6, members: 3, progress: 60, status: 'paused', color: 'bg-yellow-500', dueDate: 'May 15' },
];

export default function Projects() {
    const [view, setView] = useState('grid');

    return (
        <DashboardLayout title="Projects" subtitle="All workspace projects">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setView('grid')}
                        className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${view === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'}`}
                    >
                        Grid
                    </button>
                    <button
                        onClick={() => setView('list')}
                        className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'}`}
                    >
                        List
                    </button>
                </div>
                <button className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                    New Project
                </button>
            </div>

            {view === 'grid' ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {PROJECTS.map((p, i) => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all cursor-pointer group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2.5">
                                    <div className={`w-8 h-8 ${p.color} rounded-lg flex items-center justify-center`}>
                                        <BarChart2 className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm text-foreground">{p.name}</h3>
                                        <span className={`text-[10px] font-semibold ${p.status === 'active' ? 'text-green-500' : 'text-yellow-500'}`}>
                                            {p.status === 'active' ? 'Active' : 'Paused'}
                                        </span>
                                    </div>
                                </div>
                                <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </div>

                            <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{p.desc}</p>

                            <div className="mb-3">
                                <div className="flex items-center justify-between text-[11px] mb-1">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="font-semibold text-foreground">{p.progress}%</span>
                                </div>
                                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${p.progress}%` }}
                                        transition={{ delay: 0.3 + i * 0.06, duration: 0.6 }}
                                        className={`h-full ${p.color} rounded-full`}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                                    <span className="flex items-center gap-1"><CheckSquare className="w-3 h-3" />{p.tasks} tasks</span>
                                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{p.members}</span>
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{p.dueDate}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                    {PROJECTS.map((p, i) => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center gap-4 px-4 py-3 border-b border-border last:border-0 hover:bg-accent/40 transition-colors cursor-pointer"
                        >
                            <div className={`w-7 h-7 ${p.color} rounded-lg flex items-center justify-center shrink-0`}>
                                <BarChart2 className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground">{p.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{p.desc}</p>
                            </div>
                            <div className="hidden md:flex items-center gap-1">
                                <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                                    <div className={`h-full ${p.color} rounded-full`} style={{ width: `${p.progress}%` }} />
                                </div>
                                <span className="text-xs text-muted-foreground w-8">{p.progress}%</span>
                            </div>
                            <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
                                <span>{p.tasks} tasks</span>
                                <span>{p.members} members</span>
                                <span>{p.dueDate}</span>
                            </div>
                            <span className={`text-[10px] font-semibold ${p.status === 'active' ? 'text-green-500' : 'text-yellow-500'}`}>
                                {p.status}
                            </span>
                        </motion.div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}