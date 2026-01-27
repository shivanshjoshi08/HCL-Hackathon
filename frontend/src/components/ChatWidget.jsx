import { useState, useEffect, useRef } from 'react';
import { X, ArrowUp, Bot } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/chatbot';

const SUGGESTIONS = [
  'How do I transfer money?',
  'How to check my balance?',
  'How to open a new account?',
  'What is KYC verification?',
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1">
      <span className="w-2 h-2 rounded-full animate-bounce bg-zinc-400" />
      <span className="w-2 h-2 rounded-full animate-bounce bg-zinc-400" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 rounded-full animate-bounce bg-zinc-400" style={{ animationDelay: '300ms' }} />
    </div>
  );
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [botName, setBotName] = useState('SmartBank Assistant');
  const messagesEndRef = useRef(null);

  // Load config and chat history
  useEffect(() => {
    fetch(`${API_URL}/config`)
      .then(res => res.json())
      .then(data => setBotName(data.botName))
      .catch(() => setBotName('SmartBank Assistant'));

    const saved = localStorage.getItem('smartbank_chat_history');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse chat history');
      }
    }
  }, []);

  // Save chat history
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('smartbank_chat_history', JSON.stringify(messages));
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Show greeting when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'bot', text: `Hi! I'm ${botName}. How can I help you with your banking today?` }]);
    }
  }, [isOpen, botName]);

  // Send message
  async function handleSend(textOverride) {
    const text = textOverride || inputValue;
    if (!text?.trim() || isLoading) return;

    const newMsg = { role: 'user', text };
    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.text
      }));

      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history })
      });

      const data = await response.json();

      if (data.action === 'NAVIGATE') {
        setMessages(prev => [...prev, { role: 'bot', text: `Taking you to ${data.url}...` }]);
        setTimeout(() => window.location.href = data.url, 1500);
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: data.text }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I encountered an issue. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  }

  // Clear chat
  function clearChat() {
    localStorage.removeItem('smartbank_chat_history');
    setMessages([]);
    setIsOpen(false);
  }

  // Closed state - show button
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(to bottom right, #2563eb, #3b82f6)',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      >
        <Bot size={28} color="white" />
      </button>
    );
  }

  // Open state - show chat window
  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '380px',
      height: '550px',
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 9999,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Bot size={20} color="white" />
          </div>
          <span style={{ color: 'white', fontWeight: '600' }}>{botName}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={clearChat}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Reset
          </button>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        backgroundColor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {/* Suggestions */}
        {messages.length <= 1 && !isLoading && (
          <div style={{ marginBottom: '8px' }}>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Quick questions:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s)}
                  style={{
                    padding: '8px 12px',
                    fontSize: '13px',
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    color: '#334155',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message list */}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
            }}
          >
            <div style={{
              padding: '12px 16px',
              borderRadius: '16px',
              borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
              borderBottomLeftRadius: msg.role === 'bot' ? '4px' : '16px',
              backgroundColor: msg.role === 'user' ? '#2563eb' : '#fff',
              color: msg.role === 'user' ? 'white' : '#1e293b',
              boxShadow: msg.role === 'bot' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              border: msg.role === 'bot' ? '1px solid #e2e8f0' : 'none',
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div style={{ alignSelf: 'flex-start' }}>
            <div style={{
              padding: '12px 16px',
              borderRadius: '16px',
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
            }}>
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '12px', borderTop: '1px solid #e2e8f0', backgroundColor: 'white' }}>
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '6px',
          backgroundColor: '#f1f5f9',
          borderRadius: '12px',
        }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '14px',
              padding: '8px 12px',
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputValue || isLoading}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#2563eb',
              border: 'none',
              cursor: inputValue && !isLoading ? 'pointer' : 'default',
              opacity: inputValue && !isLoading ? 1 : 0.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowUp size={18} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatWidget;
