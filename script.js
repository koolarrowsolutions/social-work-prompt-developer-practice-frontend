const API_URL = "https://social-work-prompt-developer-practice-backend.vercel.app/api/gpt";

async function sendPrompt() {
  const useCase = document.getElementById("useCaseSelect").value;
  if (!useCase) return alert("Please select a use case.");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ useCase })
  });

  const data = await res.json();
  displayResponse(data);
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
  displayResponse(data);
}

function displayResponse(data) {
  document.getElementById("responseBox").style.display = "block";
  document.getElementById("response").innerText = data.answer;
  document.getElementById("followUps").innerHTML = "";

  data.options.forEach(option => {
    const btn = document.createElement("button");
    btn.innerText = option;
    btn.onclick = () => sendFollowUp(option);
    document.getElementById("followUps").appendChild(btn);
  });
}

function sendFollowUp(text) {
  document.getElementById("customFollowUp").value = text;
  sendCustomFollowUp();
}
