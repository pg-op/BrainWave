import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// Replace with your actual API key
const API_KEY = "AIzaSyBLM1JP4E9dN9yKY9sxZg-UASnFXLgZ-EM";

const genAI = new GoogleGenerativeAI(API_KEY);
let chatHistory = []; // Array to store chat messages

document.getElementById("sendMessage").addEventListener("click", sendMessage);

document.getElementById("userInput").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

function sendMessage() {
  const userInput = document.getElementById("userInput").value.trim();

  if (userInput !== "") {
    appendMessage("user", userInput);
    chatHistory.push({ sender: "user", message: userInput }); // Log message

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    model.generateContent(userInput).then(result => {
      const responseText = result.response && result.response.text ? decodeURIComponent(result.response.text) : "";
      appendMessage("ai", responseText);
      chatHistory.push({ sender: "ai", message: responseText }); // Log message
    }).catch(error => {
      console.error("Error generating content:", error);
      appendMessage("error", "Error: Could not communicate with AI");
    });

    document.getElementById("userInput").value = "";
  }
}

function appendMessage(sender, message) {
  const chatHistoryDiv = document.getElementById("chat-history");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);

  messageDiv.innerHTML = message;
  chatHistoryDiv.appendChild(messageDiv);

  // Scroll to the bottom of the chat container
  chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;
}

// Handle potential future logging functionality (not implemented yet)
function logChatHistory() {
  // Implement your logic here to store the chat history (e.g., localStorage, database)
  console.log("Chat history:", chatHistory);
}
