import { Routes, Route, useNavigate } from "react-router-dom";
import ChatPage from "./Chatpage";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [skillsOffered, setSkillsOffered] = useState("");
  const [skillsWanted, setSkillsWanted] = useState("");
  const [matches, setMatches] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
const [chatMessages, setChatMessages] = useState([]);
const [newMessage, setNewMessage] = useState("");
const navigate = useNavigate();

 const findMatches = (id) => {
  setLoadingId(id);

  fetch(`http://localhost:5000/match/${id}`)
    .then(res => res.json())
    .then(data => {
      setTimeout(() => {   // 👈 ADD THIS
        setMatches(prev => ({
          ...prev,
          [id]: data
        }));
        setLoadingId(null);
      }, 1000); // 1 second delay
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

  // Add user
  const addUser = () => {
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
  <Routes>

    {/* 🏠 HOME PAGE */}
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

        <button onClick={addUser}>Add User</button>

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
        <h2>Users</h2>

        {users.length === 0 ? (
          <p>No users yet</p>
        ) : (
          users.map(user => (
            <div key={user.id}>
              <h3>{user.name}</h3>
              <p>Offers: {user.skillsOffered.join(", ")}</p>
              <p>Wants: {user.skillsWanted.join(", ")}</p>

              <button onClick={() => findMatches(user.id)}>
                {loadingId === user.id ? "Finding..." : "Find Matches"}
              </button>

              {matches[user.id] && (
                <div>
                  <h4>Matches:</h4>

                  {matches[user.id].length === 0 ? (
                    <p>No matches found</p>
                  ) : (
                    matches[user.id].map(match => (
                      <div key={match.id}>
                        <button onClick={() => navigate(`/chat/${user.id}/${match.id}`)}>
                          🔥 Vibe Check
                        </button>

                        <p>
                          🤝 {match.name} <br />
                          ⭐ Score: {match.score}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))
        )}

      </div>

    } />

    {/* 💬 CHAT PAGE */}
    <Route path="/chat/:id1/:id2" element={<ChatPage />} />

  </Routes>
);
}
export default App;