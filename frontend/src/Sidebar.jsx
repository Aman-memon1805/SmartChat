import { useContext, useEffect, useState } from "react";
import "./Sidebar.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { MyContext } from "./MyContext";
import { v1 as uuidv1 } from "uuid";

export default function Sidebar() {
  let {
    allThreads,
    setAllThreads,
    currThreadId,
    newChat,
    setNewChat,
    setPrompt,
    setCurrThreadId,
    setReply,
    setChats,
    sidebar,
    setSidebar,
    isLoggedin,
    setIsLoggedin,
    setAuthForm,
  } = useContext(MyContext);

  let [deleted, setDeleted] = useState(false);

  let getAllThreads = async () => {
    if (!isLoggedin) {
      setAllThreads([]);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/chat/thread`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();

      if (!response.ok) {
        console.log(res);
        return;
      }

      let data = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));

      setAllThreads(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId, deleted, isLoggedin]);

  let getNewChat = () => {
    if (isLoggedin == false) {
      setAuthForm("login");
      return;
    }

    setSidebar(false);
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setChats([]);
    setCurrThreadId(uuidv1());
  };

  let getThread = async (threadId) => {
    setNewChat(false);
    setCurrThreadId(threadId);
    setReply(null);
    try {
      const token = localStorage.getItem("token");

      let res = await fetch(`${import.meta.env.VITE_API_URL}/chat/thread/${threadId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let messages = await res.json();

      if (!res.ok) {
        console.log(messages);
        return;
      }

      setChats(messages);
      setSidebar(false);

    } catch (error) {
      console.log(error);
    }
  };

  let deleteThread = async (threadId) => {
    try {
      const token = localStorage.getItem("token");

      let resp = await fetch(`${import.meta.env.VITE_API_URL}/chat/thread/${threadId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let deletedThread = await resp.json();
      // console.log(deletedThread);
      setDeleted(!deleted);

      if (threadId == currThreadId) {
        getNewChat();
      }
    } catch (error) {
      console.log(error);
    }
  };

  let closeSidebar = () => {
    setSidebar(false);
  };

  return (
    <>
      <section className={sidebar == true ? "sidebar" : "sidebar-closed"}>
        {/* new chat button */}
        <button className="icon-container">
          <i
            className="fa-brands fa-openai logo"
            style={{ color: "rgb(255, 255, 255)" }}
          ></i>

          <div className="icons">
            <span>
              <i
                className="fa-solid fa-pen-to-square"
                style={{ color: "rgb(255, 255, 255)" }}
                onClick={getNewChat}
              ></i>
            </span>
            <span>
              <i className="fa-solid fa-xmark" onClick={closeSidebar}></i>
            </span>
          </div>
        </button>

        {/* chat history */}
        <ul className="history">
          <h3> &nbsp; Recents</h3>
          {allThreads?.map((thread) => (
            <li
              key={thread.threadId}
              onClick={() => getThread(thread.threadId)}
              className={currThreadId == thread.threadId ? "highlighted" : ""}
            >
              <span className="chat-title">{thread.title}</span>
              <i
                className="fa-solid fa-trash"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteThread(thread.threadId);
                }}
              ></i>
            </li>
          ))}
        </ul>

        {/* sign */}
        <div className="sign">by @ Aman Memon &hearts;</div>
      </section>
    </>
  );
}
