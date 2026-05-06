import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', organization: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(r => setTimeout(r, 1000));
        setLoading(false);
        navigate('/verify-email');
    };

    return (
        <div className="min-h-screen bg-background flex font-inter">
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-900 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-violet-500/15 rounded-full blur-3xl animate-pulse-slow" />
                    <div className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-blue-500/15 rounded-full blur-3xl animate-float" />
                </div>
                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white font-bold text-xl">Taskflow</span>
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold text-white mb-4 leading-tight">Start your free<br />14-day trial.</h2>
                        <p className="text-violet-200 mb-8">No credit card required. Cancel anytime.</p>
                        <div className="grid grid-cols-2 gap-4">
                            {[['10k+', 'Teams'], ['98%', 'Satisfaction'], ['3x', 'Productivity'], ['24/7', 'Support']].map(([v, l]) => (
                                <div key={l} className="bg-white/5 rounded-xl p-4 border border-white/10">
                                    <div className="text-2xl font-bold text-white">{v}</div>
                                    <div className="text-violet-300 text-sm">{l}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                    className="w-full max-w-md">
                    <div className="flex items-center gap-2 mb-10 lg:hidden">
                        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold">Taskflow</span>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">Create your account</h1>
                        <p className="text-muted-foreground">Start organizing your team's work today</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">Full name</label>
                                <input type="text" required value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    placeholder="Alex Johnson"
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">Organization name</label>
                                <input type="text" required value={form.organization}
                                    onChange={e => setForm({ ...form, organization: e.target.value })}
                                    placeholder="Acme Corp"
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">Work email</label>
                                <input type="email" required value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    placeholder="alex@company.com"
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                                <div className="relative">
                                    <input type={showPassword ? 'text' : 'password'} required value={form.password}
                                        onChange={e => setForm({ ...form, password: e.target.value })}
                                        placeholder="Min. 8 characters"
                                        className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm pr-10"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            By creating an account, you agree to our{' '}
                            <a href="#" className="text-primary hover:underline">Terms of Service</a> and{' '}
                            <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                        </p>

                        <button type="submit" disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md shadow-primary/20 disabled:opacity-70">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Create account</span><ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}