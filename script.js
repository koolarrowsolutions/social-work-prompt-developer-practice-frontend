const API_URL = "https://social-work-prompt-developer-practice-backend.vercel.app/api/gpt";

// Step 1: Show example prompt options based on dropdown scenario
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

  const container = document.getElementById("variationOptions");
  container.innerHTML = "";
  document.getElementById("variationBox").style.display = "block";
  document.getElementById("responseBox").style.display = "none";

  variations.forEach(v => {
    const prompt = v.replace(/^\d+\.\s*/, "");
    const btn = document.createElement("button");
    btn.innerText = prompt;
    btn.className = "option-btn";
    btn.onclick = () => {
      container.innerHTML = "";
      const selectedBtn = document.createElement("button");
      selectedBtn.className = "option-btn selected";
      selectedBtn.innerText = prompt;
      container.appendChild(selectedBtn);
      sendPrompt(prompt);
    };
    container.appendChild(btn);
  });
}

// Step 2: Send selected prompt to GPT for response
async function sendPrompt(userPrompt) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ useCase: userPrompt })
  });

  const data = await res.json();
  displayResponse(data.answer);
}

// Step 3: Allow user to type their own follow-up
async function sendCustomFollowUp() {
  const followUp = document.getElementById("customFollowUp").value;
  if (!followUp) return alert("Please type a follow-up question.");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ followUp })
  });

  const data = await res.json();
  displayResponse(data.answer);
}

// Step 4: Display response and follow-up prompt suggestions (user-facing prompts)
async function displayResponse(answerText) {
  document.getElementById("responseBox").style.display = "block";
  document.getElementById("response").innerText = answerText;

  const followUpPrompt = `You're an expert in prompt engineering for social work. A GPT model just gave this response: "${answerText}". Generate 3 helpful follow-up prompts a social worker might type into GPT to explore this further, clarify something, or get more detailed help. These should be written as practical prompts a user would input — not reflective questions about the user's experience.`;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ useCase: followUpPrompt })
  });

  const followUps = await res.json();
  const suggestions = followUps.answer.split("\n").filter(v => v.trim()).slice(0, 3);

  const container = document.getElementById("followUps");
  container.innerHTML = "";

  suggestions.forEach(option => {
    const btn = document.createElement("button");
    btn.innerText = option.replace(/^\d+\.\s*/, "");
    btn.onclick = () => sendPrompt(option);
    container.appendChild(btn);
  });
}
