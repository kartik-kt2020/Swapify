import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setLoggedInUser }) {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  const handleSelect = (user) => {
    setLoggedInUser(user);
    navigate("/swipe");
  };

  return (
    <div className="login-container">
      <h2>Select Your Profile</h2>

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        users.map((user) => (
          <div
            key={user.id}
            className="login-card"
            onClick={() => handleSelect(user)}
          >
            <h3>{user.name}</h3>
            <p>{user.skillsOffered.join(", ")}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Login;