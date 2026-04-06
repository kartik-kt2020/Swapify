import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function ChatPage() {
  const { id1, id2 } = useParams();
  const navigate = useNavigate();
<button onClick={() => navigate("/")}>⬅ Back</button>
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // 🔄 Fetch messages
  const fetchMessages = () => {
    fetch(`http://localhost:5000/getMessages/${id1}/${id2}`)
      .then(res => res.json())
      .then(data => setMessages(data));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // 📤 Send message
  const sendMessage = () => {
    if (!newMessage) return;

    fetch("http://localhost:5000/sendMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fromId: id1,
        toId: id2,
        message: newMessage
      })
    }).then(() => {
      setNewMessage("");
      fetchMessages(); // refresh chat
    });
  };

  return (
    <div className="container">
      <h2>💬 Vibe Check</h2>
      <p>Chat between {id1} & {id2}</p>

      {/* MESSAGES */}
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.fromId == id1 ? "you" : "them"
            }`}
          >
            {msg.message}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type message..."
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatPage;