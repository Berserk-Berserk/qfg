const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let posts = [];

app.get("/posts", (req, res) => res.json(posts));

app.post("/posts", (req, res) => {
  const post = req.body;
  posts.push(post);
  res.json(post);
});

app.put("/posts/:id", (req, res) => {
  const { id } = req.params;
  const index = posts.findIndex(p => p.id === id);
  if (index !== -1) {
    posts[index] = req.body;
    res.json(posts[index]);
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

app.delete("/posts/:id", (req, res) => {
  const { id } = req.params;
  posts = posts.filter(p => p.id !== id);
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
