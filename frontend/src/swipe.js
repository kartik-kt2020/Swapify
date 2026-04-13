import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Swipe() {
  const [users, setUsers] = useState([]);
  const [index, setIndex] = useState(0);
  const [swipeText, setSwipeText] = useState("");
  const navigate = useNavigate();
  const [likedUsers, setLikedUsers] = useState([]);
  const [matchUser, setMatchUser] = useState(null);
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

 const handleSwipe = (direction) => {
  const user = users[index];
  setActiveUser(user); // ⭐ STORE CURRENT USER

  if (direction === "right") {
    setLikedUsers((prev) => [...prev, user]);
    console.log("LIKED:", user);

 // 🔥 CHECK MATCH FROM BACKEND
    fetch(`http://localhost:5000/match/${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          console.log("MATCH FOUND:", data[0]);
          setMatchUser(data[0]); // 🎯 store match
        }
      });
        } else {
    console.log("SKIPPED:", user);
  }
  setIndex((prev) => prev + 1);
};

  if (users.length === 0) return <h2>Loading...</h2>;

  const currentUser = users[index];
const nextUser = users[index + 1];

 return (
  <>
  {matchUser && (
  <div className="match-popup">
    <h2>🎉 It's a Match!</h2>

    <p>You matched with {matchUser.name}</p>

    <button
      onClick={() =>
      navigate(`/chat/${activeUser.id}/${matchUser.id}`)
      }
    >
      💬 Start Chat
    </button>

    <button onClick={() => setMatchUser(null)}>
      ❌ Close
    </button>
  </div>
)}
  <div className="swipe-container">
    
    {/* ❤️ ALWAYS VISIBLE */}
    <div className="liked-section">
      <h3>❤️ Liked Users</h3>

      {likedUsers.length === 0 ? (
        <p>No likes yet</p>
      ) : (
        likedUsers.map((u, i) => (
          <p key={i}>{u.name}</p>
        ))
      )}
    </div>

    {index < users.length ? (
      <>
        {/* 👇 NEXT CARD */}
        {nextUser && (
          <div className="card next">
            <h2>{nextUser.name}</h2>
            <p>{nextUser.skillsOffered.join(", ")}</p>
          </div>
        )}

        {/* 👇 CURRENT CARD */}
        <motion.div
          className="card"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}

          onDrag={(e, info) => {
            if (info.offset.x > 50) setSwipeText("LIKE ❤️");
            else if (info.offset.x < -50) setSwipeText("NOPE ❌");
            else setSwipeText("");
          }}

          onDragEnd={(e, info) => {
            if (info.offset.x > 100) handleSwipe("right");
            else if (info.offset.x < -100) handleSwipe("left");

            setSwipeText("");
          }}
        >
          {swipeText && <h2 className="swipe-text">{swipeText}</h2>}

          <h2>{currentUser.name}</h2>
          <p>🎯 {currentUser.skillsOffered.join(", ")}</p>
          <p>🤝 {currentUser.skillsWanted.join(", ")}</p>
        </motion.div>
      </>
    ) : (
      <div className="no-users">
        <h2>No more users 😴</h2>

        <button onClick={() => navigate("/")}>
          ⬅ Head Back
        </button>
      </div>
    )}

  </div>
  </>
);
}

export default Swipe;