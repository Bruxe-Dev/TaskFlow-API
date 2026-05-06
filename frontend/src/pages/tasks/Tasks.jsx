import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Filter, MoreHorizontal, MessageSquare, Paperclip,
    ChevronDown, ChevronRight, GripVertical, Star
} from 'lucide-react';
import TopBar from '@/components/layout/TopBar';

const tagColors = {
    MARKETING: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    DEVELOPMENT: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    'AI TRAINING': 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
    ENGINEERING: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    GROWTH: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
    REPORTS: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    AUTOMATION: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
};

const initialGroups = [
    {
        id: 'todo', label: 'To do', color: 'text-muted-foreground', tasks: [
            { id: 1, title: 'Generate AI Blog Draft', comments: 3, tag: 'MARKETING', attachments: false, desc: '' },
            { id: 2, title: 'Set Up AI Lead Scoring', comments: 1, tag: 'DEVELOPMENT', attachments: true, desc: '' },
            { id: 3, title: 'Automate Social Media Posts', comments: 2, tag: 'MARKETING', attachments: false, desc: '' },
            { id: 4, title: 'Prepare AI Sales Report', comments: 3, tag: 'REPORTS', attachments: true, desc: 'Compile and analyze AI-driven sales data for performance insights...' },
            { id: 5, title: 'Train AI Chatbot Responses', comments: 4, tag: 'AI TRAINING', attachments: false, desc: '' },
        ]
    },
    {
        id: 'doing', label: 'Doing', color: 'text-blue-500', tasks: [
            { id: 6, title: 'Optimize Lead Scoring', comments: 1, tag: 'ENGINEERING', attachments: false, desc: '' },
            { id: 7, title: 'Refine AI Blog Text', comments: 2, tag: 'GROWTH', attachments: true, desc: 'Improving AI-generated content for clarity, tone, and readability...' },
            { id: 8, title: 'Test AI Chatbot', comments: 4, tag: 'REPORTS', attachments: false, desc: '' },
        ]
    },
    {
        id: 'done', label: 'Done', color: 'text-emerald-500', tasks: [
            { id: 9, title: 'Launch AI Dashboard', comments: 7, tag: 'AUTOMATION', attachments: false, desc: '' },
            { id: 10, title: 'Finalize AI-Powered Email Assistant', comments: 2, tag: 'AUTOMATION', attachments: false, desc: '' },
        ]
    },
];

const avatarSeeds = ['Alice', 'Bob', 'Carol', 'Dan', 'Eve'];

function Avatar({ seed, size = 6 }) {
    return (
        <div className={`w-${size} h-${size} rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold border border-background`}>
            {seed[0]}
        </div>
    );
}

function TaskRow({ task, isSelected, onSelect }) {
    return (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-3 px-4 py-3 border-b border-border hover:bg-accent/30 transition-colors group cursor-pointer ${isSelected ? 'bg-accent/50' : ''}`}
            onClick={() => onSelect(task.id)}>
            <GripVertical className="w-3.5 h-3.5 text-muted-foreground/30 opacity-0 group-hover:opacity-100 shrink-0" />
            <div className="w-4 h-4 rounded border-2 border-border group-hover:border-primary transition-colors shrink-0" />
            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground">{task.title}</div>
                {task.desc && <div className="text-xs text-muted-foreground truncate mt-0.5">{task.desc}</div>}
            </div>
            <div className="hidden md:flex items-center gap-3 shrink-0">
                {task.attachments && <Paperclip className="w-3.5 h-3.5 text-muted-foreground/50" />}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {task.comments} {task.comments === 1 ? 'comment' : 'comments'}
                </div>
                <div className="flex -space-x-1.5">
                    {avatarSeeds.slice(0, 2).map(s => (
                        <Avatar key={s} seed={s} size={6} />
                    ))}
                </div>
                {task.tag && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColors[task.tag] || 'bg-gray-100 text-gray-600'}`}>
                        {task.tag}
                    </span>
                )}
            </div>
            <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-accent rounded-md text-muted-foreground transition-all">
                <MoreHorizontal className="w-4 h-4" />
            </button>
        </motion.div>
    );
}

