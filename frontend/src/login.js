import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./login.css";

function Login({ setLoggedInUser }) {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const handleSelect = (user) => {
    setLoggedInUser(user);
    navigate("/swipe");
  };
  const [search, setSearch] = useState("");

  return (
    <div className="login-page">
      <div className="login-orb orb-left"></div>
      <div className="login-orb orb-right"></div>

      <motion.div
        className="login-box"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="login-title">Welcome Back 👋</h1>
        <p className="login-subtitle">Choose your profile to continue</p>
<input
  type="text"
  placeholder="Search profile..."
  className="search-box"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>
        <div className="profile-list">
          {users.length === 0 ? (
            <p className="empty-text">No users found</p>
          ) : (
           users
  .filter(user =>
  user.name &&
  user.name.toLowerCase().includes(search.toLowerCase())
)
  .map((user) => (
              <motion.div
                key={user.id}
                className="profile-card"
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelect(user)}
              >
                <div className="profile-avatar">😎</div>

                <div className="profile-info">
                  <h3>{user.name}</h3>
                  <p>{user.skillsOffered.join(", ")}</p>
                </div>

                <span className="enter-arrow">→</span>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Login;