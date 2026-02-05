'use client';

import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface ChatBubbleProps {
    message: Message;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
    const isUser = message.role === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
        >
            {/* Avatar */}
            <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border shadow-sm ${isUser
                    ? 'bg-[#48da40] text-white border-[#3ecb37]'
                    : 'bg-white text-[#0c1e35] border-slate-200'
                    }`}
            >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-[#48da40]" />}
            </div>

            {/* Bubble */}
            <div className={`flex flex-col max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                    className={`rounded-2xl px-4 py-2.5 text-sm shadow-md border ${isUser
                        ? 'bg-[#48da40] text-[#0c1e35] font-bold border-[#3ecb37]/30'
                        : 'bg-white text-black border-slate-100 rounded-tl-sm'
                        }`}
                >
                    {isUser ? (
                        <p className="text-sm whitespace-pre-wrap text-[#0c1e35]">{message.content}</p>
                    ) : (
                        <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 !text-black">
                            <ReactMarkdown components={{
                                p: ({ node, ...props }) => <p className="!text-black mb-1" {...props} />,
                                strong: ({ node, ...props }) => <strong className="!text-black font-bold" {...props} />,
                            }}>{message.content}</ReactMarkdown>
                        </div>
                    )}
                </div>
                <span className="text-xs text-gray-400 mt-1 px-1">
                    {message.timestamp.toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </span>
            </div>
        </motion.div>
    );
}
