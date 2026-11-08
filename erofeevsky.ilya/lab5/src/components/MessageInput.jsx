import React, {useState} from 'react';

export default function MessageInput({onSendMessage}) {
  const [text, setText] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    onSendMessage(trimmed);
    setText('');
  };

  return (
    <form className="message-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        data-testid="chat-message"
        placeholder="Введите сообщение..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoComplete="off"
      />
      <button type="submit" data-testid="chat-send">
        Отправить
      </button>
    </form>
  );
}
