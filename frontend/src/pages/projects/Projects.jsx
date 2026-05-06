import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, MoreHorizontal, Users, CheckSquare, TrendingUp, Search } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';

const statusColors = {
    active: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    'in-review': 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    completed: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    planning: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
};

const projects = [
    { id: 1, name: 'Task Automate', desc: 'AI-powered task automation and workflow management', tasks: 18, done: 12, members: 5, status: 'active', color: 'bg-indigo-500' },
    { id: 2, name: 'Lead Scoring', desc: 'Machine learning model for lead prioritization', tasks: 15, done: 10, members: 3, status: 'active', color: 'bg-emerald-500' },
    { id: 3, name: 'Sentiment AI', desc: 'Real-time sentiment analysis platform', tasks: 7, done: 4, members: 4, status: 'in-review', color: 'bg-violet-500' },
    { id: 4, name: 'Social Boost', desc: 'Social media automation and analytics', tasks: 9, done: 7, members: 2, status: 'active', color: 'bg-pink-500' },
    { id: 5, name: 'Script AI', desc: 'AI-powered content scripting and generation', tasks: 3, done: 3, members: 2, status: 'completed', color: 'bg-orange-500' },
    { id: 6, name: 'Sales Forecast', desc: 'Predictive sales analytics dashboard', tasks: 2, done: 0, members: 3, status: 'planning', color: 'bg-blue-500' },
];

const avatarSeeds = ['Alice', 'Bob', 'Carol', 'Dan', 'Eve'];

export default function Projects() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [showNewModal, setShowNewModal] = useState(false);

    const filtered = projects.filter(p =>
        (filter === 'all' || p.status === filter) &&
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <TopBar title="Projects" />
            <div className="flex-1 overflow-y-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Search projects..."
                                className="pl-9 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground w-56"
                            />
                        </div>
                        <div className="flex gap-1">
                            {['all', 'active', 'in-review', 'planning', 'completed'].map(s => (
                                <button key={s} onClick={() => setFilter(s)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${filter === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button onClick={() => setShowNewModal(true)}
                        className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors">
                        <Plus className="w-4 h-4" /> New Project
                    </button>
                </div>

                {/* Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((project, i) => (
                        <motion.div key={project.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 ${project.color} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                                        {project.name[0]}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-foreground text-sm">{project.name}</div>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[project.status]}`}>
                                            {project.status}
                                        </span>
                                    </div>
                                </div>
                                <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-accent rounded-md text-muted-foreground transition-all">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </div>

                            <p className="text-xs text-muted-foreground mb-4 leading-relaxed line-clamp-2">{project.desc}</p>

                            <div className="mb-4">
                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                                    <span>Progress</span>
                                    <span className="font-medium text-foreground">{Math.round((project.done / project.tasks) * 100)}%</span>
                                </div>
                                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${(project.done / project.tasks) * 100}%` }} transition={{ delay: i * 0.05 + 0.3, duration: 0.6 }}
                                        className={`h-full ${project.color} rounded-full`} />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1"><CheckSquare className="w-3.5 h-3.5" /> {project.done}/{project.tasks}</span>
                                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {project.members}</span>
                                </div>
                                <div className="flex -space-x-1.5">
                                    {avatarSeeds.slice(0, Math.min(project.members, 3)).map(s => (
                                        <div key={s} className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 border border-background flex items-center justify-center text-white text-xs font-bold">
                                            {s[0]}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Add project card */}
                    <motion.button initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: filtered.length * 0.05 }}
                        onClick={() => setShowNewModal(true)}
                        className="bg-card border-2 border-dashed border-border rounded-xl p-5 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-accent/20 transition-all min-h-48 group">
                        <div className="w-10 h-10 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                            <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <span className="text-sm text-muted-foreground group-hover:text-foreground font-medium transition-colors">New Project</span>
                    </motion.button>
                </div>
            </div>
        </div>
    );
}