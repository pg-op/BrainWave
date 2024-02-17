import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const API_KEY = "AIzaSyBLM1JP4E9dN9yKY9sxZg-UASnFXLgZ-EM";
const genAI = new GoogleGenerativeAI(API_KEY);

let aiMessageCounter = 0;

document.getElementById("sendMessage").addEventListener("click", function (event) {
  event.preventDefault();

  const userInput = document.getElementById("userInput").value;

  if (userInput.trim() !== "") {
    appendMessage("User", userInput);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    model.generateContent(userInput).then(result => {
      const responseText = result.response && result.response.text ? result.response.text : "";

      processResponse(result.response);

      aiMessageCounter++;
      if (aiMessageCounter % 2 === 0) {
        appendMessage("HyperMind AI", responseText, true);
      }
    });

    document.getElementById("userInput").value = "";
  }
});

function appendMessage(sender, message, isAI = false) {
  const chatMessages = document.getElementById("chat-messages");
  const transparentLabel = document.getElementById("transparent");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("mb-2");

  if (isAI) {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const formattedMessage = message.replace(boldRegex, "<br><span class='bold-text'>$1</span><br>");

    messageDiv.innerHTML = `<strong class="ai-message">${sender}: </strong>${formattedMessage}`;

    if (transparentLabel && transparentLabel instanceof HTMLLabelElement) {
      transparentLabel.textContent += `${sender}: ${escapeHtml(message)}\n`;
    }
  } else {
    messageDiv.innerHTML = `<strong class="user-message">${sender}: </strong>${escapeHtml(message)}`;
  }

  chatMessages.appendChild(messageDiv);

  // Replace "Gemini" with "HyperMind" and "Google" with "DreamCore"
  document.getElementById("chat-messages").innerHTML = document.getElementById("chat-messages").innerHTML.replace("Gemini", "HyperMind").replace("Google", "DreamCore");
}

// Function to escape HTML entities
function escapeHtml(html) {
  const div = document.createElement("div");
  div.textContent = html;
  return div.innerHTML;
}

const processFirstCandidate = (candidate) => {};

const p = (t) => {
  return `Error message for ${t}`;
};

const extractTextFromCandidate = (candidate) => {
  const parts = candidate.content?.parts;
  if (parts && parts.length > 0 && parts[0].text) {
    return parts[0].text;
  }
  return "";
};

const processResponse = (response) => {
  try {
    if (response && response.candidates && response.candidates.length > 0) {
      if (response.candidates.length > 1) {
        processFirstCandidate(response.candidates[0]);
      }
      const text = extractTextFromCandidate(response.candidates[0]);

      // Use textContent to display HTML tags as plain text
      appendMessage("HyperMind AI", text, true);
    }

    if (response.promptFeedback) {
      throw new CustomError(`Text not available. ${p(response)}`, response);
    }

    return "";
  } catch (error) {
    
  }
};

class CustomError extends Error {
  constructor(message, response) {
    super(message);
    this.name = "CustomError";
    this.response = response;
  }
};
