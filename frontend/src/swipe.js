import { useEffect, useState } from "react";

function Swipe() {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // fetch users
  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  const swipe = (direction) => {
    console.log(direction, users[currentIndex]);

    setCurrentIndex(prev => prev + 1);
  };

  if (users.length === 0) {
    return <h2>Loading...</h2>;
  }

  if (currentIndex >= users.length) {
    return <h2>No more users 😴</h2>;
  }

  const user = users[currentIndex];

  return (
    <div className="swipe-container">

      <div className="card">
        <h2>{user.name}</h2>

        <p>🎯 Offers: {user.skillsOffered.join(", ")}</p>
        <p>🤝 Wants: {user.skillsWanted.join(", ")}</p>
      </div>

      <div className="buttons">
        <button className="left" onClick={() => swipe("left")}>
          ❌ Skip
        </button>

        <button className="right" onClick={() => swipe("right")}>
          ❤️ Interested
        </button>
      </div>

    </div>
  );
}

export default Swipe;