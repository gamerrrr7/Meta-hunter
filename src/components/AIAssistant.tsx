import { useState, useRef, useEffect, FormEvent } from 'react';
import { Send, Sparkles, MessageSquare, AlertCircle, RefreshCw, X, ArrowDown } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export default function AIAssistant() {
  const { t, language } = useLanguage();

  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);

  const listEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll
  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userMsg = prompt.trim();
    setPrompt('');
    setErrorVisible(false);

    // Update frontend state with User Message
    const updatedMessages = [...messages, { role: 'user' as const, parts: [{ text: userMsg }] }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Map historical chat contents to the request body server format excluding pre-prompt setup
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: messages,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve AI insights. Verify server proxy and environment values.');
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages((prev) => [...prev, { role: 'model', parts: [{ text: data.text }] }]);
    } catch (err) {
      console.error(err);
      setErrorVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([]);
    setPrompt('');
    setErrorVisible(false);
  };

  // Safe lightweight JSX renderer for basic Markdown styles
  const renderMessageContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Formatted header
      if (line.startsWith('### ') || line.startsWith('**') && line.endsWith('**') && line.length < 50) {
        const title = line.replace(/### |^\*\*|\*\*$/g, '');
        return <h5 key={idx} className="font-extrabold text-sm sm:text-base text-gray-950 dark:text-white mt-3.5 mb-1.5">{title}</h5>;
      }
      
      // Bullets check
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const bulletText = line.trim().replace(/^[-*]\s+/, '');
        // Highlight bold sub-components
        const formatted = formatBoldSegments(bulletText);
        return (
          <li key={idx} className="ml-4 list-disc text-xs sm:text-sm font-semibold text-gray-700 dark:text-zinc-300 leading-relaxed mb-1">
            {formatted}
          </li>
        );
      }

      // Normal paragraph
      const formattedPara = formatBoldSegments(line);
      return (
        <p key={idx} className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-zinc-300 leading-relaxed min-h-[1rem] mb-2">
          {formattedPara}
        </p>
      );
    });
  };

  // Highlights text wrapped in ** ** in bold span elements
  const formatBoldSegments = (text: string) => {
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    if (parts.length === 1) return text;

    return parts.map((part, index) => {
      // Odd indices are the matches wrapped in ** **
      if (index % 2 !== 0) {
        return (
          <strong key={index} className="font-extrabold text-emerald-600 dark:text-emerald-400">
            {part}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-805 rounded-2xl shadow-sm h-[600px] flex flex-col justify-between overflow-hidden" id="ai_assistant_panel">
      {/* Header controls layout */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-950/20 shrink-0 select-none">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-700 text-white shadow-sm flex items-center justify-center animate-pulse">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white leading-tight">
              {t('assistantName')}
            </h3>
            <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
              {t('assistantSubtitle')}
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={handleResetChat}
            className="p-1 px-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 text-[10px] font-bold text-gray-500 hover:text-emerald-600 cursor-pointer transition-all flex items-center gap-1 bg-white dark:bg-zinc-950 shadow-sm"
            title="Reset Chat"
          >
            <RefreshCw size={11} />
            <span>{language === 'pt' ? 'Limpar Chat' : 'Clear Chat'}</span>
          </button>
        )}
      </div>

      {/* Messages Feed body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-gray-200">
        {/* Welcome Greeting message bubble */}
        <div className="flex gap-3.5 items-start">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-extrabold text-xs shrink-0 select-none">
            AI
          </div>
          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/10 dark:border-zinc-800 rounded-2xl rounded-tl-none p-4 max-w-[85%]">
            <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-zinc-300 leading-relaxed">
              {t('chatGreeting')}
            </p>
          </div>
        </div>

        {/* Custom conversations */}
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div key={index} className={`flex gap-3.5 items-start ${isUser ? 'flex-row-reverse' : ''} animate-in fade-in duration-200`}>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 select-none ${
                  isUser
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {isUser ? 'ME' : 'AI'}
              </div>

              <div
                className={`p-4 rounded-2xl max-w-[85%] border ${
                  isUser
                    ? 'bg-amber-50/30 dark:bg-amber-950/10 border-amber-500/10 rounded-tr-none text-gray-800 dark:text-zinc-200'
                    : 'bg-gray-50/50 dark:bg-zinc-950/25 border-gray-150 dark:border-zinc-800 rounded-tl-none'
                }`}
              >
                {isUser ? (
                  <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-zinc-200 leading-relaxed">
                    {msg.parts[0].text}
                  </p>
                ) : (
                  renderMessageContent(msg.parts[0].text)
                )}
              </div>
            </div>
          );
        })}

        {/* Typing waiting dots indication */}
        {loading && (
          <div className="flex gap-3.5 items-start">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-extrabold text-xs shrink-0">
              AI
            </div>
            <div className="bg-gray-50/50 dark:bg-zinc-950/25 border border-gray-150 dark:border-zinc-800 rounded-2xl rounded-tl-none p-4 w-20 flex justify-center items-center gap-1 py-3 animate-pulse">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
            </div>
          </div>
        )}

        {/* Error alerting block */}
        {errorVisible && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs flex items-start gap-2.5 shadow-sm">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">{language === 'pt' ? 'Erro de Conexão' : 'Connection Error'}</p>
              <p className="font-semibold text-gray-500">
                {language === 'pt'
                  ? 'Não foi possível receber conselhos no momento. Certifique-se de configurar a variável GEMINI_API_KEY nos segredos.'
                  : 'Unable to receive advice right now. Ensure your GEMINI_API_KEY environment variable is defined in the secrets.'}
              </p>
            </div>
          </div>
        )}

        <div ref={listEndRef} />
      </div>

      {/* Footer Disclaimer & Input Box */}
      <div className="p-3 bg-gray-50/50 dark:bg-zinc-950/20 border-t border-gray-100 dark:border-zinc-800 shrink-0 space-y-2">
        {/* Footnote Educational Disclaimer */}
        <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-semibold italic text-center px-4 leading-normal select-none">
          ⚠️ {t('assistantDisclaimer')}
        </p>

        {/* Main form prompt send */}
        <form onSubmit={handleSendSubmit} className="flex gap-2 relative">
          <input
            type="text"
            required
            disabled={loading}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t('assistantPlaceholder')}
            className="w-full h-11 pr-12 pl-4 py-2.5 bg-white dark:bg-zinc-950 border border-gray-250 dark:border-zinc-800 rounded-xl text-xs sm:text-sm text-gray-950 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />

          <button
            type="submit"
            disabled={!prompt.trim() || loading}
            className="absolute right-1.5 top-1.5 w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-500 hover:scale-103 dark:bg-emerald-500 text-white flex items-center justify-center cursor-pointer transition-all disabled:opacity-35"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
