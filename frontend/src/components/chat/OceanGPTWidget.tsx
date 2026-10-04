import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

const OceanGPTWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'bot', text: "Hello! I'm Ocean-GPT. Ask me anything about the current marine recovery operations, hotspots, or debris statistics." }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMsg: Message = { id: Date.now().toString(), sender: 'user', text: inputValue };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/api/v1/chat', { message: newUserMsg.text });
      const newBotMsg: Message = { id: (Date.now() + 1).toString(), sender: 'bot', text: res.data.response };
      setMessages(prev => [...prev, newBotMsg]);
    } catch (error) {
      console.error('Error sending message to Ocean-GPT:', error);
      const errorMsg: Message = { id: (Date.now() + 1).toString(), sender: 'bot', text: "I'm having trouble connecting to the data center right now. Please try again later." };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] flex flex-col bg-surface-container/90 backdrop-blur-xl border border-outline/20 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform origin-bottom-right">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-outline/10 bg-surface-container-high/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-primary-fixed">water_drop</span>
              </div>
              <div>
                <h3 className="text-on-surface font-headline-sm">Ocean-GPT</h3>
                <p className="text-on-surface-variant text-label-sm">Marine Intelligence Assistant</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-surface-bright flex items-center justify-center text-on-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex max-w-[85%] ${msg.sender === 'user' ? 'self-end' : 'self-start'}`}
              >
                <div 
                  className={`p-3 rounded-2xl ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-on-primary rounded-tr-sm' 
                      : 'bg-surface-container-highest text-on-surface rounded-tl-sm'
                  }`}
                >
                  <p className="text-body-md whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex self-start max-w-[85%]">
                <div className="p-4 rounded-2xl bg-surface-container-highest text-on-surface rounded-tl-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary-fixed animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-primary-fixed animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-primary-fixed animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-outline/10 bg-surface-container-high/30">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about hotspots, debris..."
                className="flex-1 bg-surface border border-outline/20 rounded-full px-4 py-2.5 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-fixed transition-colors text-body-md"
                disabled={isLoading}
              />
              <button 
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="w-11 h-11 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 flex-shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 ${
          isOpen 
            ? 'bg-surface-container-highest text-on-surface scale-90' 
            : 'bg-primary text-on-primary shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:shadow-[0_0_25px_rgba(0,242,254,0.5)]'
        }`}
      >
        <span className="material-symbols-outlined text-[28px]">
          {isOpen ? 'expand_more' : 'chat_bubble'}
        </span>
      </button>
    </div>
  );
};

export default OceanGPTWidget;
