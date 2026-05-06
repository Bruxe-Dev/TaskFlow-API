import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import {
    CheckSquare, Clock, AlertCircle, TrendingUp, Plus,
    ArrowUpRight, Users, Layers, MoreHorizontal, Circle,
    CheckCircle2, Timer
} from 'lucide-react';

const STATS = [
    { label: 'Total Tasks', value: '142', change: '+12 this week', icon: CheckSquare, color: 'bg-blue-500/10 text-blue-500' },
    { label: 'In Progress', value: '38', change: '+5 since yesterday', icon: Timer, color: 'bg-orange-500/10 text-orange-500' },
    { label: 'Overdue', value: '7', change: '-2 resolved today', icon: AlertCircle, color: 'bg-red-500/10 text-red-500' },
    { label: 'Completed', value: '97', change: '+18 this week', icon: TrendingUp, color: 'bg-green-500/10 text-green-500' },
];

const RECENT_TASKS = [
    { title: 'Generate AI Blog Draft', project: 'Task Automate', status: 'todo', tag: 'MARKETING', tagColor: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400', comments: 3, assignees: ['#6366f1', '#8b5cf6'] },
    { title: 'Set Up AI Lead Scoring', project: 'Lead Scoring', status: 'doing', tag: 'DEVELOPMENT', tagColor: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400', comments: 1, assignees: ['#ec4899', '#14b8a6', '#6366f1'] },
    { title: 'Automate Social Media Posts', project: 'Social Boost', status: 'todo', tag: 'MARKETING', tagColor: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400', comments: 2, assignees: ['#8b5cf6'] },
    { title: 'Optimize Lead Scoring', project: 'Lead Scoring', status: 'doing', tag: 'ENGINEERING', tagColor: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400', comments: 1, assignees: ['#6366f1', '#ec4899'] },
    { title: 'Launch AI Dashboard', project: 'Task Automate', status: 'done', tag: 'AUTOMATION', tagColor: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400', comments: 7, assignees: ['#14b8a6'] },
];

const PROJECTS = [
    { name: 'Task Automate', tasks: 18, progress: 76, color: 'bg-blue-500' },
    { name: 'Lead Scoring', tasks: 15, progress: 54, color: 'bg-orange-500' },
    { name: 'Social Boost', tasks: 9, progress: 33, color: 'bg-pink-500' },
    { name: 'Sentiment AI', tasks: 7, progress: 88, color: 'bg-purple-500' },
];

const STATUS_ICON = {
    todo: <Circle className="w-3.5 h-3.5 text-muted-foreground" />,
    doing: <Timer className="w-3.5 h-3.5 text-blue-500" />,
    done: <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />,
};

function StatCard({ stat, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07, duration: 0.4 }}
            className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow"
        >
            <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <p className="text-2xl font-black text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            <p className="text-[10px] text-green-500 font-medium mt-1">{stat.change}</p>
        </motion.div>
    );
}

export default function Dashboard() {
    return (
        <DashboardLayout title="Dashboard" subtitle="Welcome back, Alex 👋">
            <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {STATS.map((s, i) => <StatCard key={s.label} stat={s} index={i} />)}
                </div>

                <div className="grid lg:grid-cols-3 gap-5">
                    {/* Recent Tasks */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden"
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                            <h2 className="font-semibold text-foreground text-sm">Recent Tasks</h2>
                            <button className="text-xs text-primary font-semibold hover:underline">View all</button>
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center gap-1 px-4 pt-3 pb-2">
                            {['All', 'To Do', 'Doing', 'Done'].map((tab, i) => (
                                <button
                                    key={tab}
                                    className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${i === 0
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="divide-y divide-border">
                            {RECENT_TASKS.map((task, i) => (
                                <motion.div
                                    key={task.title}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.35 + i * 0.05 }}
                                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent/40 transition-colors cursor-pointer group"
                                >
                                    <div className="shrink-0">{STATUS_ICON[task.status]}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-foreground truncate font-medium">{task.title}</p>
                                        <p className="text-[10px] text-muted-foreground">{task.project}</p>
                                    </div>
                                    {/* Assignees */}
                                    <div className="hidden sm:flex -space-x-1 shrink-0">
                                        {task.assignees.slice(0, 3).map((c, j) => (
                                            <div key={j} className="w-5 h-5 rounded-full border-2 border-card text-[8px] font-bold text-white flex items-center justify-center" style={{ backgroundColor: c }}>
                                                {String.fromCharCode(65 + j)}
                                            </div>
                                        ))}
                                    </div>
                                    {/* Comments */}
                                    <div className="hidden sm:flex items-center gap-1 text-[11px] text-muted-foreground shrink-0">
                                        <span>{task.comments}</span>
                                    </div>
                                    {/* Tag */}
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${task.tagColor}`}>
                                        {task.tag}
                                    </span>
                                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground">
                                        <MoreHorizontal className="w-3.5 h-3.5" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>

                        <div className="px-4 py-3 border-t border-border">
                            <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                                <Plus className="w-3.5 h-3.5" />
                                Add task
                            </button>
                        </div>
                    </motion.div>

                    {/* Projects sidebar */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.4 }}
                        className="space-y-4"
                    >
                        {/* Active projects */}
                        <div className="bg-card border border-border rounded-xl overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                                <h2 className="font-semibold text-foreground text-sm">Active Projects</h2>
                                <button className="text-xs text-primary font-semibold hover:underline">All</button>
                            </div>
                            <div className="p-4 space-y-3">
                                {PROJECTS.map((p, i) => (
                                    <div key={p.name}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-medium text-foreground">{p.name}</span>
                                            <span className="text-[10px] text-muted-foreground">{p.progress}%</span>
                                        </div>
                                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${p.progress}%` }}
                                                transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                                                className={`h-full ${p.color} rounded-full`}
                                            />
                                        </div>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">{p.tasks} tasks</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Team activity */}
                        <div className="bg-card border border-border rounded-xl overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                                <h2 className="font-semibold text-foreground text-sm">Team Activity</h2>
                            </div>
                            <div className="p-4 space-y-3">
                                {[
                                    { name: 'Maria S.', action: 'completed "Design sync"', time: '2m ago', color: '#6366f1' },
                                    { name: 'James K.', action: 'added comment on task', time: '15m ago', color: '#8b5cf6' },
                                    { name: 'Priya N.', action: 'created new project', time: '1h ago', color: '#ec4899' },
                                ].map(a => (
                                    <div key={a.name} className="flex items-start gap-2.5">
                                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0" style={{ backgroundColor: a.color }}>
                                            {a.name[0]}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs text-foreground"><span className="font-semibold">{a.name}</span> {a.action}</p>
                                            <p className="text-[10px] text-muted-foreground">{a.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    );
}