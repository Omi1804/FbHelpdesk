import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import "./chatui.css";
import { BASE_URL } from "../../../config";

const ChatUi = ({ name, messages, senderId, onMessageSent }) => {
  //post request for the send message

  const [messageContent, setMessageContent] = useState("");
  const messagesContainerRef = useRef(null);

  // Function to scroll to the last message
  const scrollToBottom = () => {
    const scrollHeight = messagesContainerRef.current.scrollHeight;
    const height = messagesContainerRef.current.clientHeight;
    const maxScrollTop = scrollHeight - height;
    messagesContainerRef.current.scrollTop =
      maxScrollTop > 0 ? maxScrollTop : 0;
  };

  // Scroll to the bottom of the chat whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageContent.trim()) return;

    try {
      const response = await axios.post(
        `${BASE_URL}conversations/${
          messages[messages.length - 1].conversationId
        }/send`,
        { messageContent },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data && response.data.messageId) {
        // Message sent successfully
        console.log("Message sent:", response.data);
        // You might want to clear the input field here
        setMessageContent("");
        // You might want to refresh the messages list here
        onMessageSent({
          conversationId: response.data.conversationId,
          fbConversationId: response.data.fbConversationId,
          messageContent,
          messageId: response.data.messageId,
          senderId,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error(
        "Error sending message:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="chatUi">
      <div className="chatHeader">
        <p>{name}</p>
      </div>
      <section className="msger">
        <main className="msger-chat" ref={messagesContainerRef}>
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
                  backgroundColor: `${
                    msg.senderId === senderId ? "#3b74d7" : "orange"
                  }`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.4rem",
                  fontWeight: "400",
                  color: "white",
                }}
              >
                {msg.senderId === senderId ? "Y" : name[0]}
              </div>

              <div className="msg-bubble">
                <div className="msg-info">
                  <div className="msg-info-name">
                    {msg.senderId === senderId ? "You" : name}
                  </div>
                  <div className="msg-info-time">
                    {/* {new Date(msg.timestamp).toLocaleTimeString()} */}
                    {format(new Date(msg.timestamp), "p")}
                  </div>
                </div>
                <div className="msg-text">{msg.messageContent}</div>
              </div>
            </div>
          ))}
        </main>

        <form className="msger-inputarea" onSubmit={handleSendMessage}>
          <input
            type="text"
            className="msger-input"
            placeholder="Enter your message..."
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
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
