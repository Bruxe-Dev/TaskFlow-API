import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap, ArrowRight, Check, Star, Users, BarChart2, Layers,
    ChevronRight, Shield, Clock, Globe, Sun, Moon, Menu, X
} from 'lucide-react';

const FEATURES = [
    { step: 1, label: 'AI Prioritizes', desc: 'Smart task prioritization based on deadlines and impact score.' },
    { step: 2, label: 'Live Tracking', desc: 'Real-time progress tracking across all your projects and teams.' },
    { step: 3, label: 'Auto Summary', desc: 'Turn long updates into instant action summaries with one click.' },
    { step: 4, label: 'Easy Sync', desc: 'Seamlessly sync with your existing tools and workflows.' },
];

const TRUSTED = ['Sitemark', 'Border', 'Penta', 'Network', 'NexGen'];

const WHY = [
    { icon: Zap, title: 'AI-Powered', desc: 'Let AI prioritize, summarize, and automate your workflow so you focus on what matters.' },
    { icon: Users, title: 'Team Collaboration', desc: 'Assign tasks, track progress, and collaborate in real-time across distributed teams.' },
    { icon: BarChart2, title: 'Deep Analytics', desc: 'Get insights into team performance, project health, and bottlenecks instantly.' },
    { icon: Shield, title: 'Role-Based Access', desc: 'Fine-grained permissions for Org Leaders, Field Admins, and Team Members.' },
    { icon: Clock, title: 'Never Miss Deadlines', desc: 'Smart reminders, overdue alerts, and upcoming task summaries keep you on track.' },
    { icon: Globe, title: 'Multi-Workspace', desc: 'Manage multiple organizations, fields, and teams from one unified workspace.' },
];

const TESTIMONIALS = [
    { name: 'Sarah Chen', role: 'CTO, NexGen', text: 'Taskflow transformed how our teams operate. AI prioritization alone saved us 10 hours a week.', avatar: '#6366f1' },
    { name: 'Marcus Williams', role: 'VP Ops, Penta', text: 'The role-based access and field management is exactly what we needed for our distributed teams.', avatar: '#8b5cf6' },
    { name: 'Aisha Patel', role: 'PM, Sitemark', text: "Auto summaries are a game changer. I finally know what's happening without reading 50 updates.", avatar: '#ec4899' },
];

const PRICING = [
    {
        name: 'Starter', price: '$0', desc: 'Perfect for small teams',
        features: ['Up to 5 members', '3 projects', 'Basic task management', 'Email support'],
        cta: 'Get started free', highlight: false,
    },
    {
        name: 'Pro', price: '$12', desc: 'For growing teams',
        features: ['Unlimited members', 'Unlimited projects', 'AI prioritization', 'Advanced analytics', 'Priority support'],
        cta: 'Start free trial', highlight: true,
    },
    {
        name: 'Enterprise', price: 'Custom', desc: 'For large organizations',
        features: ['Everything in Pro', 'SSO & advanced security', 'Custom integrations', 'Dedicated manager'],
        cta: 'Contact sales', highlight: false,
    },
];

