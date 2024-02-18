import { useEffect, useState } from "react";
import { formatDistance } from "date-fns";
import axios from "axios";
import "./messenger.css";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../config";
import ChatUi from "../Elements/ChatUi/ChatUi";
import UserDetails from "../Elements/UserDetails/UserDetails";

const Messenger = () => {
  const params = useParams();
  const pageId = params.pageId;
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchCoversations = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}pages/${pageId}/conversations`,
          {
            headers: {
              authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        setConversations(response.data.conversations);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        // Handle error, e.g., set an error state, show a message, etc.
      }
    };

    fetchCoversations();
  }, [pageId]);

  const handleConversationClick = async (conversationId) => {
    const selected = conversations.find(
      (conv) => conv.conversationId === conversationId
    );
    setSelectedConversation(selected);

    // Fetch messages for the selected conversation
    try {
      const response = await axios.get(
        `${BASE_URL}conversations/${conversationId}/messages`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessages(response.data);

      setUserDetails({
        name: selected.initiatorName,
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const currentUserId = "186383267901490";

  const handleMessageSent = (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return (
    <section className="messengerSec">
      <div className="sec1 navbar">
        <ul className="navList">
          <li className="link">
            <span class="material-symbols-outlined navIcons">home</span>
          </li>
          <li className="link selected">
            <span class="material-symbols-outlined navIcons">inbox</span>
          </li>
          <li className="link">
            <span class="material-symbols-outlined navIcons">group</span>
          </li>
          <li className="link">
            <span class="material-symbols-outlined navIcons">query_stats</span>
          </li>
        </ul>
      </div>
      <div className="sec2 allConversations">
        <div className="heading">
          <span class="material-symbols-outlined">menu_open</span>
          <p>Conversations</p>
          <span class="material-symbols-outlined refresh">refresh</span>
        </div>
        <div className="conversationsList">
          {conversations.map((conv) => (
            <div
              key={conv.conversationId}
              // className="head"
              className={`${
                selectedConversation && selectedConversation._id === conv._id
                  ? "selected"
                  : ""
              } head`}
              onClick={() => handleConversationClick(conv.conversationId)}
            >
              <div className="nameDetails">
                <input type="checkbox" />
                <p>{conv.initiatorName}</p>
                <span>
                  {formatDistance(
                    new Date(conv.lastMessageTimestamp),
                    new Date(),
                    { addSuffix: true }
                  )}
                </span>
              </div>
              <div className="lastMsg">
                <p>Message : {conv.lastMessage}...</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="sec3 conversations">
        {selectedConversation ? (
          <>
            <ChatUi
              name={selectedConversation.initiatorName}
              messages={messages}
              senderId={currentUserId}
              onMessageSent={handleMessageSent}
            />
          </>
        ) : (
          <div className="no-messages">Select the Conversations To begin</div>
        )}
      </div>
      <div className="sec4 userDetails">
        {userDetails ? (
          <>
            <UserDetails name={selectedConversation.initiatorName} />
          </>
        ) : (
          <div className="no-details">No Details</div>
        )}
      </div>
    </section>
  );
};

export default Messenger;
