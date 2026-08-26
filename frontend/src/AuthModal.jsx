import { MyContext } from "./MyContext";
import { useContext, useState } from "react";
import "./AuthModal.css";
import toast from "react-hot-toast";

export default function AuthModal() {
  const { authForm, setAuthForm, setIsLoggedin, user, setUser } =
    useContext(MyContext);

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Signup failed");
        return;
      }

      localStorage.setItem("token", data.token);
      toast.success(data.message || "Account created successfully");

      setUser(data.user);
      setIsLoggedin(true);
      setAuthForm(null);

      setSignupData({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);

      setAuthForm(null);
      setIsLoggedin(true);
      setUser(data.user);

      setLoginData({
        email: "",
        password: "",
      });

      toast.success(data.message || "Login successful");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {authForm && (
        <div className="auth-overlay">
          <div className="auth-modal">
            <button className="auth-close" onClick={() => setAuthForm(null)}>
              <i className="fa-solid fa-xmark"></i>
            </button>

            {authForm === "login" && (
              <div className="auth-content">
                <h2>Welcome back</h2>
                <p className="auth-subtitle">Login to continue to your chats</p>

                <form onSubmit={handleLogin}>
                  <div className="auth-input-group">
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({
                          ...loginData,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="auth-input-group">
                    <label>Password</label>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({
                          ...loginData,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>

                  <button type="submit" className="auth-submit">
                    Login
                  </button>
                </form>

                <p className="auth-switch">
                  Don't have an account?
                  <span onClick={() => setAuthForm("signup")}>Sign up</span>
                </p>
              </div>
            )}

            {authForm === "signup" && (
              <div className="auth-content">
                <h2>Create an account</h2>
                <p className="auth-subtitle">Sign up to start chatting</p>

                <form onSubmit={handleSignup}>
                  <div className="auth-input-group">
                    <label>Name</label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={signupData.name}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="auth-input-group">
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="auth-input-group">
                    <label>Password</label>
                    <input
                      type="password"
                      placeholder="Create your password"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>

                  <button type="submit" className="auth-submit">
                    Sign up
                  </button>
                </form>

                <p className="auth-switch">
                  Already have an account?
                  <span onClick={() => setAuthForm("login")}>Login</span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