function FadeIn({ children, delay = 0, className = '' }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export default function Landing() {
    const [dark, setDark] = useState(false);
    const [activeFeature, setActiveFeature] = useState(2);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [email, setEmail] = useState('');

    // Sync landing page dark toggle with <html> class independently
    useEffect(() => {
        const root = document.documentElement;
        const wasDark = root.classList.contains('dark');
        setDark(wasDark);
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        if (dark) root.classList.add('dark');
        else root.classList.remove('dark');
    }, [dark]);

    const bg = dark ? 'bg-gray-950' : 'bg-white';
    const text = dark ? 'text-gray-100' : 'text-gray-900';
    const muted = dark ? 'text-gray-400' : 'text-gray-500';
    const border = dark ? 'border-gray-800' : 'border-gray-100';
    const cardBg = dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100';
    const navBg = dark ? 'bg-gray-950/80 border-gray-800' : 'bg-white/80 border-gray-100';
    const secBg = dark ? 'bg-gray-900/50' : 'bg-gray-50/50';
    const inputBg = dark ? 'bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900';
    const tabBg = dark ? 'bg-gray-900' : 'bg-gray-100';

    return (
        <div className={`min-h-screen ${bg} font-inter overflow-x-hidden transition-colors duration-300`}>
            {/* Navbar */}
            <nav className={`fixed top-0 left-0 right-0 z-50 ${navBg} backdrop-blur-md border-b transition-colors duration-300`}>
                <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="https://media.base44.com/images/public/69f614189797919daf3749bb/9acd298b7_generated_image.png" alt="Taskflow" className="w-8 h-8 rounded-lg object-cover" />
                        <span className={`font-bold ${text} text-base tracking-tight`}>Taskflow</span>
                    </Link>

                    <div className={`hidden md:flex items-center gap-6 text-sm ${muted}`}>
                        {['features', 'why', 'testimonials', 'pricing'].map(s => (
                            <a key={s} href={`#${s}`} className={`hover:${text} transition-colors capitalize`}>{s === 'why' ? 'Why Us' : s}</a>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Dark mode toggle */}
                        <button
                            onClick={() => setDark(d => !d)}
                            className={`p-2 rounded-lg transition-colors ${dark ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            aria-label="Toggle dark mode"
                        >
                            <motion.div
                                key={dark ? 'sun' : 'moon'}
                                initial={{ rotate: -30, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            </motion.div>
                        </button>

                        <div className="hidden md:flex items-center gap-3">
                            <Link to="/login" className={`text-sm font-medium ${muted} hover:${text} transition-colors`}>Log in</Link>
                            <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                                Sign up
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(v => !v)}
                            className={`md:hidden p-2 rounded-lg ${dark ? 'text-gray-300' : 'text-gray-600'}`}
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className={`md:hidden border-t ${border} overflow-hidden`}
                        >
                            <div className={`${bg} px-4 py-4 space-y-3`}>
                                {['features', 'why', 'testimonials', 'pricing'].map(s => (
                                    <a key={s} href={`#${s}`} onClick={() => setMobileMenuOpen(false)} className={`block text-sm ${muted} capitalize`}>
                                        {s === 'why' ? 'Why Us' : s}
                                    </a>
                                ))}
                                <div className={`pt-3 border-t ${border} flex gap-3`}>
                                    <Link to="/login" className={`flex-1 text-center text-sm font-medium py-2 rounded-lg border ${border} ${text}`}>Log in</Link>
                                    <Link to="/register" className="flex-1 text-center text-sm font-semibold py-2 rounded-lg bg-indigo-600 text-white">Sign up</Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Hero */}
            <section className="pt-28 pb-20 px-4 relative overflow-hidden">
                <div className={`absolute inset-0 ${dark ? 'bg-gradient-to-br from-indigo-950/40 via-gray-950 to-purple-950/30' : 'bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/40'} pointer-events-none transition-colors duration-300`} />
                <div className={`absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] ${dark ? 'bg-indigo-900/20' : 'bg-indigo-100/30'} rounded-full blur-3xl pointer-events-none transition-colors duration-300`} />

                <div className="max-w-4xl mx-auto text-center relative">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className={`inline-flex items-center gap-2 ${dark ? 'bg-indigo-900/50 border-indigo-800 text-indigo-300' : 'bg-indigo-50 border-indigo-100 text-indigo-700'} border text-xs font-semibold px-3 py-1.5 rounded-full mb-6 transition-colors duration-300`}
                    >
                        <Zap className="w-3 h-3" />
                        Powered by Advanced AI
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.1 }}
                        className={`text-4xl md:text-5xl lg:text-6xl font-black ${text} leading-tight mb-4 transition-colors duration-300`}
                    >
                        Everything your team needs<br />
                        to <span className="text-indigo-500">stay on track</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.2 }}
                        className={`${muted} text-base md:text-lg max-w-xl mx-auto mb-8 transition-colors duration-300`}
                    >
                        A modern task management platform that helps teams organize work, track progress in real time, and collaborate seamlessly.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
                    >
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className={`w-full sm:w-64 px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all ${inputBg}`}
                        />
                        <Link
                            to="/register"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
                        >
                            Try Demo <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>

                    {/* App preview mock */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className="relative mx-auto max-w-3xl"
                    >
                        <div className={`${dark ? 'bg-gray-900 border-gray-700 shadow-indigo-900/30' : 'bg-white border-gray-200 shadow-indigo-100/50'} border rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300`}>
                            <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'} border-b px-4 py-3 flex items-center gap-2`}>
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                                </div>
                                <div className={`flex-1 ${dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'} rounded-md h-5 mx-4 border`} />
                            </div>
                            <div className="flex h-52 md:h-72">
                                <div className={`w-36 ${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'} border-r p-3 hidden sm:block`}>
                                    <div className="flex items-center gap-1.5 mb-4">
                                        <img src="https://media.base44.com/images/public/69f614189797919daf3749bb/9acd298b7_generated_image.png" alt="logo" className="w-5 h-5 rounded object-cover" />
                                        <div className={`h-2 ${dark ? 'bg-gray-600' : 'bg-gray-300'} rounded w-16`} />
                                    </div>
                                    {['Dashboard', 'Tasks', 'Projects', 'Analytics'].map(item => (
                                        <div key={item} className="flex items-center gap-2 py-1.5">
                                            <div className={`w-3 h-3 ${dark ? 'bg-gray-600' : 'bg-gray-200'} rounded`} />
                                            <div className={`h-1.5 ${dark ? 'bg-gray-600' : 'bg-gray-200'} rounded`} style={{ width: `${40 + Math.random() * 30}px` }} />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex-1 p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <div className={`h-3 ${dark ? 'bg-gray-300' : 'bg-gray-800'} rounded w-28 mb-1`} />
                                            <div className={`h-2 ${dark ? 'bg-gray-600' : 'bg-gray-300'} rounded w-20`} />
                                        </div>
                                        <div className="flex gap-1.5">
                                            {['#4f46e5', '#7c3aed', '#db2777'].map((c, i) => (
                                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white" style={{ backgroundColor: c }} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {[{ w: 70, color: 'bg-blue-400' }, { w: 45, color: 'bg-yellow-400' }, { w: 85, color: 'bg-green-400' }].map((t, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className={`h-2 ${dark ? 'bg-gray-600' : 'bg-gray-200'} rounded w-20 shrink-0`} />
                                                <div className={`flex-1 h-2 ${dark ? 'bg-gray-700' : 'bg-gray-100'} rounded overflow-hidden`}>
                                                    <div className={`h-full ${t.color} rounded`} style={{ width: `${t.w}%` }} />
                                                </div>
                                                <div className={`h-2 ${dark ? 'bg-gray-600' : 'bg-gray-200'} rounded w-8 shrink-0`} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className={`mt-3 ${dark ? 'bg-indigo-950/60 border-indigo-800' : 'bg-indigo-50'} rounded-xl p-3 border`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className={`h-2 ${dark ? 'bg-indigo-700' : 'bg-indigo-200'} rounded w-24`} />
                                            <span className="text-[10px] font-bold text-indigo-500">76% Completed</span>
                                        </div>
                                        <div className={`h-1.5 ${dark ? 'bg-indigo-900' : 'bg-indigo-100'} rounded overflow-hidden`}>
                                            <div className="h-full bg-indigo-500 rounded" style={{ width: '76%' }} />
                                        </div>
                                        <div className="mt-2 space-y-1">
                                            {[{ label: 'Research phase', color: 'text-green-500' }, { label: 'Design sync', color: 'text-blue-500' }, { label: 'Dev Handoff', color: 'text-gray-400' }].map(t => (
                                                <div key={t.label} className="flex items-center justify-between">
                                                    <div className={`h-1.5 ${dark ? 'bg-gray-600' : 'bg-gray-200'} rounded w-24`} />
                                                    <span className={`text-[9px] font-semibold ${t.color}`}>●</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Trusted by */}
            <section className={`py-10 border-y ${border} ${secBg} transition-colors duration-300`}>
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <p className={`text-xs ${muted} font-medium mb-6 uppercase tracking-wider`}>Trusted by 10,000+ founders & business owners</p>
                    <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
                        {TRUSTED.map(brand => (
                            <div key={brand} className={`flex items-center gap-1.5 ${muted} font-semibold text-sm`}>
                                <div className={`w-4 h-4 border-2 ${dark ? 'border-gray-600' : 'border-gray-300'} rounded`} />
                                {brand}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className={`py-20 px-4 ${bg} transition-colors duration-300`}>
                <div className="max-w-5xl mx-auto">
                    <FadeIn className="text-center mb-12">
                        <h2 className={`text-3xl md:text-4xl font-black ${text} mb-3 transition-colors duration-300`}>
                            Why Teams Choose <span className="text-indigo-500">Taskflow</span>
                        </h2>
                        <p className={muted}>Experience the difference of an all-in-one workspace</p>
                    </FadeIn>

                    <FadeIn delay={0.1} className="mb-10">
                        <div className={`flex items-center gap-1 ${tabBg} rounded-xl p-1 overflow-x-auto`}>
                            {FEATURES.map(f => (
                                <button
                                    key={f.step}
                                    onClick={() => setActiveFeature(f.step)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap ${activeFeature === f.step
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : `${muted} hover:${text}`
                                        }`}
                                >
                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${activeFeature === f.step ? 'bg-white/20 text-white' : dark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>{f.step}</span>
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.15} className="grid md:grid-cols-2 gap-10 items-center">
                        <div>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeFeature}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <h3 className={`text-2xl font-bold ${text} mb-3`}>{FEATURES[activeFeature - 1]?.label}</h3>
                                    <p className={`${muted} text-base mb-6`}>{FEATURES[activeFeature - 1]?.desc}</p>
                                </motion.div>
                            </AnimatePresence>
                            <Link to="/register" className="inline-flex items-center gap-2 text-indigo-500 font-semibold text-sm hover:gap-3 transition-all">
                                Get Started <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className={`${dark ? 'bg-indigo-950/40 border-indigo-800' : 'bg-indigo-50 border-indigo-100'} rounded-2xl p-6 border transition-colors duration-300`}>
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <div className="w-10 h-10 bg-[#4A154B] rounded-xl flex items-center justify-center text-white text-xs font-bold">Sl</div>
                                <div className="flex-1 h-0.5 bg-indigo-400/40" />
                                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center"><Zap className="w-5 h-5 text-white" /></div>
                                <div className="flex-1 h-0.5 bg-indigo-400/40" />
                                <div className="w-10 h-10 bg-[#0052CC] rounded-xl flex items-center justify-center text-white text-xs font-bold">Ji</div>
                            </div>
                            <div className="space-y-2">
                                {['Research phase — Completed', 'Design sync — In Progress', 'Dev Handoff — Pending'].map((t, i) => (
                                    <div key={t} className={`flex items-center gap-2 ${dark ? 'bg-gray-800' : 'bg-white'} rounded-lg px-3 py-2 text-xs ${text}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${['bg-green-400', 'bg-blue-400', 'bg-gray-300'][i]}`} />
                                        {t}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* Why Us */}
            <section id="why" className={`py-20 px-4 ${secBg} transition-colors duration-300`}>
                <div className="max-w-5xl mx-auto">
                    <FadeIn className="text-center mb-12">
                        <h2 className={`text-3xl md:text-4xl font-black ${text} mb-3`}>Built for modern teams</h2>
                        <p className={muted}>Everything you need, nothing you don't</p>
                    </FadeIn>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {WHY.map((item, i) => (
                            <FadeIn key={item.title} delay={i * 0.07}>
                                <div className={`${cardBg} rounded-2xl p-5 border hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}>
                                    <div className={`w-9 h-9 ${dark ? 'bg-indigo-900/60' : 'bg-indigo-50'} rounded-xl flex items-center justify-center mb-3`}>
                                        <item.icon className="w-5 h-5 text-indigo-500" />
                                    </div>
                                    <h3 className={`font-bold ${text} mb-1.5`}>{item.title}</h3>
                                    <p className={`text-sm ${muted} leading-relaxed`}>{item.desc}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className={`py-20 px-4 ${bg} transition-colors duration-300`}>
                <div className="max-w-4xl mx-auto">
                    <FadeIn className="text-center mb-12">
                        <h2 className={`text-3xl md:text-4xl font-black ${text} mb-3`}>Loved by teams worldwide</h2>
                    </FadeIn>
                    <div className="grid md:grid-cols-3 gap-5">
                        {TESTIMONIALS.map((t, i) => (
                            <FadeIn key={t.name} delay={i * 0.1}>
                                <div className={`${cardBg} rounded-2xl p-5 border shadow-sm`}>
                                    <div className="flex gap-0.5 mb-3">
                                        {[...Array(5)].map((_, j) => (
                                            <Star key={j} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className={`text-sm ${muted} leading-relaxed mb-4`}>"{t.text}"</p>
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: t.avatar }}>{t.name[0]}</div>
                                        <div>
                                            <p className={`text-xs font-semibold ${text}`}>{t.name}</p>
                                            <p className={`text-[10px] ${muted}`}>{t.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className={`py-20 px-4 ${secBg} transition-colors duration-300`}>
                <div className="max-w-4xl mx-auto">
                    <FadeIn className="text-center mb-12">
                        <h2 className={`text-3xl md:text-4xl font-black ${text} mb-3`}>Simple, transparent pricing</h2>
                        <p className={muted}>Start free, scale as you grow</p>
                    </FadeIn>
                    <div className="grid md:grid-cols-3 gap-6">
                        {PRICING.map((plan, i) => (
                            <FadeIn key={plan.name} delay={i * 0.1}>
                                <div className={`relative ${plan.highlight ? 'bg-indigo-600 text-white' : cardBg} rounded-2xl p-6 border ${plan.highlight ? 'border-indigo-500 shadow-xl shadow-indigo-500/20' : ''} transition-all duration-200`}>
                                    {plan.highlight && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-3 py-1 rounded-full">
                                            MOST POPULAR
                                        </div>
                                    )}
                                    <p className={`font-bold text-sm mb-1 ${plan.highlight ? 'text-indigo-200' : muted}`}>{plan.name}</p>
                                    <div className="flex items-end gap-1 mb-1">
                                        <span className={`text-3xl font-black ${plan.highlight ? 'text-white' : text}`}>{plan.price}</span>
                                        {plan.price !== 'Custom' && <span className={`text-sm mb-1 ${plan.highlight ? 'text-indigo-200' : muted}`}>/mo</span>}
                                    </div>
                                    <p className={`text-xs mb-5 ${plan.highlight ? 'text-indigo-200' : muted}`}>{plan.desc}</p>
                                    <ul className="space-y-2 mb-6">
                                        {plan.features.map(f => (
                                            <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlight ? 'text-indigo-100' : muted}`}>
                                                <Check className={`w-4 h-4 shrink-0 ${plan.highlight ? 'text-white' : 'text-indigo-500'}`} />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link
                                        to="/register"
                                        className={`block text-center font-semibold py-2.5 rounded-xl text-sm transition-colors ${plan.highlight
                                                ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                                                : `border ${border} ${text} ${dark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`
                                            }`}
                                    >
                                        {plan.cta}
                                    </Link>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4 bg-indigo-600">
                <FadeIn className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Ready to transform your workflow?</h2>
                    <p className="text-indigo-200 mb-8">Join thousands of teams already using Taskflow to ship faster.</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link to="/register" className="bg-white text-indigo-600 font-bold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-colors text-sm">
                            Start for free
                        </Link>
                        <Link to="/login" className="border border-indigo-400 text-white font-semibold px-8 py-3 rounded-xl hover:bg-indigo-500 transition-colors text-sm">
                            Sign in
                        </Link>
                    </div>
                </FadeIn>
            </section>

            {/* Footer */}
            <footer className={`py-8 px-4 border-t ${border} ${bg} transition-colors duration-300`}>
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <img src="https://media.base44.com/images/public/69f614189797919daf3749bb/9acd298b7_generated_image.png" alt="Taskflow" className="w-6 h-6 rounded-md object-cover" />
                        <span className={`font-bold ${text} text-sm`}>Taskflow</span>
                    </div>
                    <p className={`text-xs ${muted}`}>© 2025 Taskflow. All rights reserved.</p>
                    <div className={`flex gap-4 text-xs ${muted}`}>
                        <a href="#" className="hover:text-indigo-500 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-indigo-500 transition-colors">Terms</a>
                        <a href="#" className="hover:text-indigo-500 transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}