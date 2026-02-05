'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import ChatBubble from './ChatBubble';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface ChatWidgetProps {
    tenantId?: string;
}

export default function ChatWidget({ tenantId: initialTenantId }: ChatWidgetProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [leadId, setLeadId] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Forzar el tenantId de Real to Digital por defecto si no hay ninguno
    const REAL_TO_DIGITAL_ID = '7c3130fe-fcbd-4f48-9cd2-d6fd85a2e047';
    const [tenantId] = useState(initialTenantId || process.env.NEXT_PUBLIC_TENANT_ID || REAL_TO_DIGITAL_ID);

    useEffect(() => {
        console.log('🤖 ChatWidget iniciado con Tenant ID:', tenantId);
    }, [tenantId]);
    const [visitorId] = useState(() => {
        if (typeof window !== 'undefined') {
            let id = localStorage.getItem('visitor_id');
            if (!id) {
                id = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                localStorage.setItem('visitor_id', id);
            }
            return id;
        }
        return '';
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const welcomeMessage: Message = {
                id: 'welcome',
                role: 'assistant',
                content: '¡Hola! 👋 Soy tu consultor de Real to Digital, especialista en Escaneo 3D y servicios relacionados ¿Con quién tengo el gusto de hablar?',
                timestamp: new Date(),
            };
            setMessages([welcomeMessage]);
        }
    }, [isOpen, messages.length]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: `user_${Date.now()}`,
            role: 'user',
            content: inputValue,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: inputValue,
                    leadId,
                    tenantId,
                }),
            });

            const data = await response.json();

            if (!leadId && data.leadId) {
                setLeadId(data.leadId);
            }

            const assistantMessage: Message = {
                id: `assistant_${Date.now()}`,
                role: 'assistant',
                content: data.message,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: Message = {
                id: `error_${Date.now()}`,
                role: 'assistant',
                content: 'Lo siento, hubo un problema con la conexión. ¿Podrías intentar de nuevo?',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            // Devolver el foco al input inmediatamente
            setTimeout(() => inputRef.current?.focus(), 10);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 z-50 bg-[#22c55e] text-white rounded-full p-4 shadow-2xl hover:shadow-green-500/50 transition-all duration-300"
                    >
                        <MessageCircle className="w-6 h-6" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-[#22c55e] animate-pulse" />
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-6 right-6 z-50 w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
                    >
                        {/* Header con estilo ingeniería */}
                        <div className="bg-[#0c1e35] text-white p-4 flex items-center justify-between relative overflow-hidden">
                            {/* Patrón de rejilla sutil */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }}></div>

                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                                    <MessageCircle className="w-5 h-5 text-[#22c55e]" />
                                </div>
                                <div>
                                    <h3 className="font-semibold tracking-tight">RealtoDigital-IA</h3>
                                    <div className="flex items-center gap-1 text-xs text-white/70">
                                        <span className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse" />
                                        Consultoría Técnica 3D
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 relative z-10">
                                <button
                                    onClick={() => setIsMinimized(!isMinimized)}
                                    className="hover:bg-white/10 p-2 rounded-lg transition"
                                >
                                    <Minimize2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="hover:bg-white/10 p-2 rounded-lg transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                                    {messages.map((message) => (
                                        <ChatBubble key={message.id} message={message} />
                                    ))}
                                    {isLoading && (
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <div className="flex gap-1">
                                                <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-bounce" />
                                                <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-bounce [animation-delay:0.2s]" />
                                                <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-bounce [animation-delay:0.4s]" />
                                            </div>
                                            <span className="text-xs font-medium uppercase tracking-wider">Procesando datos técnicos</span>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                <div className="p-4 bg-white border-t border-slate-100">
                                    <div className="flex gap-2">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Describa su requerimiento técnico..."
                                            className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent text-sm"
                                            autoFocus
                                        />
                                        <button
                                            onClick={sendMessage}
                                            disabled={!inputValue.trim()}
                                            className="bg-[#0c1e35] text-white p-2 rounded-lg hover:bg-[#162e4d] transition-all duration-200 shadow-md"
                                        >
                                            <Send className="w-5 h-5 text-[#22c55e]" />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 mt-3 opacity-50">
                                        <div className="h-px bg-slate-200 flex-1"></div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest whitespace-nowrap">
                                            Engineering Support
                                        </p>
                                        <div className="h-px bg-slate-200 flex-1"></div>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
