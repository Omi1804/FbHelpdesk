import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./pages.css";

const Pages = () => {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllThePages = async () => {
      try {
        const response = await axios.get(`${BASE_URL}userFacebook/fetchPages`, {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        const data = await response.data;
        setPages(data.pages);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllThePages();
  }, []);

  const connectPage = async (pageId) => {
    const currentPage = pages.find((page) => page.pageId === pageId);
    setSelectedPage(currentPage);
  };
  console.log(selectedPage);
  return (
    <section className="pagesSec">
      {selectedPage === null ? (
        <>
          <h2>Select The Page To Connect</h2>
          <ul>
            {pages.map((page) => (
              <li key={page.pageId} className="pagesList">
                {page.pageName}
                <button onClick={() => connectPage(page.pageId)}>
                  Connect
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <h2>
            Integrated Page - <span>{selectedPage.pageName}</span>
          </h2>
          <button className="deleteBtn">Delete Integration</button>
          <button
            className="replyBtn"
            onClick={() => navigate(`./${selectedPage.pageId}`)}
          >
            Reply to Messages
          </button>
        </>
      )}
    </section>
  );
};

export default Pages;
