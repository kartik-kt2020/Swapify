const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend updated successfully!");
});

const users = [];
const chats = {}; // 👈 ADD HERE
app.get("/users", (req, res) => {
    res.json(users);
});
app.post("/users", (req, res) => {
    const newUser = {
        id: users.length + 1,
        name: req.body.name,
        skillsOffered: req.body.skillsOffered,
        skillsWanted: req.body.skillsWanted
    };

    users.push(newUser);

    res.json({
        message: "User added successfully 🚀",
        user: newUser
    });
});
app.delete("/users", (req, res) => {
    users.length = 0; // clear array

    res.json({
        message: "All users deleted 🗑️"
    });
});
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
app.get("/match/:id", (req, res) => {
    const userId = parseInt(req.params.id);

    const currentUser = users.find(user => user.id === userId);

    if (!currentUser) {
        return res.json({ message: "User not found" });
    }

   const matches = users
  .filter(user => {
    if (user.id === currentUser.id) return false;

    const theyOffer = user.skillsOffered.filter(skill =>
      currentUser.skillsWanted.includes(skill)
    );

    const iOffer = currentUser.skillsOffered.filter(skill =>
      user.skillsWanted.includes(skill)
    );

    return theyOffer.length > 0 && iOffer.length > 0;
  })
  .map(user => {
    const score =
      user.skillsOffered.filter(skill =>
        currentUser.skillsWanted.includes(skill)
      ).length +
      currentUser.skillsOffered.filter(skill =>
        user.skillsWanted.includes(skill)
      ).length;

    return { ...user, score };
  })
  .sort((a, b) => b.score - a.score);

    res.json(matches);
});