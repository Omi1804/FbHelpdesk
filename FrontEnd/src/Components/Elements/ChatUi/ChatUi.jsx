import React, { useEffect } from "react";
import "./chatui.css";

const ChatUi = ({ messages, senderId }) => {
  return (
    <div className="chatUi">
      <div className="chatHeader">
        <p>Amit RG</p>
      </div>
      <section className="msger">
        <main className="msger-chat">
          {messages.map((msg) => (
            <div
              key={msg.messageId}
              className={
                msg.senderId === senderId ? "msg right-msg" : "msg left-msg"
              }
            >
              <div
                className="msg-img"
                style={{
                  backgroundImage: `url(${
                    msg.senderId === senderId
                      ? "senderImageURL"
                      : "receiverImageURL"
                  })`,
                }} // Replace with actual image URLs
              ></div>

              <div className="msg-bubble">
                <div className="msg-info">
                  <div className="msg-info-name">
                    {msg.senderId === senderId ? "You" : msg.senderName}
                  </div>
                  <div className="msg-info-time">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <div className="msg-text">{msg.messageContent}</div>
              </div>
            </div>
          ))}
        </main>

        <form className="msger-inputarea">
          <input
            type="text"
            className="msger-input"
            placeholder="Enter your message..."
          />
          <button type="submit" className="msger-send-btn">
            Send
          </button>
        </form>
      </section>
    </div>
  );
};

export default ChatUi;
