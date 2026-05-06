import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Zap, Sparkles, Loader2, Bot, User, Trash2 } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';

const suggestions = [
    'Summarize my overdue tasks',
    'What should I prioritize today?',
    'Create a sprint plan for next week',
    'Show tasks assigned to me',
];

const initialMessages = [
    {
        id: 1, role: 'assistant',
        content: "Hi! I'm your Taskflow AI assistant. I can help you prioritize tasks, summarize project updates, draft task descriptions, and much more. How can I help you today?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
];

const mockResponses = [
    "Based on your current workload, I recommend prioritizing **Optimize Lead Scoring** (overdue by 1 day) and **Set Up AI Lead Scoring** (due in 5 days). These have the highest business impact.",
    "I've analyzed your projects. The **Task Automate** project is at 67% completion with 6 tasks remaining. The most critical blocker appears to be the AI Lead Scoring setup.",
    "Here's a suggested sprint plan:\n\n**Week 1:**\n- Complete Lead Scoring setup\n- Review AI Blog Draft\n\n**Week 2:**\n- Launch Social Media automation\n- Train chatbot responses\n\nThis balances workload across your team effectively.",
    "You have **3 overdue tasks** and **5 tasks due this week**. I recommend delegating the chatbot training to a team member to reduce your load.",
];

export default function AIAssistant() {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (text = input) => {
        if (!text.trim() || loading) return;
        const userMsg = { id: Date.now(), role: 'user', content: text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);
        await new Promise(r => setTimeout(r, 1200));
        const reply = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        setLoading(false);
    };

    const clearChat = () => setMessages(initialMessages);

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <TopBar title="AI Flow" />
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/30">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-foreground">Taskflow AI</div>
                            <div className="text-xs text-emerald-500 flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online
                            </div>
                        </div>
                    </div>
                    <button onClick={clearChat} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                        <Trash2 className="w-3.5 h-3.5" /> Clear chat
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <AnimatePresence initial={false}>
                        {messages.map(msg => (
                            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-primary/10' : 'bg-gradient-to-br from-violet-400 to-indigo-500'}`}>
                                    {msg.role === 'assistant' ? <Bot className="w-4 h-4 text-primary" /> : <User className="w-4 h-4 text-white" />}
                                </div>
                                <div className={`max-w-lg ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'assistant' ? 'bg-card border border-border text-foreground' : 'bg-primary text-primary-foreground'} ${msg.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}>
                                        {msg.content}
                                    </div>
                                    <span className="text-xs text-muted-foreground/60">{msg.time}</span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {loading && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-primary" />
                            </div>
                            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-card border border-border flex items-center gap-2">
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Thinking...</span>
                            </div>
                        </motion.div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Suggestions */}
                {messages.length <= 1 && (
                    <div className="px-6 pb-3 flex flex-wrap gap-2">
                        {suggestions.map(s => (
                            <button key={s} onClick={() => sendMessage(s)}
                                className="flex items-center gap-1.5 text-xs bg-card border border-border text-foreground px-3 py-2 rounded-xl hover:border-primary/50 hover:bg-accent/30 transition-colors">
                                <Sparkles className="w-3 h-3 text-primary" /> {s}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-border bg-card/30">
                    <div className="flex items-center gap-3 bg-background border border-border rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary transition-all">
                        <Sparkles className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                        <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                            placeholder="Ask AI anything about your tasks..."
                            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                        />
                        <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
                            className="w-7 h-7 bg-primary rounded-xl flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40 shrink-0">
                            <Send className="w-3.5 h-3.5 text-primary-foreground" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}