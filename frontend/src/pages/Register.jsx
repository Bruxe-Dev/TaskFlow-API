import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Zap, ArrowRight, AlertCircle, Check } from 'lucide-react';

const PERKS = [
    'Free 14-day trial, no credit card required',
    'AI-powered task prioritization',
    'Unlimited projects and workspaces',
    'Real-time team collaboration',
];

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', organization: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // TODO: Replace with real API call
            // const res = await auth.register(form);
            await new Promise(r => setTimeout(r, 900));
            navigate('/verify-email');
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex font-inter">
            {/* Left */}
            <div className="hidden lg:flex lg:w-1/2 bg-card border-r border-border flex-col justify-between p-10">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-foreground text-lg">Taskflow</span>
                </Link>

                <div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <h2 className="text-3xl font-black text-foreground leading-tight mb-4">
                            Join thousands of teams<br />
                            <span className="text-primary">shipping faster</span>
                        </h2>
                    </motion.div>
                    <motion.ul
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="space-y-3"
                    >
                        {PERKS.map(p => (
                            <li key={p} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                                    <Check className="w-2.5 h-2.5 text-primary" />
                                </div>
                                {p}
                            </li>
                        ))}
                    </motion.ul>
                </div>

                <p className="text-xs text-muted-foreground">© 2025 Taskflow · Privacy · Terms</p>
            </div>

            {/* Right */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-sm"
                >
                    <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
                        <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                            <Zap className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-foreground text-base">Taskflow</span>
                    </Link>

                    <h1 className="text-2xl font-black text-foreground mb-1">Create your account</h1>
                    <p className="text-sm text-muted-foreground mb-7">Start your 14-day free trial, no card needed</p>

                    {error && (
                        <div className="flex items-center gap-2 bg-destructive/10 text-destructive text-sm px-3 py-2.5 rounded-lg mb-4">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-foreground block mb-1.5">Full name</label>
                            <input
                                type="text"
                                required
                                value={form.name}
                                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                placeholder="Alex Johnson"
                                className="w-full bg-secondary border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-foreground block mb-1.5">Work email</label>
                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                placeholder="you@company.com"
                                className="w-full bg-secondary border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-foreground block mb-1.5">Organization name</label>
                            <input
                                type="text"
                                value={form.organization}
                                onChange={e => setForm(p => ({ ...p, organization: e.target.value }))}
                                placeholder="Acme Inc. (optional)"
                                className="w-full bg-secondary border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-foreground block mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    required
                                    minLength={8}
                                    value={form.password}
                                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                    placeholder="Min. 8 characters"
                                    className="w-full bg-secondary border border-border rounded-lg px-3.5 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            ) : (
                                <>Create account <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-[11px] text-muted-foreground mt-4">
                        By signing up, you agree to our{' '}
                        <a href="#" className="text-primary hover:underline">Terms</a>
                        {' '}and{' '}
                        <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                    </p>

                    <p className="text-center text-xs text-muted-foreground mt-5">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}