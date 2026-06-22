import { useState, useRef, useEffect } from 'react';
import { PRODUCTS } from '../data/products';
import { supabase } from '../lib/supabase';

const QUICK_CHIPS = [
  { label: 'Best electronics', msg: 'What are your best electronics?' },
  { label: 'Fitness gear', msg: 'Recommend something for fitness' },
  { label: 'On sale', msg: 'What is on sale?' },
  { label: 'Gift ideas', msg: 'Help me find a gift under $50' },
];

const GROK_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/grok-chat`;

export default function Chat() {
  const [messages, setMessages] = useState([
    { id: 0, type: 'bot', text: "👋 Hi! I'm your SmartShop assistant. Ask me about products, recommendations, or anything about your shopping experience!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendChat(text) {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg = { id: Date.now(), type: 'user', text: msg };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const productList = PRODUCTS.map(p => `${p.name} (${p.cat}, $${p.price})`).join(', ');

      const systemMsg = {
        role: 'system',
        content: `You are SmartBot, a friendly AI shopping assistant for SmartShop. Our products: ${productList}. Help users find products, give recommendations, answer questions. Be concise (2-3 sentences max). Be enthusiastic but professional.`,
      };
      const newHistory = [...chatHistory, { role: 'user', content: msg }];

      const { data: { session } } = await supabase.auth.getSession();

      const res = await fetch(GROK_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          messages: [systemMsg, ...newHistory],
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Request failed');

      const reply = data.reply || "Sorry, I couldn't process that. Please try again!";
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: reply }]);
      setChatHistory([...newHistory, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('Chat error:', err.message);
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: "Sorry, I'm having trouble connecting. Please try again!" }]);
    }

    setLoading(false);
  }

  return (
    <div>
      <div className="section-title">AI Shopping Assistant</div>
      <div className="chatbot-wrap">
        <div className="chat-header">
          <div className="chat-avatar">🤖</div>
          <div>
            <div className="chat-title">SmartBot</div>
            <div className="chat-subtitle">Powered by Grok AI</div>
          </div>
          <div className="online-dot" />
        </div>

        <div className="chat-messages">
          {messages.map(m => (
            <div key={m.id} className={`msg ${m.type}`}>{m.text}</div>
          ))}
          {loading && (
            <div className="msg loading">
              <div className="typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="quick-chips">
          {QUICK_CHIPS.map(chip => (
            <button key={chip.label} className="chip" onClick={() => sendChat(chip.msg)}>
              {chip.label}
            </button>
          ))}
        </div>

        <div className="chat-input-row">
          <input
            className="chat-input"
            placeholder="Ask me anything about our products..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendChat()}
            disabled={loading}
          />
          <button
            className="send-btn"
            onClick={() => sendChat()}
            disabled={loading}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}