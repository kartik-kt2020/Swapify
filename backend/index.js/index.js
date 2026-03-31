const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend updated successfully!");
});

const users = [];
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

    const matches = users.filter(user => {
        if (user.id === userId) return false;

        const canTeach = user.skillsOffered.some(skill =>
            currentUser.skillsWanted.includes(skill)
        );

        const canLearn = user.skillsWanted.some(skill =>
            currentUser.skillsOffered.includes(skill)
        );

        return canTeach && canLearn;
    });

    res.json(matches);
});