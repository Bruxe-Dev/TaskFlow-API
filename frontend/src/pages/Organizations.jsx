import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { Plus, Building2, Users, Layers, Settings, ChevronRight, Globe } from 'lucide-react';

const ORGS = [
    {
        id: 1,
        name: 'Taskflow Inc.',
        desc: 'Main organization — AI-powered productivity tools',
        members: 24,
        fields: 3,
        teams: 8,
        role: 'Org Leader',
        logo: '#6366f1',
        fields_list: [
            { name: 'Tech Field', teams: 3, color: '#6366f1' },
            { name: 'Marketing Field', teams: 2, color: '#ec4899' },
            { name: 'Analytics Field', teams: 3, color: '#14b8a6' },
        ]
    },
];

export default function Organizations() {
    const [expanded, setExpanded] = useState(1);
    const [showCreate, setShowCreate] = useState(false);
    const [orgName, setOrgName] = useState('');

    return (
        <DashboardLayout title="Organizations" subtitle="Manage your organizations">
            <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-muted-foreground">{ORGS.length} organization{ORGS.length !== 1 ? 's' : ''}</p>
                <button
                    onClick={() => setShowCreate(v => !v)}
                    className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-3.5 h-3.5" />
                    New Org
                </button>
            </div>

            {showCreate && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-card border border-border rounded-xl p-4 mb-4"
                >
                    <h3 className="font-semibold text-sm text-foreground mb-3">Create Organization</h3>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={orgName}
                            onChange={e => setOrgName(e.target.value)}
                            placeholder="Organization name"
                            className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        />
                        <button className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                            Create
                        </button>
                    </div>
                </motion.div>
            )}

            {ORGS.map((org, i) => (
                <motion.div
                    key={org.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="bg-card border border-border rounded-xl overflow-hidden mb-4"
                >
                    <div
                        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-accent/30 transition-colors"
                        onClick={() => setExpanded(expanded === org.id ? null : org.id)}
                    >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shrink-0" style={{ backgroundColor: org.logo }}>
                            {org.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground">{org.name}</h3>
                            <p className="text-xs text-muted-foreground">{org.desc}</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{org.members}</span>
                            <span className="flex items-center gap-1"><Layers className="w-3 h-3" />{org.fields} fields</span>
                        </div>
                        <span className="text-[10px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">{org.role}</span>
                        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${expanded === org.id ? 'rotate-90' : ''}`} />
                    </div>

                    {expanded === org.id && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="border-t border-border"
                        >
                            {/* Stats */}
                            <div className="grid grid-cols-3 border-b border-border">
                                {[
                                    { label: 'Members', value: org.members, icon: Users },
                                    { label: 'Fields', value: org.fields, icon: Layers },
                                    { label: 'Teams', value: org.teams, icon: Building2 },
                                ].map(s => (
                                    <div key={s.label} className="p-4 text-center border-r border-border last:border-0">
                                        <p className="text-xl font-black text-foreground">{s.value}</p>
                                        <p className="text-xs text-muted-foreground">{s.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Fields */}
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-semibold text-foreground">Fields</h4>
                                    <button className="text-xs text-primary hover:underline font-semibold flex items-center gap-1">
                                        <Plus className="w-3 h-3" />
                                        Add Field
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {org.fields_list.map(f => (
                                        <div key={f.name} className="flex items-center gap-2.5 p-2.5 bg-secondary rounded-lg">
                                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: f.color }} />
                                            <span className="text-sm text-foreground font-medium flex-1">{f.name}</span>
                                            <span className="text-xs text-muted-foreground">{f.teams} teams</span>
                                            <button className="text-muted-foreground hover:text-foreground">
                                                <Settings className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            ))}
        </DashboardLayout>
    );
}