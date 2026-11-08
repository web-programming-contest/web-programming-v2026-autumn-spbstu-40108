import React, {StrictMode, useState, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';
import MessageList from './components/MessageList.jsx';
import MessageInput from './components/MessageInput.jsx';

const STORAGE_KEY = 'chat_messages';

function App() {
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('chat_name') || 'Пользователь';
  });

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('Ошибка чтения из localStorage:', err);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (err) {
      console.error('Ошибка записи в localStorage:', err);
    }
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('chat_name', username);
  }, [username]);

  const handleSendMessage = (text) => {
    const newMessage = {
      id: Date.now(),
      author: username.trim() || 'Пользователь',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="chat-window">
      <header className="chat-header">
        <div className="user-profile">
          <label htmlFor="user-name">Ваш никнейм:</label>
          <input
            id="user-name"
            data-testid="chat-name"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <button
          className="clear-btn"
          data-testid="chat-clear"
          type="button"
          onClick={handleClearChat}
        >
          Очистить чат
        </button>
      </header>

      <main className="chat-content">
        <MessageList messages={messages} />
      </main>

      <footer className="chat-footer">
        <MessageInput onSendMessage={handleSendMessage} />
      </footer>
    </div>
  );
}

const rootElement = document.querySelector('[data-testid="app"]');

if (!rootElement) {
  throw new Error('Корневой элемент приложения не найден.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
