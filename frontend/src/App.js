import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import ChatPage from "./Chatpage";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import Swipe from "./swipe";

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
  setLoading(true);    // go to loading screen
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
    <Route path="/swipe" element={<Swipe />} />
    <Route path="/" element={

      <div className="container">
        <Navbar />
        <h1>Swapify 👥</h1>

        {/* FORM */}
        <h2>🚀 Add User</h2>

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

        <hr />

        {/* USERS */}
         <button onClick={() => setShowUsers(!showUsers)}>
  {showUsers ? "Hide Users" : "Show Users"}
</button>
        {showUsers && (

          <>

        <h2>Users</h2>

        {users.length === 0 ? (
          <p>No users yet</p>
        ) : (
           <div className="card-container">
              {users.map(user => (
  <div key={user.id} className="user-card">
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
            </div>
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