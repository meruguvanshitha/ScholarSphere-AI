import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  HelpCircle,
  FileText,
  Clock,
  ShieldAlert,
  ArrowRight,
  Info,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  mode?: string;
  modelProvider?: string;
  contextScholarship?: string;
  timestamp: string;
}

const SAMPLE_PROMPTS = [
  'Which scholarships have deadlines closing in the next 14 days?',
  'Why am I a Strong Match for the National STEM Excellence Fellowship?',
  'What documents are required to apply for the NextGen Women in Tech Grant?',
  'Are there any scholarships that have no annual family income limit?',
  'What should I prepare first if my GPA is 3.8 and I am in Computer Science?'
];

export const ScholarshipAssistant: React.FC<{ initialScholarshipId?: string }> = ({
  initialScholarshipId
}) => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: `Hello! I am the **ScholarSphere Guidance Advisor**.\n\nI answer questions grounded strictly in our verified scholarship catalog and your student profile. I do not hallucinate fake awards or fabricate approval odds.\n\nAsk me about deadlines, required documents, eligibility rules, or next application steps.`,
      mode: 'grounded-advisor',
      modelProvider: 'ScholarSphere Grounded Engine',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [selectedScholarshipId, setSelectedScholarshipId] = useState<string | undefined>(initialScholarshipId);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || inputPrompt;
    if (!prompt.trim() || isSending) return;

    const userMessage: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputPrompt('');
    setIsSending(true);

    try {
      const res = await api.askAssistant(prompt, selectedScholarshipId);
      const assistantMessage: Message = {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        text: res.answer,
        mode: res.mode,
        modelProvider: res.modelProvider,
        contextScholarship: res.contextScholarship,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        text: 'Sorry, I encountered an issue querying the catalog service. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#E2DDD5]">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0F172A] to-[#1E293B] text-emerald-400 flex items-center justify-center font-bold">
              <Bot className="w-4 h-4" />
            </span>
            <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
              Scholarship Guidance Advisor
            </h1>
          </div>
          <p className="text-xs text-[#64748B]">
            Transparent Q&amp;A grounded strictly in database eligibility rules. Zero hallucinated scholarships or fabricated win odds.
          </p>
        </div>

        {/* Engine Transparency Indicator */}
        <div className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#DDD5C7] text-xs font-semibold text-[#0F172A] flex items-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Server-Side Grounded AI / Rule Audit</span>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
          Suggested Questions
        </p>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#FAF7F2] border border-[#DDD5C7] text-xs text-[#334155] font-medium transition-colors shadow-xs hover:border-emerald-600 hover:text-emerald-900"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="bg-white rounded-3xl border border-[#E2DDD5] shadow-sm flex flex-col h-[520px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#FAF7F2]/50">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-[#0F172A] text-white rounded-br-none shadow-xs'
                    : 'bg-white text-[#0F172A] border border-[#E2DDD5] rounded-bl-none shadow-xs'
                }`}
              >
                {/* Provider/Mode Pill for Assistant */}
                {msg.sender === 'assistant' && msg.modelProvider && (
                  <div className="flex items-center justify-between pb-1.5 border-b border-gray-100 text-[10px] text-gray-500 font-semibold">
                    <span className="flex items-center space-x-1 text-emerald-800">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>{msg.modelProvider}</span>
                    </span>
                    {msg.contextScholarship && (
                      <span className="text-gray-400">Context: {msg.contextScholarship}</span>
                    )}
                  </div>
                )}

                {/* Message Body with Markdown whitespace */}
                <div className="whitespace-pre-line text-xs font-normal">
                  {msg.text}
                </div>

                <div
                  className={`text-[10px] text-right pt-1 ${
                    msg.sender === 'user' ? 'text-slate-400' : 'text-gray-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex items-center space-x-2 text-xs text-gray-500 p-2">
              <Bot className="w-4 h-4 animate-bounce text-emerald-600" />
              <span>Analyzing scholarship rules and catalog records...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3.5 bg-white border-t border-[#E2DDD5] flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={e => setInputPrompt(e.target.value)}
            placeholder="Ask about scholarship eligibility, documents, or deadlines..."
            disabled={isSending}
            className="flex-1 p-3 rounded-xl bg-[#FAF7F2] border border-[#D5CEC0] text-xs text-[#0F172A] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isSending}
            className="p-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white disabled:opacity-40 transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
