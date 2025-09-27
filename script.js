let currentUser = "";
let users = JSON.parse(localStorage.getItem("cbtUsers")) || [];

// Switch between register and login
function showLogin() {
  document.getElementById("register").classList.add("hidden");
  document.getElementById("login").classList.remove("hidden");
}
function showRegister() {
  document.getElementById("login").classList.add("hidden");
  document.getElementById("register").classList.remove("hidden");
}

// Register user
function registerUser() {
  let name = document.getElementById("regName").value.trim();
  let pass = document.getElementById("regPass").value;

  if (name === "" || pass === "") {
    alert("Please fill all fields");
    return;
  }

  // Prevent duplicate usernames
  if (users.some(u => u.name === name)) {
    alert("User already exists! Please login.");
    showLogin();
    return;
  }

  users.push({ name, pass });
  localStorage.setItem("cbtUsers", JSON.stringify(users));

  alert("Registration successful! Please login.");
  showLogin();
}

// Login user
function loginUser() {
  let name = document.getElementById("loginName").value.trim();
  let pass = document.getElementById("loginPass").value;

  let user = users.find(u => u.name === name && u.pass === pass);
  if (!user) {
    alert("Invalid credentials!");
    return;
  }

  currentUser = name;
  document.getElementById("login").classList.add("hidden");
  document.getElementById("home").classList.remove("hidden");
  document.getElementById("displayName").innerText = currentUser;
}

// ---------------- QUIZ ----------------
const questions = [
  // BIOLOGY (5)
  { subject: "Biology", q: "Which part of the cell controls activities?", options: ["Nucleus", "Mitochondria", "Cytoplasm", "Ribosome"], answer: "Nucleus" },
  { subject: "Biology", q: "Which blood cells fight against infections?", options: ["Red blood cells", "White blood cells", "Platelets", "Plasma"], answer: "White blood cells" },
  { subject: "Biology", q: "The structural and functional unit of life is?", options: ["Tissue", "Organ", "Cell", "Organism"], answer: "Cell" },
  { subject: "Biology", q: "Which kingdom do mushrooms belong to?", options: ["Plantae", "Animalia", "Fungi", "Protista"], answer: "Fungi" },
  { subject: "Biology", q: "What is the green pigment in plants that helps photosynthesis?", options: ["Chlorophyll", "Hemoglobin", "Xylem", "Carotene"], answer: "Chlorophyll" },

  // PHYSICS (5)
  { subject: "Physics", q: "The unit of force is?", options: ["Newton", "Pascal", "Joule", "Watt"], answer: "Newton" },
  { subject: "Physics", q: "Speed in a given direction is called?", options: ["Velocity", "Acceleration", "Momentum", "Displacement"], answer: "Velocity" },
  { subject: "Physics", q: "The speed of light in vacuum is?", options: ["3 × 10^8 m/s", "1.5 × 10^8 m/s", "3 × 10^6 m/s", "300 m/s"], answer: "3 × 10^8 m/s" },
  { subject: "Physics", q: "Which of these is a renewable source of energy?", options: ["Coal", "Petroleum", "Solar", "Diesel"], answer: "Solar" },
  { subject: "Physics", q: "Work is defined as?", options: ["Force × Distance", "Mass × Acceleration", "Energy × Time", "Power × Time"], answer: "Force × Distance" },

  // CHEMISTRY (5)
  { subject: "Chemistry", q: "What is the atomic number of Oxygen?", options: ["6", "8", "12", "16"], answer: "8" },
  { subject: "Chemistry", q: "Which gas is used in the Haber process?", options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Helium"], answer: "Nitrogen" },
  { subject: "Chemistry", q: "pH value less than 7 indicates?", options: ["Neutral", "Acidic", "Basic", "Salt"], answer: "Acidic" },
  { subject: "Chemistry", q: "The chemical symbol for Sodium is?", options: ["So", "S", "Na", "Sn"], answer: "Na" },
  { subject: "Chemistry", q: "Which element is the lightest?", options: ["Helium", "Oxygen", "Hydrogen", "Neon"], answer: "Hydrogen" },

  // MATHEMATICS (5)
  { subject: "Mathematics", q: "Solve: 2x + 5 = 15. Find x.", options: ["5", "10", "15", "20"], answer: "5" },
  { subject: "Mathematics", q: "The value of π (pi) correct to 2 decimal places is?", options: ["3.12", "3.14", "3.15", "3.20"], answer: "3.14" },
  { subject: "Mathematics", q: "Find the square root of 144.", options: ["10", "11", "12", "13"], answer: "12" },
  { subject: "Mathematics", q: "What is 15% of 200?", options: ["20", "25", "30", "35"], answer: "30" },
  { subject: "Mathematics", q: "Simplify: (2/3) + (4/9).", options: ["10/9", "8/9", "6/9", "12/9"], answer: "10/9" }
];

let currentIndex = 0;
let answers = {};
let timer;

// Start Quiz
function startQuiz() {
  document.getElementById("home").classList.add("hidden");
  document.getElementById("quiz").classList.remove("hidden");
  loadQuestion();
  startTimer(180); // 3 minutes
}

// Load Question
function loadQuestion() {
  let q = questions[currentIndex];
  document.getElementById("progress").innerText = `Question ${currentIndex+1} of ${questions.length}`;
  
  let html = `<h3>${q.q}</h3>`;
  q.options.forEach(opt => {
    let selectedClass = answers[currentIndex] === opt ? "selected" : "";
    html += `<div class="option ${selectedClass}" onclick="selectOption('${opt}')">${opt}</div>`;
  });
  document.getElementById("questionBox").innerHTML = html;
}

// Select Option
function selectOption(choice) {
  answers[currentIndex] = choice;
  loadQuestion(); // refresh highlight
}

// Navigation
function nextQuestion() {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    loadQuestion();
  }
}
function prevQuestion() {
  if (currentIndex > 0) {
    currentIndex--;
    loadQuestion();
  }
}

