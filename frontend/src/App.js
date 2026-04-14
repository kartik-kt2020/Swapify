import { Routes, Route, useNavigate } from "react-router-dom";
import ChatPage from "./Chatpage";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import Swipe from "./swipe";
import Login from "./login";
import { motion } from "framer-motion";
import "./components/navbar.css";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [skillsOffered, setSkillsOffered] = useState("");
  const [skillsWanted, setSkillsWanted] = useState("");
  const [matches, setMatches] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUsers, setShowUsers] = useState(false);
const [chatMessages, setChatMessages] = useState([]);
const [newMessage, setNewMessage] = useState("");
const navigate = useNavigate();
const [showModal, setShowModal] = useState(true);
const [loading, setLoading] = useState(false);
const [loggedInUser, setLoggedInUser] = useState(null);
const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
const [cookPopup, setCookPopup] = useState(false);


const findMatches = (id) => {
  console.log("CLICKED:", id);

  setLoadingId(id);

  fetch(`http://localhost:5000/match/${id}`)
    .then(res => {
      console.log("RAW RESPONSE:", res);
      return res.json();
    })
    .then(data => {
      console.log("MATCH DATA:", data);

      setMatches(prev => ({
        ...prev,
        [id]: data
      }));

      setLoadingId(null);
    })
    .catch(err => {
      console.error("ERROR:", err);
    });
};


  // Fetch users
  const fetchUsers = () => {
    fetch("http://localhost:5000/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  };
useEffect(() => {
  const move = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  window.addEventListener("mousemove", move);
  return () => window.removeEventListener("mousemove", move);
}, []);
  useEffect(() => {
    fetchUsers();
  }, []);
useEffect(() => {
  if (!selectedUser) return;

  const interval = setInterval(() => {
    fetch(`http://localhost:5000/getMessages/${selectedUser.id1}/${selectedUser.id2}`)
      .then(res => res.json())
      .then(data => setChatMessages(data));
  }, 2000);

  return () => clearInterval(interval);
}, [selectedUser]);
useEffect(() => {
 if (loading) {
    setTimeout(() => {
      navigate("/swipe");
    }, 1500);
  }
}, [loading]);

  // Add user
  const handleLaunch = () => {
  setShowModal(false); // close popup
    fetch("http://localhost:5000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
       skillsOffered: skillsOffered
  .split(",")
  .map(skill => skill.trim().toLowerCase()),

skillsWanted: skillsWanted
  .split(",")
  .map(skill => skill.trim().toLowerCase())
      })
    })
    .then(res => res.json())
    .then(() => {
      fetchUsers(); // refresh users
      setName("");
      setSkillsOffered("");
      setSkillsWanted("");
      setCookPopup(true);
    });
  };
// 👇 ADD HERE (after addUser, before return)

const openChat = (id1, id2) => {
  setSelectedUser({ id1, id2 });

  fetch(`http://localhost:5000/getMessages/${id1}/${id2}`)
    .then(res => res.json())
    .then(data => setChatMessages(data));
};

const sendMessage = () => {
  fetch("http://localhost:5000/sendMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      fromId: selectedUser.id1,
      toId: selectedUser.id2,
      message: newMessage
    })
  })
  .then(res => res.json())
  .then(() => {
    setNewMessage("");
    openChat(selectedUser.id1, selectedUser.id2);
  });
};
return (
  <>
  {cookPopup && (
  <div className="cook-overlay">
    <div className="cook-box">
      <h2>🍳 WE ARE COOKING</h2>
      <p>WAIT FOR 12 HOURS</p>

      <button onClick={() => setCookPopup(false)}>
        OK
      </button>
    </div>
  </div>
)}
    {showModal && (
  <div className="modal-overlay">
    <div className="modal">

      <h2>🚀 Launch Your Journey</h2>

     <input
  placeholder="Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

<input
  placeholder="Skills Offered"
  value={skillsOffered}
  onChange={(e) => setSkillsOffered(e.target.value)}
/>

<input
  placeholder="Skills Wanted"
  value={skillsWanted}
  onChange={(e) => setSkillsWanted(e.target.value)}
/>

      <button onClick={handleLaunch}>Launch 🚀</button>

    </div>
  </div>
)}

    {/* 🏠 HOME PAGE */}
    {loading && (
  <div className="loading-screen">
  </div>
)}
<Routes>
   <Route path="/swipe" element={<Swipe loggedInUser={loggedInUser} />} />
    <Route path="/login" element={<Login setLoggedInUser={setLoggedInUser} />} />
    <Route path="/" element={

      <div className="container premium-home">
        <div className="orb orb1"></div>
<div className="orb orb2"></div>
        <Navbar />
     <div className="hero-section">
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    <h1 className="hero-title">Swapify</h1>
    <p className="hero-subtitle">Trade Skills. Build Future.</p>
  </motion.div>

  <div className="hero-buttons">
    <button onClick={handleLaunch}>Get Started</button>
  </div>
</div> 

<div className="form-section">
<h2 className="section-title">🚀 Add User</h2>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Skills Offered (comma separated)"
          value={skillsOffered}
          onChange={(e) => setSkillsOffered(e.target.value)}
        />

        <input
          placeholder="Skills Wanted (comma separated)"
          value={skillsWanted}
          onChange={(e) => setSkillsWanted(e.target.value)}
        />

        <button onClick={handleLaunch}>Add User</button>

        <button onClick={() => {
          fetch("http://localhost:5000/users", { method: "DELETE" })
            .then(res => res.json())
            .then(() => {
              fetchUsers();
              setMatches({});
            });
        }}>
          Clear Users
        </button>
</div>
      

        <hr />

        {/* USERS */}
         <button onClick={() => setShowUsers(!showUsers)}>
  {showUsers ? "Hide Community" : "Explore Community"}
</button>
        {showUsers && (

          <>

        <h2 className="section-title">👥 Community</h2>

        {users.length === 0 ? (
          <p>No users yet</p>
        ) : (
           <div className="card-container">
              {users.map(user => (
  <motion.div
  key={user.id}
  className="user-card"
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
             <div className="user-header">
  <div className="avatar">😎</div>
  <h3>{user.name}</h3>
</div>

<div className="tags">
  {user.skillsOffered.map((skill, i) => (
    <span key={i} className="tag offer">{skill}</span>
  ))}
</div>

<div className="tags">
  {user.skillsWanted.map((skill, i) => (
    <span key={i} className="tag want">{skill}</span>
  ))}
</div>

<button onClick={() => findMatches(user.id)}>
  {loadingId === user.id ? "Finding..." : "Find Matches"}
</button>

             {matches[user.id] !== undefined && (
                <div>
                  <h4>Matches:</h4>

                  {matches[user.id].length === 0 ? (
                    <p>No matches found</p>
                  ) : (
                    matches[user.id].map(match => (
                      <div key={match.id}>
                      

                       <p>
  🤝 {match.name}
  <span className="score">⭐ {match.score}</span>
</p>
  <button onClick={() => navigate(`/chat/${user.id}/${match.id}`)}>
                          🔥 Vibe Check
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </motion.div>
              ))}
            </div>
        )}
          </>
        )}
      </div>
    } />
    {/* 💬 CHAT PAGE */}
    <Route path="/chat/:id1/:id2" element={<ChatPage />} />
    </Routes>
</>
);
}
export default App;
<footer className="footer">
  Built with ⚡ by Kartik | Swapify 2026
</footer>