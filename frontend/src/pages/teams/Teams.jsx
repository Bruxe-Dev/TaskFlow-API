import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MoreHorizontal, Users, Shield, Crown, Search, Mail } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';

const teams = [
    { id: 1, name: 'AI Development', members: [{ name: 'Alex J', role: 'leader' }, { name: 'Sarah K', role: 'admin' }, { name: 'Mike R', role: 'member' }, { name: 'Emma L', role: 'member' }], projects: 4, tasks: 28, field: 'Engineering' },
    { id: 2, name: 'Marketing Ops', members: [{ name: 'Chris B', role: 'leader' }, { name: 'Lisa M', role: 'member' }, { name: 'Tom W', role: 'member' }], projects: 3, tasks: 15, field: 'Marketing' },
    { id: 3, name: 'Data Science', members: [{ name: 'Jordan P', role: 'leader' }, { name: 'Pat N', role: 'admin' }, { name: 'Sam O', role: 'member' }, { name: 'Riley Q', role: 'member' }, { name: 'Drew S', role: 'member' }], projects: 5, tasks: 42, field: 'Engineering' },
    { id: 4, name: 'Sales Intelligence', members: [{ name: 'Casey T', role: 'leader' }, { name: 'Morgan U', role: 'member' }], projects: 2, tasks: 11, field: 'Sales' },
];

const roleIcon = { leader: Crown, admin: Shield, member: Users };
const roleColor = { leader: 'text-amber-500', admin: 'text-violet-500', member: 'text-muted-foreground' };

export default function Teams() {
    const [search, setSearch] = useState('');
    const filtered = teams.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <TopBar title="Teams" />
            <div className="flex-1 overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teams..."
                            className="pl-9 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground w-56" />
                    </div>
                    <button className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors">
                        <Plus className="w-4 h-4" /> New Team
                    </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    {filtered.map((team, i) => (
                        <motion.div key={team.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                            className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold text-foreground">{team.name}</h3>
                                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{team.field}</span>
                                </div>
                                <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-accent rounded-md text-muted-foreground transition-all">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="mb-4">
                                <div className="text-xs text-muted-foreground mb-2 font-medium">Members ({team.members.length})</div>
                                <div className="space-y-1.5">
                                    {team.members.map((m, j) => {
                                        const RoleIcon = roleIcon[m.role];
                                        return (
                                            <div key={j} className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                                                    {m.name[0]}
                                                </div>
                                                <span className="text-sm text-foreground flex-1">{m.name}</span>
                                                <RoleIcon className={`w-3.5 h-3.5 ${roleColor[m.role]}`} />
                                                <span className="text-xs text-muted-foreground capitalize">{m.role}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground">
                                <span>{team.projects} projects</span>
                                <span>{team.tasks} tasks</span>
                                <button className="flex items-center gap-1 text-primary hover:underline">
                                    <Mail className="w-3.5 h-3.5" /> Invite
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}