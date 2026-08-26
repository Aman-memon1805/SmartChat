import "./App.css";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import Chat from "./Chat";
import { MyContext } from "./MyContext";
import { useState , useEffect } from "react";
import { v1 as uuidv1 } from "uuid";
import AuthModal from "./AuthModal";
import { Toaster } from "react-hot-toast";

function App() {
  let [prompt, setPrompt] = useState("");
  let [reply, setReply] = useState(null);

  let [currThreadId, setCurrThreadId] = useState(uuidv1());
  let [chats, setChats] = useState([]); // store all chats of currthread

  let [allThreads, setAllThreads] = useState([]);

  let [newChat, setNewChat] = useState(true); // store new chat
  let [theme, setTheme] = useState("dark"); // for changing theme

  let [sidebar, setSidebar] = useState(false);

  const [isLoggedin, setIsLoggedin] = useState(!!localStorage.getItem("token"));

  let [authForm, setAuthForm] = useState(null);

  const [user, setUser] = useState(null);

  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    chats,
    setChats,
    newChat,
    setNewChat,
    allThreads,
    setAllThreads,
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
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoggedin(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          localStorage.removeItem("token");
          setIsLoggedin(false);
          setUser(null);

          return;
        }

        setUser(data.user);
        setIsLoggedin(true);
      } catch (error) {
        console.log(error);

        setIsLoggedin(false);
      }
    };

    checkAuth();
  },);

  return (
    <div className="app">
      <MyContext.Provider value={providerValues}>
        <Toaster 
        position="top-center"
        toastOptions={{
        duration: 2000,
        style: {
            background: "#2a2a2a",
            color: "#fff",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "10px",
            padding: "12px 16px",
            fontSize: "14px",
          },
        }}
        />
        <Sidebar />
        <ChatWindow />
        <AuthModal />
      </MyContext.Provider>
    </div>
  );
}

export default App;
