
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Loader2, Bot, Sparkles } from 'lucide-react';

const AISchemaHelper: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAskAI = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `You are a senior PostgreSQL database architect. 
      The current schema has 4 tables: users, projects, tasks, comments.
      User asked a question about extending or modifying this schema.
      Provide only the SQL or technical explanation needed. Use Markdown.`;

      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      setResponse(result.text || "No response generated.");
    } catch (error) {
      console.error("AI Error:", error);
      setResponse("Failed to connect to AI service. Please ensure API Key is valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 h-full flex flex-col bg-slate-50">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
            <Bot className="text-indigo-600" /> AI Schema Consultant
          </h2>
          <p className="text-slate-500">Ask Gemini to help you add features like file attachments, audit logs, or complex reporting queries.</p>
        </div>
        <div className="flex gap-2">
          {['Add file attachments', 'Create audit log', 'SQL View for reporting'].map(suggestion => (
            <button
              key={suggestion}
              onClick={() => setPrompt(suggestion)}
              className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full border border-indigo-200 hover:bg-indigo-200 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        {response ? (
          <div className="prose prose-indigo max-w-none text-slate-700">
            <div className="flex items-center gap-2 mb-4 text-indigo-600 font-bold text-sm">
              <Sparkles size={16} /> Gemini's Suggestion:
            </div>
            <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-100">
              {response}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 opacity-50">
            <Bot size={64} strokeWidth={1} />
            <p>I can help you write complex migration scripts or optimize queries.</p>
          </div>
        )}
      </div>

      <div className="relative group">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAskAI();
            }
          }}
          placeholder="Ex: Add a 'tags' field to tasks with many-to-many relationship..."
          className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-4 pr-16 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none shadow-sm"
          rows={3}
        />
        <button
          onClick={handleAskAI}
          disabled={loading || !prompt.trim()}
          className={`absolute right-4 bottom-4 p-3 rounded-xl transition-all shadow-md ${
            loading || !prompt.trim() 
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
          }`}
        >
          {loading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
        </button>
      </div>
    </div>
  );
};

export default AISchemaHelper;
