'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { chatbotService, ChatMessage } from '../services/chatbotService';

// 1. Mudamos de "export const" para apenas "const"
const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { text: "Olá! Sou a IA da HoldCrypto. Posso consultar seu saldo ou realizar depósitos. Como ajudo?", sender: 'bot', timestamp: new Date() }
    ]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll para a última mensagem
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userText = input;
        setInput('');
        
        // Adiciona mensagem do usuário
        setMessages(prev => [...prev, { text: userText, sender: 'user', timestamp: new Date() }]);
        setIsLoading(true);

        try {
            // Chama o serviço
            const responseText = await chatbotService.sendMessage(userText);
            
            // Adiciona resposta do bot
            setMessages(prev => [...prev, { text: responseText, sender: 'bot', timestamp: new Date() }]);
        } catch (error) {
            setMessages(prev => [...prev, { text: "Erro de comunicação. Tente novamente.", sender: 'bot', timestamp: new Date() }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end font-sans">
            
            {/* Janela do Chat */}
            {isOpen && (
                <div className="mb-4 w-[350px] h-[500px] flex flex-col bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
                    
                    {/* Header */}
                    <div className="bg-[#020617] p-4 border-b border-white/10 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                                <Bot className="text-yellow-500" size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm">Assistente IA</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span className="text-xs text-gray-400">Online</span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Área de Mensagens */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    
                                    {/* Avatar */}
                                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                                        msg.sender === 'user' ? 'bg-indigo-500/20' : 'bg-yellow-500/20'
                                    }`}>
                                        {msg.sender === 'user' ? <User size={14} className="text-indigo-400" /> : <Sparkles size={14} className="text-yellow-500" />}
                                    </div>

                                    {/* Balão */}
                                    <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                                        msg.sender === 'user' 
                                            ? 'bg-indigo-600 text-white rounded-tr-sm' 
                                            : 'bg-[#1e293b] border border-white/5 text-gray-200 rounded-tl-sm'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex gap-2 max-w-[85%]">
                                    <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex-shrink-0 flex items-center justify-center">
                                        <Loader2 size={14} className="text-yellow-500 animate-spin" />
                                    </div>
                                    <div className="bg-[#1e293b] border border-white/5 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-[#020617] border-t border-white/10">
                        <form onSubmit={handleSend} className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Digite 'Qual meu saldo?'..."
                                className="w-full bg-[#1e293b] text-white text-sm rounded-xl pl-4 pr-12 py-3 border border-white/10 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 placeholder-gray-500 transition-all"
                            />
                            <button 
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2 top-2 p-1.5 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <Send size={16} />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Botão Flutuante Principal */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group ${
                    isOpen ? 'bg-[#1e293b] text-white border border-white/10' : 'bg-yellow-500 text-black shadow-yellow-500/20'
                }`}
            >
                {isOpen ? (
                    <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                ) : (
                    <MessageCircle size={28} className="group-hover:-rotate-12 transition-transform duration-300" />
                )}
                
                {/* Badge de Notificação (Opcional) */}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#020617]"></span>
                )}
            </button>
        </div>
    );
};

// 2. Exportação Padrão no final do arquivo
export default ChatbotWidget;