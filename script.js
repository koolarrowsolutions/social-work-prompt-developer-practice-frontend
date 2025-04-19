// script.js

const API_URL = "https://social-work-prompt-developer-practice-backend.vercel.app/api/gpt";

const threadContainer = document.getElementById("conversationThread");

function showTypingIndicator() {
  const typingDiv = document.createElement("div");
  typingDiv.id = "typing";
  typingDiv.innerText = "Response being generated...";
  threadContainer.appendChild(typingDiv);
}

function removeTypingIndicator() {
  const typingDiv = document.getElementById("typing");
  if (typingDiv) typingDiv.remove();
}

function createPromptButton(text, label, onClickHandler) {
  const wrapper = document.createElement("div");
  const lbl = document.createElement("strong");
  lbl.innerText = `${label}:`;
  const btn = document.createElement("button");
  btn.innerText = text;
  btn.className = "option-btn";
  btn.onclick = () => onClickHandler(text, wrapper);
  wrapper.appendChild(lbl);
  wrapper.appendChild(btn);
  return wrapper;
}

async function getPromptVariations() {
  const selected = document.getElementById("useCaseSelect").value;
  if (!selected) return alert("Please select a use case.");

  const prompt = `You're an expert in prompt engineering for social workers. For the topic: "${selected}", generate 3 example prompts a user might input into ChatGPT. Label each as Basic, Moderate, or Advanced based on complexity. Do not ask questions of the user — these are examples the user would ask the AI.`;

  showTypingIndicator();

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ useCase: prompt })
  });

  const data = await res.json();
  removeTypingIndicator();

  const variations = parseLabeledPrompts(data.answer);

  const box = document.getElementById("variationBox");
  const container = document.getElementById("variationOptions");
  container.innerHTML = "";
  box.style.display = "block";

  variations.forEach(({ label, promptText }) => {
    const btn = createPromptButton(promptText, label, handlePromptSelection);
    container.appendChild(btn);
  });

  const customDiv = document.createElement("div");
  customDiv.innerHTML = `
    <strong>Custom Prompt:</strong>
    <textarea id="customFollowUp" placeholder="Type your own prompt..."></textarea>
    <button onclick="sendCustomFollowUp()">Send Custom Prompt</button>
  `;
  container.appendChild(customDiv);
}

function parseLabeledPrompts(text) {
  const regex = /(Basic|Moderate|Advanced)\s*[:\-]?\s*(.*?)(?=(?:\n\s*(?:Basic|Moderate|Advanced)\s*[:\-])|$)/gis;
  const matches = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    matches.push({ label: match[1], promptText: match[2].trim() });
  }
  return matches;
}

function appendThreadItem(role, content) {
  const div = document.createElement("div");
  div.className = role;
  div.innerHTML = `<p><strong>${role === "user" ? "You" : "AI"}:</strong> ${content}</p>`;
  threadContainer.appendChild(div);
}

async function handlePromptSelection(prompt, container) {
  document.querySelectorAll(".option-btn").forEach(b => b.remove());
  container.querySelector("button").classList.add("selected");
  appendThreadItem("user", prompt);
  sendPrompt(prompt);
}

async function sendPrompt(prompt) {
  showTypingIndicator();
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ useCase: prompt })
  });

  const data = await res.json();
  removeTypingIndicator();
  appendThreadItem("ai", data.answer);
  getFollowUpsBasedOnResponse(data.answer);
}

async function sendCustomFollowUp() {
  const followUp = document.getElementById("customFollowUp").value;
  if (!followUp) return alert("Please type your prompt.");
  appendThreadItem("user", followUp);
  sendPrompt(followUp);
}

async function getFollowUpsBasedOnResponse(answerText) {
  const prompt = `You're an expert in prompt engineering for social workers. Based on the following AI response: "${answerText}", provide 3 new example prompts (labeled Basic, Moderate, Advanced) that a user might type into ChatGPT to go deeper or get more specific help. These should be practical prompts a user would type into GPT.`;

  showTypingIndicator();

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ useCase: prompt })
  });

  const data = await res.json();
  removeTypingIndicator();

  const variations = parseLabeledPrompts(data.answer);

  const container = document.createElement("div");
  container.className = "followup-block";
  container.innerHTML = `<h4>Follow-Up Options:</h4>`;

  variations.forEach(({ label, promptText }) => {
    const btn = createPromptButton(promptText, label, handlePromptSelection);
    container.appendChild(btn);
  });

  const customDiv = document.createElement("div");
  customDiv.innerHTML = `
    <strong>Custom Prompt:</strong>
    <textarea id="customFollowUp" placeholder="Type your own follow-up..."></textarea>
    <button onclick="sendCustomFollowUp()">Send Custom Prompt</button>
  `;
  container.appendChild(customDiv);

  threadContainer.appendChild(container);
} 
