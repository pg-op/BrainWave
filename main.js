import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const API_KEY = "AIzaSyBLM1JP4E9dN9yKY9sxZg-UASnFXLgZ-EM";
const genAI = new GoogleGenerativeAI(API_KEY);

document.getElementById("sendMessage").addEventListener("click", function (event) {
  event.preventDefault();

  const userInput = document.getElementById("userInput").value;

  if (userInput.trim() !== "") {
    // Display user's message
    appendMessage("User", userInput);

    // For text-only input, use the HyperMind model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    model.generateContent(userInput).then(result => {
      const responseText = result.response && result.response.text ? result.response.text : "";
      appendMessage("HyperMind AI", responseText, true);

      // Additional logic for processing the response
      processResponse(result.response);
    });

    // Clear the input field
    document.getElementById("userInput").value = "";
  }
});

function appendMessage(sender, message, isAI = false) {
  const chatMessages = document.getElementById("chat-messages");
  const transparentLabel = document.getElementById("transparent"); // Get the "transparent" label
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("mb-2");

  if (isAI) {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const formattedMessage = message;

    messageDiv.innerHTML = `<strong class="ai-message">${sender}: </strong>${formattedMessage}`;
    
    // Check if the message is coded and append it to the "transparent" label
    if (transparentLabel && transparentLabel instanceof HTMLLabelElement) {
      transparentLabel.textContent += `${sender}: ${message}\n`;
    }
  } else {
    messageDiv.innerHTML = `<strong class="user-message">${sender}: </strong>${message}`;
  }

  chatMessages.appendChild(messageDiv);
}

// Placeholder function for processing the first candidate
const processFirstCandidate = (candidate) => {
  // Your implementation for processing the first candidate
  console.log("Processing the first candidate:", candidate);
};

// Placeholder function for generating an error message
const p = (t) => {
  // Your implementation for generating an error message
  console.log("Generating error message for:", t);
  return `Error message for ${t}`;
};

// Placeholder function for extracting text from a candidate
const extractTextFromCandidate = (candidate) => {
  const parts = candidate.content?.parts;
  if (parts && parts.length > 0 && parts[0].text) {
    return parts[0].text;
  }
  return "";
};

// Placeholder function for processing the response
const processResponse = (response) => {
  try {
    if (response && response.candidates && response.candidates.length > 0) {
      if (response.candidates.length > 1) {
        console.warn(`This response had ${response.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`);
        processFirstCandidate(response.candidates[0]);
      }
      const text = extractTextFromCandidate(response.candidates[0]);
      console.log("Processed text from response:", text);

      // Display the processed text in the chat interface
      appendMessage("HyperMind AI", text, true);
    }

    if (response.promptFeedback) {
      throw new CustomError(`Text not available. ${p(response)}`, response);
    }

    return "";
  } catch (error) {
    console.error(error);
    // Do not throw the error, just log it
  }
};

// Placeholder class for custom errors
class CustomError extends Error {
  constructor(message, response) {
    super(message);
    this.name = "CustomError";
    this.response = response;
  }
};
