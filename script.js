const API_URL = "https://social-work-prompt-developer-practice-backend.vercel.app/api/gpt";

// Step 1: Get GPT-generated prompt variations for selected scenario
async function getPromptVariations() {
  const selected = document.getElementById("useCaseSelect").value;
  if (!selected) return alert("Please select a use case.");

  const variationPrompt = `You are an expert in prompt engineering for AI. A social worker wants to use GPT to get practical help or guidance about: "${selected}". Generate 3 well-structured, effective example prompts that the user might ask GPT to get useful results. These should be direct, informative prompts written in the user's voice — not reflective or introspective questions aimed at the user. Each prompt should be designed to get specific, actionable, or strategic information from the AI.`;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ useCase: variationPrompt })
  });

  const data = await res.json();
  const variations = data.answer.split("\n").filter(v => v.trim()).slice(0, 3);

  document.getElementById("variationBox").style.display = "block";
  const container = document.getElementById("variationOptions");
  container.innerHTML = "";

  variations.forEach(v => {
    const btn = document.createElement("button");
    btn.innerText = v.replace(/^\d+\.\s*/, "");
    btn.className = "option-btn";
    btn.onclick = () => sendPrompt(v);
    container.appendChild(btn);
  });

  document.getElementById("responseBox").style.display = "none";
}

// Step 2: Send selected prompt to GPT for full response
async function sendPrompt(userPrompt) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ useCase: userPrompt })
  });

  const data = await res.json();
  displayResponse(data);
}

// Step 3: Handle user-written follow-up
async function sendCustomFollowUp() {
  const followUp = document.getElementById("customFollowUp").value;
  if (!followUp) return alert("Please type a follow-up question.");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ followUp })
  });

  const data = await res.json();
  displayResponse(data);
}

// Display AI response and follow-up prompt buttons
function displayResponse(data) {
  document.getElementById("responseBox").style.display = "block";
  document.getElementById("response").innerText = data.answer;
  document.getElementById("followUps").innerHTML = "";

  data.options.forEach(option => {
    const btn = document.createElement("button");
    btn.innerText = option;
    btn.onclick = () => sendPrompt(option);
    document.getElementById("followUps").appendChild(btn);
  });
}
