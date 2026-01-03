import { useState, useRef, useEffect } from 'react';
import { Send, X, Loader2, Brain, Cpu, Zap } from 'lucide-react';

const Chatbot = ({ bookId = 'constitution' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch("https://hackathon-i-physical-ai-book-chatbot-production.up.railway.app/api/query", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: inputValue,
          book_id: bookId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();
      let botResponse = data.response || data.answer || data.result || data.text || data.content || data.message || JSON.stringify(data);

      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot'
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = {
        id: Date.now() + 1,
        text: `Error: ${err.message || 'Failed to connect to backend'}`,
        sender: 'bot',
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed z-50 font-sans bottom-6 right-6">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative w-16 h-16 transition-all duration-300 rounded-full shadow-2xl group bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 hover:shadow-cyan-500/50 hover:scale-110 active:scale-95"
        >
          <div className="absolute inset-0 transition-opacity duration-300 rounded-full opacity-0 bg-gradient-to-br from-cyan-400 to-blue-400 group-hover:opacity-30 blur-xl animate-pulse" />
          <div className="relative flex items-center justify-center">
            {/* Robot Head Icon */}
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="8" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
              <circle cx="9" cy="12" r="1" fill="currentColor"/>
              <circle cx="15" cy="12" r="1" fill="currentColor"/>
              <path d="M9 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 8V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="4" r="1" fill="currentColor"/>
              <path d="M6 10H4M20 10h-2M6 14H4M20 14h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="absolute w-4 h-4 bg-green-500 border-2 border-white rounded-full -top-1 -right-1 animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="flex flex-col w-96 h-[600px] bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-cyan-500/30 animate-in slide-in-from-bottom-8 duration-300">
          {/* Header */}
          <div className="relative p-5 text-white bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600">
            <div className="absolute inset-0 bg-black/20" />
            {/* Animated Circuit Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <pattern id="circuit" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="1" fill="white"/>
                  <circle cx="30" cy="30" r="1" fill="white"/>
                  <path d="M10 10 L30 10 L30 30" stroke="white" strokeWidth="0.5" fill="none"/>
                </pattern>
                <rect width="100%" height="100%" fill="url(#circuit)"/>
              </svg>
            </div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex items-center justify-center w-12 h-12 border bg-white/20 backdrop-blur-sm rounded-xl border-white/30">
                    <Brain className="w-6 h-6 text-white animate-pulse" />
                  </div>
                  <div className="absolute w-4 h-4 bg-green-400 border-2 border-gray-900 rounded-full -bottom-1 -right-1 animate-pulse">
                    <Zap className="absolute w-2 h-2 text-gray-900 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" />
                  </div>
                </div>
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-bold">
                    AI Assistant
                    <Cpu className="w-4 h-4 animate-spin" style={{animationDuration: '3s'}} />
                  </h3>
                  <p className="flex items-center gap-1 text-xs text-white/90">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    Neural network active
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-8 h-8 transition-colors rounded-lg hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-800">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-full bg-cyan-500 blur-3xl opacity-20 animate-pulse" />
                  <div className="relative flex items-center justify-center w-24 h-24 transition-transform duration-300 transform border bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 rounded-2xl rotate-6 hover:rotate-12 border-cyan-400/30">
                    {/* Robot Icon */}
                    <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="6" y="8" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <circle cx="9" cy="12" r="1.5" fill="currentColor"/>
                      <circle cx="15" cy="12" r="1.5" fill="currentColor"/>
                      <path d="M9 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M12 8V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="4" r="1.5" fill="currentColor"/>
                      <path d="M6 10H4M20 10h-2M6 14H4M20 14h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
                <h4 className="mb-2 text-xl font-bold text-white">
                  Welcome! How can I help?
                </h4>
                <p className="text-sm leading-relaxed text-gray-400">
                  Ask me anything about this book. My neural network is ready to assist!
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-200`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-sm shadow-lg shadow-cyan-900/50'
                        : msg.isError
                        ? 'bg-red-500/20 text-red-300 border border-red-500/50 rounded-bl-sm'
                        : 'bg-gray-700/80 text-gray-100 border border-cyan-500/20 rounded-bl-sm backdrop-blur-sm'
                    }`}
                  >
                    {msg.sender === 'bot' && !msg.isError && (
                      <div className="flex items-center gap-2 pb-2 mb-2 border-b border-cyan-500/20">
                        <Brain className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-semibold text-cyan-400">AI Response</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                      {msg.text}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                      }`}
                    >
                      {new Date(msg.id).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start duration-200 animate-in slide-in-from-bottom-2">
                <div className="px-4 py-3 text-gray-100 border rounded-bl-sm bg-gray-700/80 border-cyan-500/20 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Cpu className="w-5 h-5 text-cyan-400 animate-spin" />
                      <div className="absolute inset-0 rounded-full bg-cyan-400 blur-md opacity-30 animate-pulse" />
                    </div>
                    <span className="text-sm text-gray-300">Processing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-gray-900/80 border-cyan-500/20 backdrop-blur-sm">
            <div className="flex items-end gap-2">
              <div className="relative flex-1">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  rows="1"
                  className="w-full px-4 py-3 pr-12 text-sm text-white placeholder-gray-500 transition-all border resize-none bg-gray-800/80 border-cyan-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent max-h-32 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ minHeight: '44px' }}
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                  }}
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={isLoading || !inputValue.trim()}
                className="flex items-center justify-center text-white transition-all duration-200 border w-11 h-11 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 border-cyan-400/30"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;