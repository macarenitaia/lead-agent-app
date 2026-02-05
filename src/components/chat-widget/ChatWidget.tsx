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
                content: '¡Hola! 👋 Soy tu consultor de Real to Digital, especialista en Escaneo 3D. ¿Con quién tengo el gusto de hablar?',
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
                        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full p-4 shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300"
                    >
                        <MessageCircle className="w-6 h-6" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-6 right-6 z-50 w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <MessageCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">RealtoDigital-IA</h3>
                                    <div className="flex items-center gap-1 text-xs text-white/80">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        Especialista en Escaneo 3D
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
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
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                                    {messages.map((message) => (
                                        <ChatBubble key={message.id} message={message} />
                                    ))}
                                    {isLoading && (
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <div className="flex gap-1">
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                                            </div>
                                            <span className="text-sm">Analizando...</span>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                <div className="p-4 bg-white border-t border-gray-200">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="¿En qué puedo asesorarte?"
                                            disabled={isLoading}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                        <button
                                            onClick={sendMessage}
                                            disabled={!inputValue.trim() || isLoading}
                                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                        >
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2 text-center font-medium">
                                        Especialista en Escaneo 3D
                                    </p>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