function TaskGroup({ group, selectedTasks, onSelect }) {
    const [collapsed, setCollapsed] = useState(false);
    const [adding, setAdding] = useState(false);

    return (
        <div className="mb-4">
            <div className="flex items-center justify-between px-4 py-2">
                <button onClick={() => setCollapsed(!collapsed)}
                    className="flex items-center gap-2 font-semibold text-sm hover:text-foreground transition-colors">
                    {collapsed ? <ChevronRight className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    <span className={group.color}>{group.label}</span>
                    <span className="bg-muted text-muted-foreground text-xs px-1.5 py-0.5 rounded-full font-normal">{group.tasks.length}</span>
                </button>
                <button onClick={() => setAdding(true)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Add task
                </button>
            </div>
            <AnimatePresence>
                {!collapsed && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                        {group.tasks.map(task => (
                            <TaskRow key={task.id} task={task} isSelected={selectedTasks.includes(task.id)} onSelect={onSelect} />
                        ))}
                        {adding && (
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                                <div className="w-3.5 h-3.5" />
                                <div className="w-4 h-4 rounded border-2 border-border shrink-0" />
                                <input autoFocus onBlur={() => setAdding(false)}
                                    placeholder="Task name..."
                                    className="flex-1 text-sm bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
                                />
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Tasks() {
    const [view, setView] = useState('list');
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [groups] = useState(initialGroups);

    const toggleTask = (id) => {
        setSelectedTasks(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <TopBar title="Task Automate starred" />

            {/* View tabs */}
            <div className="flex items-center gap-1 px-6 py-2 border-b border-border bg-card /30">
                {[
                    { key: 'kanban', label: 'Kanban' },
                    { key: 'table', label: 'Table' },
                    { key: 'list', label: 'List' },
                ].map(v => (
                    <button key={v.key} onClick={() => setView(v.key)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${view === v.key ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}>
                        {v.label}
                    </button>
                ))}
                <div className="ml-auto flex items-center gap-2">
                    <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border px-3 py-1.5 rounded-lg hover:bg-accent transition-colors">
                        <Filter className="w-3.5 h-3.5" /> Filter
                    </button>
                </div>
            </div>

            {/* Task list */}
            <div className="flex-1 overflow-y-auto">
                {view === 'list' && (
                    <div className="py-2">
                        {groups.map(group => (
                            <TaskGroup key={group.id} group={group} selectedTasks={selectedTasks} onSelect={toggleTask} />
                        ))}
                    </div>
                )}
                {view === 'kanban' && <KanbanView groups={groups} />}
                {view === 'table' && <TableView groups={groups} />}
            </div>
        </div >
    );
}

function KanbanView({ groups }) {
    return (
        <div className="flex gap-4 p-6 h-full overflow-x-auto">
            {groups.map(group => (
                <div key={group.id} className="w-72 shrink-0">
                    <div className="flex items-center justify-between mb-3">
                        <span className={`text-sm font-semibold ${group.color}`}>{group.label}</span>
                        <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">{group.tasks.length}</span>
                    </div>
                    <div className="space-y-2">
                        {group.tasks.map(task => (
                            <div key={task.id} className="bg-card border border-border rounded-xl p-3 hover:border-primary/30 transition-colors cursor-pointer">
                                <div className="text-sm font-medium text-foreground mb-2">{task.title}</div>
                                {task.desc && <div className="text-xs text-muted-foreground mb-2 line-clamp-2">{task.desc}</div>}
                                <div className="flex items-center justify-between">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColors[task.tag] || 'bg-gray-100 text-gray-600'}`}>{task.tag}</span>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <MessageSquare className="w-3 h-3" /> {task.comments}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button className="w-full py-2 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 justify-center border border-dashed border-border rounded-xl hover:border-primary/50 transition-colors">
                            <Plus className="w-3.5 h-3.5" /> Add task
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

function TableView({ groups }) {
    const allTasks = groups.flatMap(g => g.tasks.map(t => ({ ...t, group: g.label })));
    return (
        <div className="p-6">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-muted/30">
                            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Task</th>
                            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
                            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Tag</th>
                            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Comments</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allTasks.map(task => (
                            <tr key={task.id} className="border-b border-border hover:bg-accent/30 transition-colors">
                                <td className="px-4 py-3 text-sm font-medium text-foreground">{task.title}</td>
                                <td className="px-4 py-3">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${task.group === 'Done' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : task.group === 'Doing' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-muted text-muted-foreground'}`}>
                                        {task.group}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColors[task.tag] || ''}`}>{task.tag}</span>
                                </td>
                                <td className="px-4 py-3 text-xs text-muted-foreground">{task.comments}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}