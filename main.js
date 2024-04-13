import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const API_KEY = "AIzaSyBLM1JP4E9dN9yKY9sxZg-UASnFXLgZ-EM";
const genAI = new GoogleGenerativeAI(API_KEY);

let aiMessageCounter = 1;

document.getElementById("sendMessage").addEventListener("click", sendMessage);

document.getElementById("userInput").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

function sendMessage() {
  const userInput = document.getElementById("userInput").value;

  if (userInput.trim() !== "") {
    appendMessage("User", userInput);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    model.generateContent(userInput).then(result => {
      const responseText = result.response && result.response.text ? decodeURIComponent(result.response.text) : "";

      try {
        processResponse(responseText);

        aiMessageCounter++;
        if (aiMessageCounter % 2 === 0) {
          appendMessage("HyperMind AI", responseText, true);
        }
      } catch (error) {
        console.error("Error processing response:", error);
      }
    }).catch(error => {
      console.error("Error generating content:", error);
    });

    document.getElementById("userInput").value = "";
  }
}

function appendMessage(sender, message, isAI = false) {
  const chatMessages = document.getElementById("chat-messages");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("mb-2");

  if (isAI) {
    messageDiv.innerHTML = `<strong class="ai-message">${sender}: </strong>${message}`;
  } else {
    messageDiv.innerHTML = `<strong class="user-message">${sender}: </strong>${message}`;
  }

  chatMessages.appendChild(messageDiv);

  // Scroll to the bottom of the chat container
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

const processResponse = (response) => {
  try {
    if (response && response.candidates && response.candidates.length > 0) {
      const text = response.candidates[0].content.parts[0].text;
      const decodedText = decodeURIComponent(text);
      appendMessage("HyperMind AI", decodedText, true);
    }

    if (response.promptFeedback) {
      throw new CustomError(`Text not available. ${p(response)}`, response);
    }
  } catch (error) {
    // Display error message in the chat interface
    appendMessage("System", `Error processing response: ${error.message}`, true);
    console.error("Error processing response:", error);
  }
};


const extractTextFromCandidate = (candidate) => {
  const parts = candidate.content?.parts;
  if (parts && parts.length > 0 && parts[0].text) {
    return parts[0].text;
  }
  return "";
};

class CustomError extends Error {
  constructor(message, response) {
    super(message);
    this.name = "CustomError";
    this.response = response;
  }
};
