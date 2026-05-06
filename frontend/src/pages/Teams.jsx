import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { Plus, MoreHorizontal, Users, CheckSquare, Crown, UserPlus } from 'lucide-react';

const TEAMS = [
    { id: 1, name: 'AI Engineering', field: 'Tech Field', members: [{ name: 'Alex J.', color: '#6366f1', isLeader: true }, { name: 'Maria S.', color: '#8b5cf6' }, { name: 'James K.', color: '#ec4899' }, { name: 'Priya N.', color: '#14b8a6' }], tasks: 24, projects: 3, desc: 'Core AI model development and engineering' },
    { id: 2, name: 'Marketing AI', field: 'Marketing Field', members: [{ name: 'Sarah C.', color: '#f59e0b', isLeader: true }, { name: 'Tom W.', color: '#10b981' }, { name: 'Lisa R.', color: '#6366f1' }], tasks: 17, projects: 2, desc: 'AI-powered marketing campaigns and automation' },
    { id: 3, name: 'Data Insights', field: 'Analytics Field', members: [{ name: 'Chris D.', color: '#ef4444', isLeader: true }, { name: 'Amy L.', color: '#8b5cf6' }, { name: 'Ben M.', color: '#14b8a6' }, { name: 'Kai P.', color: '#f59e0b' }, { name: 'Zoe T.', color: '#ec4899' }], tasks: 31, projects: 4, desc: 'Business intelligence and data analytics team' },
    { id: 4, name: 'Growth Team', field: 'Sales Field', members: [{ name: 'Ryan O.', color: '#10b981', isLeader: true }, { name: 'Nina V.', color: '#6366f1' }], tasks: 9, projects: 1, desc: 'User acquisition, retention, and growth hacking' },
];

export default function Teams() {
    const [selected, setSelected] = useState(null);

    return (
        <DashboardLayout title="Teams" subtitle="Manage your teams and members">
            <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-muted-foreground">{TEAMS.length} teams across your organization</p>
                <button className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                    New Team
                </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                {TEAMS.map((team, i) => (
                    <motion.div
                        key={team.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        onClick={() => setSelected(selected?.id === team.id ? null : team)}
                        className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all cursor-pointer group"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-foreground">{team.name}</h3>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">{team.field}</p>
                            </div>
                            <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" onClick={e => e.stopPropagation()}>
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                        </div>

                        <p className="text-xs text-muted-foreground mb-4">{team.desc}</p>

                        {/* Members */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-1">
                                <div className="flex -space-x-1.5">
                                    {team.members.slice(0, 4).map((m, j) => (
                                        <div
                                            key={j}
                                            className="relative w-7 h-7 rounded-full border-2 border-card flex items-center justify-center text-[10px] font-bold text-white"
                                            style={{ backgroundColor: m.color }}
                                        >
                                            {m.name[0]}
                                            {m.isLeader && (
                                                <div className="absolute -top-1 -right-0.5 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center">
                                                    <Crown className="w-1.5 h-1.5 text-white" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {team.members.length > 4 && (
                                        <div className="w-7 h-7 rounded-full border-2 border-card bg-accent flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
                                            +{team.members.length - 4}
                                        </div>
                                    )}
                                </div>
                                <span className="text-xs text-muted-foreground ml-1">{team.members.length} members</span>
                            </div>
                            <button className="flex items-center gap-1 text-xs text-primary hover:underline" onClick={e => e.stopPropagation()}>
                                <UserPlus className="w-3 h-3" />
                                Invite
                            </button>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><CheckSquare className="w-3 h-3" />{team.tasks} tasks</span>
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{team.projects} projects</span>
                        </div>

                        {/* Expanded detail */}
                        {selected?.id === team.id && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-4 pt-4 border-t border-border"
                            >
                                <p className="text-xs font-semibold text-muted-foreground mb-2">Team Members</p>
                                <div className="space-y-2">
                                    {team.members.map((m, j) => (
                                        <div key={j} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ backgroundColor: m.color }}>
                                                    {m.name[0]}
                                                </div>
                                                <span className="text-xs text-foreground">{m.name}</span>
                                                {m.isLeader && <span className="text-[9px] bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 px-1.5 py-0.5 rounded-full font-semibold">Leader</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>
        </DashboardLayout>
    );
}