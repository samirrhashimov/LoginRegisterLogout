import { Link, useNavigate } from "react-router-dom";
import "./Navlist.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function Navlist() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("currentUser");
      if (raw) setCurrentUser(JSON.parse(raw));
    } catch (e) {
      setCurrentUser(null);
    }
  }, []);

  const handleLogout = async () => {
    if (!currentUser) return;
    const baseUrl = "http://localhost:3000/users";
    try {
      await axios.put(`${baseUrl}/${currentUser.id}`, {
        ...currentUser,
        isLogined: false,
      });
    } catch (e) {
      // still proceed to clear local state even if backend fails
      console.error("logout backend failed", e);
    }

    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    toast.info("Logged out");
    navigate("/login");
  };

  return (
    <nav className="navlist">
      <ul>
        {!currentUser ? (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        ) : (
          <>
            <li className="username">Hello, {currentUser.username}</li>
            <li>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
