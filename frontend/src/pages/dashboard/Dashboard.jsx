import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    TrendingUp, CheckSquare, Clock, AlertTriangle, Plus, ArrowRight,
    BarChart3, Users, FolderOpen, Calendar, Zap
} from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import { useApp } from '@/context/AppContext';

const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } })
};

const stats = [
    { label: 'Total Tasks', value: '248', change: '+12%', icon: CheckSquare, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { label: 'In Progress', value: '64', change: '+5%', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Completed', value: '181', change: '+18%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Overdue', value: '3', change: '-2', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
];

const recentTasks = [
    { title: 'Generate AI Blog Draft', project: 'Script AI', status: 'todo', tag: 'MARKETING', tagColor: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400', comments: 3, daysLeft: 2 },
    { title: 'Set Up AI Lead Scoring', project: 'Lead Scoring', status: 'doing', tag: 'DEVELOPMENT', tagColor: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400', comments: 1, daysLeft: 5 },
    { title: 'Automate Social Media Posts', project: 'Social Boost', status: 'todo', tag: 'MARKETING', tagColor: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400', comments: 2, daysLeft: 3 },
    { title: 'Train AI Chatbot Responses', project: 'Chatbots', status: 'todo', tag: 'AI TRAINING', tagColor: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400', comments: 4, daysLeft: 7 },
    { title: 'Optimize Lead Scoring', project: 'Lead Scoring', status: 'doing', tag: 'ENGINEERING', tagColor: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400', comments: 1, daysLeft: 1 },
];

const projects = [
    { name: 'Task Automate', tasks: 18, done: 12, color: 'bg-indigo-500' },
    { name: 'Lead Scoring', tasks: 15, done: 10, color: 'bg-emerald-500' },
    { name: 'Sentiment AI', tasks: 7, done: 4, color: 'bg-violet-500' },
    { name: 'Social Boost', tasks: 9, done: 7, color: 'bg-pink-500' },
];

export default function Dashboard() {
    const { user } = useApp();

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <TopBar title="Home" />
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Greeting */}
                <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                    <h2 className="text-2xl font-bold text-foreground">
                        Good morning, {user?.name?.split(' ')[0]} 👋
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">Here's what's happening across your workspace today.</p>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((s, i) => (
                        <motion.div key={s.label} initial="hidden" animate="visible" variants={fadeUp} custom={i + 1}
                            className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
                                <div className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center`}>
                                    <s.icon className={`w-4 h-4 ${s.color}`} />
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-foreground">{s.value}</div>
                            <div className={`text-xs mt-1 font-medium ${s.change.startsWith('+') ? 'text-emerald-500' : s.change.startsWith('-') && s.label === 'Overdue' ? 'text-emerald-500' : 'text-red-500'}`}>
                                {s.change} this week
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Recent tasks */}
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5}
                        className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                            <h3 className="font-semibold text-foreground">Recent Tasks</h3>
                            <Link to="/dashboard/tasks" className="text-xs text-primary hover:underline flex items-center gap-1">
                                View all <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="divide-y divide-border">
                            {recentTasks.map((task, i) => (
                                <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-accent/30 transition-colors group">
                                    <div className={`w-2 h-2 rounded-full shrink-0 ${task.status === 'done' ? 'bg-emerald-500' : task.status === 'doing' ? 'bg-blue-500' : 'bg-muted-foreground/30'}`} />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-foreground truncate">{task.title}</div>
                                        <div className="text-xs text-muted-foreground">{task.project}</div>
                                    </div>
                                    <div className="hidden md:flex items-center gap-2 shrink-0">
                                        <span className="text-xs text-muted-foreground">{task.comments} comments</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${task.tagColor}`}>{task.tag}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Projects sidebar */}
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6}
                        className="bg-card border border-border rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                            <h3 className="font-semibold text-foreground">Active Projects</h3>
                            <Link to="/dashboard/projects" className="text-xs text-primary hover:underline">
                                <Plus className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="p-4 space-y-4">
                            {projects.map((p, i) => (
                                <div key={i}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-sm ${p.color}`} />
                                            <span className="text-sm font-medium text-foreground">{p.name}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{p.done}/{p.tasks}</span>
                                    </div>
                                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                        <div className={`h-full ${p.color} rounded-full transition-all`} style={{ width: `${(p.done / p.tasks) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="px-4 pb-4">
                            <Link to="/dashboard/projects" className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground border border-dashed border-border rounded-lg py-2.5 hover:border-primary/50 transition-colors">
                                <Plus className="w-4 h-4" /> New Project
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Quick links */}
                <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={7}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { icon: Users, label: 'Teams', path: '/dashboard/teams', color: 'text-violet-500 bg-violet-500/10' },
                            { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics', color: 'text-blue-500 bg-blue-500/10' },
                            { icon: Calendar, label: 'Calendar', path: '/dashboard/calendar', color: 'text-emerald-500 bg-emerald-500/10' },
                            { icon: Zap, label: 'AI Assistant', path: '/dashboard/ai', color: 'text-amber-500 bg-amber-500/10' },
                        ].map(item => (
                            <Link key={item.path} to={item.path}
                                className="bg-card border border-border rounded-xl p-4 flex items-center gap-3 hover:border-primary/30 hover:bg-accent/30 transition-all group">
                                <div className={`w-9 h-9 rounded-lg ${item.color} flex items-center justify-center`}>
                                    <item.icon className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium text-foreground">{item.label}</span>
                                <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}