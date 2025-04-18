const API_URL = "https://social-work-prompt-developer-practice-backend.vercel.app/api/gpt";

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

async function sendPrompt(userPrompt) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ useCase: userPrompt })
  });

  const data = await res.json();
  displayResponse(data.answer);
}

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

async function displayResponse(answerText) {
  document.getElementById("responseBox").style.display = "block";
  document.getElementById("response").innerText = answerText;

  const followUpPrompt = `Based on this AI response: "${answerText}", generate 3 follow-up prompts a social worker might ask GPT to go deeper or expand their understanding.`;

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