// Submit Quiz
function submitQuiz() {
  clearInterval(timer);

  let correct = 0;
  let subjectScores = { Biology: 0, Physics: 0, Chemistry: 0, Mathematics: 0 };
  let subjectTotals = { Biology: 0, Physics: 0, Chemistry: 0, Mathematics: 0 };

  questions.forEach((q, i) => {
    subjectTotals[q.subject]++;
    if (answers[i] === q.answer) {
      correct++;
      subjectScores[q.subject]++;
    }
  });

  document.getElementById("quiz").classList.add("hidden");
  document.getElementById("result").classList.remove("hidden");
  document.getElementById("scoreText").innerText = `${currentUser}, you scored ${correct} out of ${questions.length}`;

  let breakdownHtml = "<h3>Subject-wise Performance</h3><ul>";
  for (let subject in subjectTotals) {
    breakdownHtml += `<li><b>${subject}:</b> ${subjectScores[subject]} / ${subjectTotals[subject]}</li>`;
  }
  breakdownHtml += "</ul>";
  document.getElementById("subjectBreakdown").innerHTML = breakdownHtml;
}

// Timer
function startTimer(seconds) {
  let timeLeft = seconds;
  timer = setInterval(() => {
    let min = Math.floor(timeLeft / 60);
    let sec = timeLeft % 60;
    document.getElementById("timer").innerText = `${min}:${sec < 10 ? "0" : ""}${sec}`;
    timeLeft--;
    if (timeLeft < 0) submitQuiz();
  }, 1000);
}
// Submit Quiz
function submitQuiz() {
  clearInterval(timer);

  let correct = 0;
  let subjectScores = { Biology: 0, Physics: 0, Chemistry: 0, Mathematics: 0 };
  let subjectTotals = { Biology: 0, Physics: 0, Chemistry: 0, Mathematics: 0 };

  questions.forEach((q, i) => {
    subjectTotals[q.subject]++;
    if (answers[i] === q.answer) {
      correct++;
      subjectScores[q.subject]++;
    }
  });

  document.getElementById("quiz").classList.add("hidden");
  document.getElementById("result").classList.remove("hidden");
  document.getElementById("scoreText").innerText = `${currentUser}, you scored ${correct} out of ${questions.length}`;

  let breakdownHtml = "<h3>Subject-wise Performance</h3><ul>";
  for (let subject in subjectTotals) {
    breakdownHtml += `<li><b>${subject}:</b> ${subjectScores[subject]} / ${subjectTotals[subject]}</li>`;
  }
  breakdownHtml += "</ul>";
  document.getElementById("subjectBreakdown").innerHTML = breakdownHtml;

  // Save score to leaderboard
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.push({ name: currentUser, score: correct });
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  // Show leaderboard button
  let btn = document.createElement("button");
  btn.innerText = "View Leaderboard";
  btn.onclick = showLeaderboard;
  document.getElementById("result").appendChild(btn);
}

// Show Leaderboard
function showLeaderboard() {
  document.getElementById("result").classList.add("hidden");
  document.getElementById("leaderboard").classList.remove("hidden");

  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.sort((a, b) => b.score - a.score); // Sort high to low

  let tbody = document.getElementById("leaderboardBody");
  tbody.innerHTML = "";

  leaderboard.forEach((entry, index) => {
    let row = `<tr>
      <td>${index + 1}</td>
      <td>${entry.name}</td>
      <td>${entry.score}</td>
    </tr>`;
    tbody.innerHTML += row;
  });
}
