'use client';

import { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  function renderMarkdown(content: string) {
    const html = marked(content);
    const cleanHtml = DOMPurify.sanitize(html, { RETURN_PROMISE: false });
    return (
      <div style={{ padding: '8px 12px' }} dangerouslySetInnerHTML={{ __html: cleanHtml }} />
    );
  }

  async function sendMessage() {
    if (!input.trim()) return;

    setLoading(true);
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await res.json();
    setMessages([...newMessages, data]);
    setLoading(false);
  }

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <main style={{ maxWidth: '700px', margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ fontFamily: 'Merriweather, serif', fontSize: '2rem', marginBottom: '1rem' }}>
        LUCID Research Assistant
      </h1>

      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: '12px',
          background: '#f9fafb',
          padding: '16px',
          height: '400px',
          overflowY: 'auto',
          marginBottom: '24px',
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: '12px' }}>
            <strong>{m.role === 'user' ? 'You' : 'Assistant'}:</strong>
            <div>{renderMarkdown(m.content)}</div>
          </div>
        ))}
        {loading && <div><em>Assistant is typing...</em></div>}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => (e.key === 'Enter' ? sendMessage() : null)}
          placeholder="Ask me anything about LUCID..."
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '10px',
            border: '1px solid #ddd',
            fontSize: '1rem',
            marginRight: '12px',
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: '12px 24px',
            borderRadius: '10px',
            background: '#2563eb',
            color: '#fff',
            fontWeight: 'bold',
            border: 'none',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </div>
<div style={{ marginTop: '32px', fontSize: '0.9rem', color: '#555', textAlign: 'center' }}>
  <p>
    This assistant was created with the purpose of helping with LUCID setup. The code is open-source, offered without any warranties, at <a href="#" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>LUCID Help Chatbot</a> on Simon's Github page.</p>
<p> Remember: Key resources, templates, and setup instructions are available at 
    <a href="https://lucidresearch.io" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', marginLeft: '4px' }}>lucidresearch.io</a>.
  </p>
</div>
    </main>
  );
}