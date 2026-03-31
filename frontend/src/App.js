import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [skillsOffered, setSkillsOffered] = useState("");
  const [skillsWanted, setSkillsWanted] = useState("");
  const [matches, setMatches] = useState({});

  const findMatches = (id) => {
    fetch(`http://localhost:5000/match/${id}`)
      .then(res => res.json())
      .then(data => {
  setMatches(prev => ({
    ...prev,
    [id]: data
  }));
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

  // Add user
  const addUser = () => {
    fetch("http://localhost:5000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        skillsOffered: skillsOffered.split(","),
        skillsWanted: skillsWanted.split(",")
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

  return (
    <div style={{ padding: "20px" }}>
      <Navbar />
      <h1>Swapify 👥</h1>

      {/* FORM */}
      <h2>Add User</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Skills Offered (comma separated)"
        value={skillsOffered}
        onChange={(e) => setSkillsOffered(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Skills Wanted (comma separated)"
        value={skillsWanted}
        onChange={(e) => setSkillsWanted(e.target.value)}
      />
      <br /><br />

      <button onClick={addUser}>Add User</button>
      <button onClick={() => {
        fetch("http://localhost:5000/users", {
          method: "DELETE"
        })
        .then(res => res.json())
        .then(() => {
          fetchUsers(); // refresh users
          setMatches({}); // clear matches
        });
      }} style={{ marginLeft: "10px" }}>
        Clear Users
      </button>

      <hr />

      {/* USERS LIST */}
      <h2>Users</h2>

      {users.length === 0 ? (
        <p>No users yet</p>
      ) : (
       users.map(user => (
  <div key={user.id} style={{ marginBottom: "20px" }}>
    <h3>{user.name}</h3>
    <p>Offers: {user.skillsOffered.join(", ")}</p>
    <p>Wants: {user.skillsWanted.join(", ")}</p>

    <button onClick={() => findMatches(user.id)}>
      Find Matches
    </button>

    {/* MATCH RESULTS */}
    {matches[user.id] && (
      <div style={{ marginTop: "10px", paddingLeft: "10px" }}>
        <h4>Matches:</h4>

        {matches[user.id].length === 0 ? (
          <p>No matches found</p>
        ) : (
          matches[user.id].map(match => (
            <div key={match.id}>
              <p>
                🤝 {match.name} (Offers: {match.skillsOffered.join(", ")})
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
  );
}     
export default App;