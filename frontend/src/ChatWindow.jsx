import "./ChatWindow.css";
import Chat from "./Chat";
import { MyContext } from "./MyContext";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import toast from "react-hot-toast";

export default function ChatWindow() {
  let {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    chats,
    setChats,
    setNewChat,
    theme,
    setTheme,
    sidebar,
    setSidebar,
    isLoggedin,
    setIsLoggedin,
    authForm,
    setAuthForm,
    user,
    setUser,
  } = useContext(MyContext);

  let [loading, setLoading] = useState(false); // state var for loader
  let [isOpen, setIsOpen] = useState(false); // state var for user icon click

  let getReply = async () => {
    if (!isLoggedin) {
      setAuthForm("login");
      return;
    }

    const token = localStorage.getItem("token");

    setNewChat(false);
    setLoading(true);

    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };

    let resp = await fetch("http://localhost:3000/chat/chat", options);

    if (!resp.ok) {
      setLoading(false);

      if (resp.status === 401) {
        localStorage.removeItem("token");
        setIsLoggedin(false);
        setAuthForm("login");
      }

      toast.error("Something went wrong, please try again after some times..!");

      return;
    }

    let data = await resp.json();

    console.log(data);
    setReply(data.reply);
    setLoading(false);
  };

  useEffect(() => {
    if (prompt && reply) {
      setChats((chats) => [
        ...chats,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);
    }

    setPrompt("");
  }, [reply]);

  // let changeTheme = () => {
  //   if (theme == "light") {
  //     setTheme("dark");
  //   } else {
  //     setTheme("light");
  //   }
  // };

  let getDetails = () => {
    setIsOpen(!isOpen);
  };

  let openLoginForm = () => {
    setAuthForm("login");
    setIsOpen(false);
  };

  let openSignupForm = () => {
    setAuthForm("signup");
    setIsOpen(false);
  };

  let handleLogout = () => {
    try {
      localStorage.removeItem("token");
      setIsLoggedin(false);
      setAuthForm(null);

      setChats([]);
      setReply(null);
      setPrompt("");
      setCurrThreadId(null);
      setNewChat(true);
      setIsOpen(false);
      setUser(null);

      toast.success("Log-out Successfully!");
    } catch (error) {
      console.log(error);
      toast.success("Error while Logging-out!");
    }
  };

  return (
    <div className="chatwindow">
      <div className="navbar">
        {!sidebar && (
          <div className="menu" onClick={() => setSidebar(true)}>
            <i className="fa-solid fa-bars" style={{ color: "#fff" }}></i>
          </div>
        )}

        <div className="name">
          <b>SmartChat</b> <i className="fa-solid fa-chevron-down"></i>
        </div>

        <div className="usericon" onClick={getDetails}>
          <span>
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="user-box">
          {/* <div className="user-box-close" onClick={() => setIsOpen(false)}>
            <i className="fa-solid fa-xmark"></i>
          </div> */}
          {isLoggedin ? (
            <>
              <div className="user-box-options">
                <div className="user-box-icon">
                  <i className="fa-solid fa-user"></i>
                </div>

                <div className="user-box-text">{user?.name}</div>
              </div>

              <div className="user-box-options" onClick={handleLogout}>
                <div className="user-box-icon">
                  <i className="fa-solid fa-right-from-bracket"></i>
                </div>

                <div className="user-box-text">Logout</div>
              </div>
            </>
          ) : (
            <>
              <div className="user-box-options" onClick={openLoginForm}>
                <div className="user-box-icon">
                  <i className="fa-solid fa-right-to-bracket"></i>
                </div>

                <div className="user-box-text">Login</div>
              </div>

              <div className="user-box-options" onClick={openSignupForm}>
                <div className="user-box-icon">
                  <i className="fa-solid fa-user-plus"></i>
                </div>

                <div className="user-box-text">Sign-up</div>
              </div>
            </>
          )}
        </div>
      )}

      <Chat />

      <ScaleLoader color="rgba(255,255,255)" loading={loading} />
      <div className="chatinput">
        <div className="inputbox">
          <input
            type="text"
            placeholder="Ask anything"
            className="input"
            value={prompt}
            onChange={(ev) => setPrompt(ev.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
          />
          <button className="send" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
        <p className="info">
          SmartChat can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}
