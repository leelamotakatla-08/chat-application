const socket = io();

function sendMessage() {
  const message = document.getElementById("messageInput").value;

  socket.emit("sendMessage", {
    sender: 1,
    receiver: 2,
    message: message
  });

  document.getElementById("messageInput").value = "";
}

socket.on("receiveMessage", (data) => {
  const msgDiv = document.createElement("div");
  msgDiv.innerHTML = data.message + " ✓✓";
  document.getElementById("messages").appendChild(msgDiv);
});

function callUser() {
  alert("Calling...");
}

function muteChat() {
  let option = prompt("Mute: 1) 8 hours 2) 1 week 3) Always");
  alert("Muted!");
}

function deleteChat() {
  document.getElementById("messages").innerHTML = "";
}
// Fetch and display users
function loadUsers() {
  fetch("/users")
    .then(res => res.json())
    .then(users => {
      const usersDiv = document.getElementById("users");
      usersDiv.innerHTML = ""; // Clear any existing content

      users.forEach(user => {
        const userDiv = document.createElement("div");
        userDiv.className = "user";
        userDiv.innerText = `${user.name} (${user.phone})`;
        usersDiv.appendChild(userDiv);
      });
    })
    .catch(err => console.error(err));
}
function logout(){
localStorage.clear();
window.location="login.html";
}

function checkAuth(){
const userId=localStorage.getItem("userId");
if(!userId){
window.location="login.html";
}
}
// Call this when the page loads
window.onload = loadUsers;