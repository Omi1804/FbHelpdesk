import { useEffect, useState } from "react";
import axios from "axios";
import "./messenger.css";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../config";

const Messenger = () => {
  const params = useParams();
  const pageId = params.pageId;
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await axios.get(
        `${BASE_URL}pages/${pageId}/conversations`,
        {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      const messages = await response.data;
      setConversations(messages.conversations);
    };

    fetchMessages();
  }, []);

  console.log(conversations);
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
          <div className="head">
            <div className="nameDetails">
              <input type="checkbox" />
              <p>Amit RG</p>
              <span>10m</span>
            </div>
            <div className="lastMsg">
              <p>Lorem ipsumipsum ipsum ipsum ipsum...</p>
            </div>
          </div>
        </div>
      </div>
      <div className="sec3 conversations">
        <div className="heading"></div>
      </div>
      <div className="sec4 userDetails"></div>
    </section>
  );
};

export default Messenger;
