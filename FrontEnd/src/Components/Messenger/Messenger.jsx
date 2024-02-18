import { useEffect, useState } from "react";
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
        profilePic: selected.profilePic, // assuming you have this info
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const currentUserId = "186383267901490";

  console.log(conversations);
  console.log(selectedConversation);
  console.log(messages);
  console.log(userDetails);
  return (
    <section className="messengerSec">
      <div className="sec1 navbar">
        <ul className="navList">
          <li className="link">
            <span class="material-symbols-outlined navIcons">home</span>
          </li>
          <li className="link">
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
              className="head"
              onClick={() => handleConversationClick(conv.conversationId)}
            >
              <div className="nameDetails">
                <input type="checkbox" />
                <p>{conv.initiatorName}</p>
                {/* Convert timestamp to a readable format, e.g., "10m ago". Consider using a library like date-fns or moment.js for more complex formatting */}
                <span>
                  {new Date(conv.lastMessageTimestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="lastMsg">
                <p>{conv.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="sec3 conversations">
        {selectedConversation ? (
          <>
            <ChatUi messages={messages} senderId={currentUserId} />
          </>
        ) : (
          <div className="no-messages">Select the Conversations To begin</div>
        )}
      </div>
      <div className="sec4 userDetails">
        {userDetails ? (
          <>
            <UserDetails />
          </>
        ) : (
          <div className="no-details">No Details</div>
        )}
      </div>
    </section>
  );
};

export default Messenger;
