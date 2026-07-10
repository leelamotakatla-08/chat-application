const express = require("express");
const mysql = require("mysql2");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "MYSQL@1234",
  database: "chatapp12"
});

db.connect(err => {
  if(err) return console.error("MySQL error:", err);
  console.log("MySQL Connected!");
});

// Get all users
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results)=> {
    if(err) return res.status(500).send(err);
    res.json(results);
  });
});

// Add a new user
app.post("/users", (req, res) => {
  const { name } = req.body;
  db.query("INSERT INTO users (name) VALUES (?)", [name], (err, results) => {
    if(err) return res.status(500).send(err);
    res.json({success:true, id:results.insertId});
  });
});

// Get messages between two users
app.get("/messages/:user1/:user2", (req, res) => {
  const { user1, user2 } = req.params;
  db.query(
    "SELECT * FROM messages WHERE (sender_id=? AND receiver_id=?) OR (sender_id=? AND receiver_id=?) ORDER BY created_at",
    [user1,user2,user2,user1],
    (err, results)=> {
      if(err) return res.status(500).send(err);
      res.json(results);
    }
  );
});

// Send message
app.post("/messages", (req,res) => {
  const { sender_id, receiver_id, message } = req.body;
  db.query("INSERT INTO messages (sender_id, receiver_id, message) VALUES (?,?,?)",
    [sender_id, receiver_id, message],
    (err, results) => {
      if(err) return res.status(500).send(err);
      res.json({success:true,id:results.insertId});
    }
  );
});

// Delete a single message
app.delete("/messages/:id", (req,res) => {
  const { id } = req.params;
  db.query("DELETE FROM messages WHERE id=?", [id], (err) => {
    if(err) return res.status(500).send(err);
    res.json({success:true});
  });
});

// Mark messages as seen
app.post("/messages/seen", (req,res)=>{
  const { sender_id, receiver_id } = req.body;
  db.query("UPDATE messages SET status='seen' WHERE sender_id=? AND receiver_id=? AND status!='seen'",
    [sender_id, receiver_id],
    (err)=> { if(err) return res.status(500).send(err); res.json({success:true}); }
  );
});

// Mute user
app.post("/mute", (req,res)=>{
  const { user_id, muted_user_id, mute_until } = req.body;
  db.query("INSERT INTO mute_settings (user_id, muted_user_id, mute_until) VALUES (?,?,?)",
    [user_id, muted_user_id, mute_until],
    (err)=> { if(err) return res.status(500).send(err); res.json({success:true}); }
  );
});

app.listen(port, ()=> console.log(`Server running at http://localhost:${port}`));