import React from 'react';

function ChatMessage({author, text, time}) {
  return (
    <div className="message-item" data-testid="chat-item">
      <div className="message-header">
        <span className="message-author">{author}</span>
        <span className="message-time">{time}</span>
      </div>
      <div className="message-body">{text}</div>
    </div>
  );
}

export default function MessageList({messages}) {
  return (
    <div className="messages-container" data-testid="chat-history">
      {messages.length === 0 ? (
        <div className="messages-empty">
          <p>Сообщений пока нет. Будьте первым!</p>
        </div>
      ) : (
        messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            author={msg.author}
            text={msg.text}
            time={msg.time}
          />
        ))
      )}
    </div>
  );
}
