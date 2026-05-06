import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Filter, MoreVertical, Circle, Timer, CheckCircle2,
    MessageSquare, Paperclip, GripVertical, ChevronDown, Search
} from 'lucide-react';

const VIEWS = ['Kanban', 'Table', 'List'];

const TODO = [
    { id: 1, title: 'Generate AI Blog Draft', tag: 'MARKETING', tagColor: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400', comments: 3, assignees: ['#6366f1', '#8b5cf6'], hasAttachment: false },
    { id: 2, title: 'Set Up AI Lead Scoring', desc: '', tag: 'DEVELOPMENT', tagColor: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400', comments: 1, assignees: ['#ec4899', '#14b8a6', '#6366f1'], hasAttachment: true },
    { id: 3, title: 'Automate Social Media Posts', tag: 'MARKETING', tagColor: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400', comments: 2, assignees: ['#8b5cf6'], hasAttachment: false },
    { id: 4, title: 'Prepare AI Sales Report', desc: 'Compile and analyze AI-driven sales data for performance insights...', tag: 'REPORTS', tagColor: 'bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400', comments: 3, assignees: ['#14b8a6', '#6366f1'], hasAttachment: false },
    { id: 5, title: 'Train AI Chatbot Responses', tag: 'AI TRAINING', tagColor: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400', comments: 4, assignees: ['#6366f1'], hasAttachment: false },
];

const DOING = [
    { id: 6, title: 'Optimize Lead Scoring', tag: 'ENGINEERING', tagColor: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400', comments: 1, assignees: ['#6366f1', '#ec4899'], hasAttachment: false },
    { id: 7, title: 'Refine AI Blog Text', desc: 'Improving AI-generated content for clarity, tone, and readability be...', tag: 'GROWTH', tagColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400', comments: 2, assignees: ['#8b5cf6', '#14b8a6'], hasAttachment: false },
    { id: 8, title: 'Test AI Chatbot', tag: 'REPORTS', tagColor: 'bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400', comments: 4, assignees: ['#6366f1', '#8b5cf6', '#ec4899'], hasAttachment: false },
];

const DONE = [
    { id: 9, title: 'Launch AI Dashboard', tag: 'AUTOMATION', tagColor: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400', comments: 7, assignees: ['#14b8a6'], hasAttachment: false },
    { id: 10, title: 'Finalize AI-Powered Email Assistant', tag: 'ENGINEERING', tagColor: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400', comments: 2, assignees: ['#6366f1', '#8b5cf6'], hasAttachment: false },
];

function TaskRow({ task }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 py-2.5 px-4 hover:bg-accent/40 transition-colors cursor-pointer group border-b border-border/50 last:border-0"
        >
            <GripVertical className="w-3.5 h-3.5 text-muted-foreground/30 shrink-0 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
            <Circle className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-medium truncate">{task.title}</p>
                {task.desc && <p className="text-[11px] text-muted-foreground truncate">{task.desc}</p>}
            </div>
            {task.hasAttachment && <Paperclip className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
            <div className="hidden sm:flex items-center gap-1 text-muted-foreground shrink-0">
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="text-xs">{task.comments}</span>
            </div>
            <div className="hidden sm:flex -space-x-1.5 shrink-0">
                {task.assignees.slice(0, 3).map((c, i) => (
                    <div key={i} className="w-5 h-5 rounded-full border-2 border-card text-[8px] font-bold text-white flex items-center justify-center" style={{ backgroundColor: c }}>
                        {String.fromCharCode(65 + i)}
                    </div>
                ))}
            </div>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${task.tagColor}`}>
                {task.tag}
            </span>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground">
                <MoreVertical className="w-3.5 h-3.5" />
            </button>
        </motion.div>
    );
}

function Section({ title, count, tasks, statusColor }) {
    const [open, setOpen] = useState(true);
    return (
        <div className="mb-4">
            <div className="flex items-center justify-between py-2 px-1">
                <button onClick={() => setOpen(v => !v)} className="flex items-center gap-2 hover:text-foreground transition-colors">
                    <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${open ? '' : '-rotate-90'}`} />
                    <span className="font-semibold text-sm text-foreground">{title}</span>
                    <span className="text-xs text-muted-foreground">{count}</span>
                </button>
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                    Add task
                </button>
            </div>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-card border border-border rounded-xl"
                    >
                        {tasks.map(t => <TaskRow key={t.id} task={t} />)}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Tasks() {
    const [view, setView] = useState('List');

    return (
        <DashboardLayout title="Task Automate" subtitle="All project tasks">
            {/* View switcher + Filter */}
            <div className="flex items-center justify-between mb-5 gap-3">
                <div className="flex items-center gap-1 bg-secondary border border-border rounded-lg p-1">
                    {VIEWS.map(v => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${view === v
                                    ? 'bg-card text-foreground shadow-sm border border-border'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {v}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 transition-colors">
                        <Filter className="w-3.5 h-3.5" />
                        Filter
                    </button>
                    <button className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                        Add task
                    </button>
                </div>
            </div>

            {view === 'List' && (
                <div>
                    <Section title="To do" count={TODO.length} tasks={TODO} />
                    <Section title="Doing" count={DOING.length} tasks={DOING} />
                    <Section title="Done" count={DONE.length} tasks={DONE} />
                </div>
            )}

            {view === 'Kanban' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { title: 'To Do', tasks: TODO, color: 'border-t-muted-foreground/30' },
                        { title: 'Doing', tasks: DOING, color: 'border-t-blue-500' },
                        { title: 'Done', tasks: DONE, color: 'border-t-green-500' },
                    ].map(col => (
                        <div key={col.title} className="bg-card border border-border rounded-xl overflow-hidden">
                            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                                <span className="font-semibold text-sm text-foreground">{col.title}</span>
                                <span className="text-xs text-muted-foreground">{col.tasks.length}</span>
                            </div>
                            <div className="p-3 space-y-2">
                                {col.tasks.map(t => (
                                    <div key={t.id} className="bg-background border border-border rounded-lg p-3 hover:shadow-sm transition-shadow cursor-pointer">
                                        <p className="text-sm font-medium text-foreground mb-2">{t.title}</p>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${t.tagColor}`}>{t.tag}</span>
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <MessageSquare className="w-3 h-3" />
                                                <span className="text-[11px]">{t.comments}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button className="w-full text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 py-2 px-1 transition-colors">
                                    <Plus className="w-3.5 h-3.5" />
                                    Add task
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {view === 'Table' && (
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-secondary/50">
                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Task</th>
                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground hidden md:table-cell">Status</th>
                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground hidden lg:table-cell">Assignees</th>
                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Tag</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {[...TODO, ...DOING, ...DONE].map(t => (
                                <tr key={t.id} className="hover:bg-accent/40 transition-colors cursor-pointer">
                                    <td className="px-4 py-2.5 font-medium text-foreground">{t.title}</td>
                                    <td className="px-4 py-2.5 hidden md:table-cell">
                                        <span className="text-xs text-muted-foreground">
                                            {TODO.find(x => x.id === t.id) ? 'To Do' : DOING.find(x => x.id === t.id) ? 'Doing' : 'Done'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5 hidden lg:table-cell">
                                        <div className="flex -space-x-1">
                                            {t.assignees.slice(0, 3).map((c, i) => (
                                                <div key={i} className="w-5 h-5 rounded-full border-2 border-card text-[8px] font-bold text-white flex items-center justify-center" style={{ backgroundColor: c }}>
                                                    {String.fromCharCode(65 + i)}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-2.5">
                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${t.tagColor}`}>{t.tag}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </DashboardLayout>
    );
}