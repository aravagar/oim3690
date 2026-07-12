// Hand-written first: a single askAI helper that sends a prompt to OpenAI's
// Responses API and returns the reply text. Same fetch/await/JSON pattern
// as any other API call, just a POST with an Authorization header.
async function askAI(prompt) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${CLASS_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini", // a small, cheap model is enough for this exercise
      input: prompt,
    }),
  });

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const data = await response.json();

  // The reply text is nested inside an "output" array, not a flat field.
  // Find the message-type output item, then its text content.
  const messageItem = data.output.find((item) => item.type === "message");
  const textPart = messageItem?.content?.find((part) => part.type === "output_text");
  return textPart?.text ?? "(no text in response)";
}

// AI-added: a small chat page wired to askAI above.
const chatLog = document.getElementById("chat-log");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");

function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = `message message-${role}`;
  div.textContent = text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const prompt = chatInput.value.trim();
  if (!prompt) return;

  addMessage("user", prompt);
  chatInput.value = "";
  chatInput.disabled = true;

  try {
    const reply = await askAI(prompt);
    addMessage("ai", reply);
  } catch (error) {
    console.error(error);
    addMessage("ai", "Something went wrong reaching the AI. Try again.");
  } finally {
    chatInput.disabled = false;
    chatInput.focus();
  }
});
