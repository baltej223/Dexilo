import React, { useState, useEffect } from 'react';

const ChatWindow = ({ project, user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Placeholder messages for demo
  useEffect(() => {
    setMessages([
      {
        id: 1,
        user: 'Alice',
        message: 'Hey everyone! Ready to work on this track?',
        timestamp: new Date(Date.now() - 3600000).toLocaleTimeString()
      },
      {
        id: 2,
        user: 'Bob',
        message: 'Yes! I have some new drum patterns to share',
        timestamp: new Date(Date.now() - 1800000).toLocaleTimeString()
      }
    ]);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      user: user?.name || 'Anonymous',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>💬 Team Chat</h3>
        <p>Real-time collaboration chat for "{project.title}"</p>
      </div>

      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className="chat-message">
            <div className="message-header">
              <span className="message-user">{msg.user}</span>
              <span className="message-time">{msg.timestamp}</span>
            </div>
            <div className="message-content">{msg.message}</div>
          </div>
        ))}
      </div>

      <form className="chat-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="message-input"
        />
        <button type="submit" className="send-btn">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
