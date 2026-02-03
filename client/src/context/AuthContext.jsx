import React, { createContext, useState,   useEffect } from "react";
export const AuthContext = createContext();

const AuthProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem("authToken") || "");
  const [activeuser, setActiveuser] = useState(
    localStorage.getItem("activeUser") || ""
  );
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [status, setStatus] = useState(token ? "success" : "idle");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await fetch(process.env.BACKEND + "/verify-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (data.status === "success") {
            setUser(data.user);
            setEmail(data.user.email);
            setName(data.user.name);
            setActiveuser(data.user.email);
            localStorage.setItem("user", JSON.stringify(data.user));
            setStatus("success");
          } else {
                        
            localStorage.removeItem("authToken");
            localStorage.removeItem("activeUser");
            localStorage.removeItem("user");
            setStatus("idle");
            setActiveuser("");
            setUser(null);
            setToken("");
          }
        } catch (err) {
          const storedUser = localStorage.getItem("user");
          if (token && storedUser) {
            setUser(JSON.parse(storedUser));
            setActiveuser(JSON.parse(storedUser).email);
            setStatus("success");
          }
        }
      } else {
        setStatus("idle");
        setActiveuser("");
        setUser(null);
        setToken("");
      }
      setLoading(false);
    };
    verifyToken();
  }, []);

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("activeUser");
    localStorage.removeItem("user");
    setUser(null);
    setActiveuser("");
    setStatus("idle");
    setToken("");
    setEmail("");
    setName("");
    setSuccess("Logged out successfully");
  };

  const value = {
    user,
    setUser,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    error,
    setError,
    success,
    setSuccess,
    status,
    setStatus,
    logout,
    activeuser,
    setActiveuser,
    token,
    setToken,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};

export default AuthProvider;
