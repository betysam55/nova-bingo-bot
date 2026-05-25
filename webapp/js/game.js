/* Nova Bingo Mini App — Game Logic */

// Telegram WebApp integration
const tg = window.Telegram && window.Telegram.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

// ─── Game State ────────────────────────────────────────────────
const state = {
  balance: 1000,
  currentRoom: null,
  selectedBoard: null,
  boardNumbers: [],
  markedCells: new Set(),
  calledNumbers: [],
  gameActive: false,
  callerInterval: null,
  countdownInterval: null,
  gameStartTime: null,
};

// ─── Room Definitions ──────────────────────────────────────────
const TIER_ICONS = {
  bronze: "🥉",
  silver: "🥈",
  gold: "🥇",
  diamond: "💎",
};

const ROOMS = [
  {
    id: "bronze",
    name: "Bronze Room",
    bet: 10,
    tier: "bronze",
    players: randomInt(8, 20),
    maxPlayers: 25,
    prize: 0,
  },
  {
    id: "silver",
    name: "Silver Room",
    bet: 25,
    tier: "silver",
    players: randomInt(5, 15),
    maxPlayers: 20,
    prize: 0,
  },
  {
    id: "gold",
    name: "Gold Room",
    bet: 50,
    tier: "gold",
    players: randomInt(3, 12),
    maxPlayers: 15,
    prize: 0,
  },
  {
    id: "diamond",
    name: "Diamond Room",
    bet: 100,
    tier: "diamond",
    players: randomInt(2, 8),
    maxPlayers: 10,
    prize: 0,
  },
];

// Calculate prizes
ROOMS.forEach((r) => {
  r.prize = r.bet * r.players;
});

// ─── Initialization ────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  renderRooms();
  updateWallet();
});

// ─── Screen Management ─────────────────────────────────────────
function showScreen(name) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  const screen = document.getElementById("screen-" + name);
  if (screen) screen.classList.add("active");

  if (name === "lobby") {
    resetGame();
    renderRooms();
    updateWallet();
  }
}

// ─── Lobby ─────────────────────────────────────────────────────
function renderRooms() {
  const list = document.getElementById("room-list");
  list.innerHTML = ROOMS.map(
    (room) => `
    <div class="room-card ${room.tier}" onclick="joinRoom('${room.id}')">
      <div class="room-left">
        <div class="room-tier-icon">${TIER_ICONS[room.tier]}</div>
        <div class="room-info">
          <div class="room-name">${room.name}</div>
          <div class="room-meta">
            <span><span class="live-dot"></span>${room.players} playing</span>
            <span>🏆 ${room.prize} ETB</span>
          </div>
          <div class="room-fill-bar">
            <div class="fill" style="width: ${Math.round((room.players / room.maxPlayers) * 100)}%"></div>
          </div>
        </div>
      </div>
      <div class="room-right">
        <div class="room-bet">${room.bet}<small>ETB / game</small></div>
      </div>
    </div>
  `
  ).join("");
}

function joinRoom(roomId) {
  const room = ROOMS.find((r) => r.id === roomId);
  if (!room) return;

  if (state.balance < room.bet) {
    showToast("💰 Insufficient balance! You need " + room.bet + " ETB");
    return;
  }

  state.currentRoom = room;
  document.getElementById("room-title").textContent = room.name + " — " + room.bet + " ETB";
  generateBoardOptions();
  showScreen("boards");
}

// ─── Board Selection ───────────────────────────────────────────
function generateBoard() {
  const board = [];
  const ranges = [
    [1, 15],
    [16, 30],
    [31, 45],
    [46, 60],
    [61, 75],
  ];

  for (let col = 0; col < 5; col++) {
    const [min, max] = ranges[col];
    const nums = [];
    while (nums.length < 5) {
      const n = randomInt(min, max);
      if (!nums.includes(n)) nums.push(n);
    }
    board.push(nums);
  }
  // Free space at center (row 2, col 2)
  board[2][2] = 0;
  return board;
}

function generateBoardOptions() {
  const container = document.getElementById("board-options");
  const boards = [generateBoard(), generateBoard(), generateBoard(), generateBoard()];
  const headers = ["B", "I", "N", "G", "O"];

  container.innerHTML = boards
    .map(
      (board, idx) => `
    <div class="board-option" data-board-idx="${idx}" onclick="selectBoard(${idx})">
      <div class="mini-headers">
        ${headers.map((h) => `<div class="mini-header-cell">${h}</div>`).join("")}
      </div>
      <div class="mini-grid">
        ${renderMiniGrid(board)}
      </div>
      <div class="board-label">Board ${idx + 1}</div>
    </div>
  `
    )
    .join("");

  // Store boards for later use
  container._boards = boards;
}

function renderMiniGrid(board) {
  let html = "";
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const num = board[col][row];
      if (num === 0) {
        html += '<div class="mini-cell free">★</div>';
      } else {
        html += `<div class="mini-cell">${num}</div>`;
      }
    }
  }
  return html;
}

function selectBoard(idx) {
  const container = document.getElementById("board-options");
  const boards = container._boards;
  if (!boards || !boards[idx]) return;

  // Deduct bet
  state.balance -= state.currentRoom.bet;
  state.selectedBoard = idx;
  state.boardNumbers = boards[idx];
  updateWallet();

  showToast("🎯 Board " + (idx + 1) + " selected! Get ready...");

  setTimeout(() => {
    startCountdown();
  }, 800);
}

// ─── Game Countdown ────────────────────────────────────────────
function startCountdown() {
  showScreen("game");
  renderGameBoard();
  updateGameStats();

  // Mark free space
  state.markedCells.add("2-2");
  updateCellDisplay(2, 2);

  const overlay = document.createElement("div");
  overlay.className = "countdown-overlay";
  overlay.id = "countdown-overlay";
  overlay.innerHTML = `
    <div class="countdown-text">Game Starting In</div>
    <div class="countdown-number" id="countdown-num">5</div>
    <div class="countdown-players">👥 ${state.currentRoom.players} players ready</div>
    <div class="countdown-room-info">${state.currentRoom.name} — ${state.currentRoom.bet} ETB</div>
  `;
  document.body.appendChild(overlay);

  let count = 5;
  const numEl = document.getElementById("countdown-num");

  state.countdownInterval = setInterval(() => {
    count--;
    if (count > 0) {
      numEl.textContent = count;
    } else {
      clearInterval(state.countdownInterval);
      overlay.remove();
      startCalling();
    }
  }, 1000);
}

// ─── Game Board ────────────────────────────────────────────────
function renderGameBoard() {
  const boardEl = document.getElementById("game-board");
  const headers = ["B", "I", "N", "G", "O"];
  const headerClasses = ["h-b", "h-i", "h-n", "h-g", "h-o"];

  let html = headers
    .map((h, i) => `<div class="bingo-header ${headerClasses[i]}">${h}</div>`)
    .join("");

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const num = state.boardNumbers[col][row];
      if (num === 0) {
        html += `<div class="bingo-cell free" data-col="${col}" data-row="${row}">FREE</div>`;
      } else {
        html += `<div class="bingo-cell" data-col="${col}" data-row="${row}" onclick="markCell(${col}, ${row})">${num}</div>`;
      }
    }
  }

  boardEl.innerHTML = html;
}

function markCell(col, row) {
  if (!state.gameActive) return;

  const num = state.boardNumbers[col][row];
  const key = col + "-" + row;

  if (state.markedCells.has(key)) return;

  if (!state.calledNumbers.includes(num)) {
    showToast("⚠️ Number " + num + " hasn't been called yet!");
    const cell = document.querySelector(
      `.bingo-cell[data-col="${col}"][data-row="${row}"]`
    );
    if (cell) {
      cell.classList.add("wrong");
      setTimeout(() => cell.classList.remove("wrong"), 500);
    }
    return;
  }

  state.markedCells.add(key);
  updateCellDisplay(col, row);
  checkBingoReady();
}

function updateCellDisplay(col, row) {
  const cell = document.querySelector(
    `.bingo-cell[data-col="${col}"][data-row="${row}"]`
  );
  if (cell) cell.classList.add("marked");
}

function highlightCalledCell(num) {
  for (let col = 0; col < 5; col++) {
    for (let row = 0; row < 5; row++) {
      if (state.boardNumbers[col][row] === num) {
        const cell = document.querySelector(
          `.bingo-cell[data-col="${col}"][data-row="${row}"]`
        );
        if (cell && !cell.classList.contains("marked")) {
          cell.classList.add("called");
        }
      }
    }
  }
}

// ─── Auto Caller ───────────────────────────────────────────────
function getColumnClass(num) {
  if (num <= 15) return "col-b";
  if (num <= 30) return "col-i";
  if (num <= 45) return "col-n";
  if (num <= 60) return "col-g";
  return "col-o";
}

function startCalling() {
  state.gameActive = true;
  state.gameStartTime = Date.now();
  const available = [];
  for (let i = 1; i <= 75; i++) available.push(i);
  shuffleArray(available);

  let callIdx = 0;
  const statusEl = document.getElementById("game-status");
  statusEl.textContent = "🔢 Numbers are being called...";

  state.callerInterval = setInterval(() => {
    if (callIdx >= available.length || !state.gameActive) {
      clearInterval(state.callerInterval);
      if (state.gameActive) {
        endGame(false);
      }
      return;
    }

    const num = available[callIdx];
    state.calledNumbers.push(num);
    callIdx++;

    // Update ball display
    const ball = document.getElementById("number-ball");
    const currentEl = document.getElementById("current-number");
    currentEl.textContent = num;
    ball.style.animation = "none";
    ball.offsetHeight;
    ball.style.animation = "ballPop 0.5s cubic-bezier(0.16, 1, 0.3, 1)";

    document.getElementById("game-called-count").textContent =
      state.calledNumbers.length;

    // Update strip with color-coded chip
    const strip = document.getElementById("called-numbers-strip");
    strip.querySelectorAll(".called-chip").forEach((c) => c.classList.remove("latest"));
    const chip = document.createElement("div");
    chip.className = "called-chip latest " + getColumnClass(num);
    chip.textContent = num;
    strip.appendChild(chip);
    strip.scrollLeft = strip.scrollWidth;

    highlightCalledCell(num);
    checkBingoReady();

    // Simulate other players potentially winning after many calls
    if (callIdx > 20 && Math.random() < 0.03) {
      endGame(false);
    }
  }, 2000);
}

// ─── Bingo Check ───────────────────────────────────────────────
function checkBingoReady() {
  const hasWin = checkWinPatterns();
  const btn = document.getElementById("bingo-btn");
  btn.disabled = !hasWin;
}

function checkWinPatterns() {
  // Check rows
  for (let row = 0; row < 5; row++) {
    let complete = true;
    for (let col = 0; col < 5; col++) {
      if (!state.markedCells.has(col + "-" + row)) {
        complete = false;
        break;
      }
    }
    if (complete) return true;
  }

  // Check columns
  for (let col = 0; col < 5; col++) {
    let complete = true;
    for (let row = 0; row < 5; row++) {
      if (!state.markedCells.has(col + "-" + row)) {
        complete = false;
        break;
      }
    }
    if (complete) return true;
  }

  // Check diagonals
  let diag1 = true;
  let diag2 = true;
  for (let i = 0; i < 5; i++) {
    if (!state.markedCells.has(i + "-" + i)) diag1 = false;
    if (!state.markedCells.has(i + "-" + (4 - i))) diag2 = false;
  }
  if (diag1 || diag2) return true;

  return false;
}

function callBingo() {
  if (!state.gameActive) return;
  if (!checkWinPatterns()) {
    showToast("❌ Not a valid Bingo pattern!");
    return;
  }

  // Verify all marked numbers were called
  let valid = true;
  state.markedCells.forEach((key) => {
    const [col, row] = key.split("-").map(Number);
    const num = state.boardNumbers[col][row];
    if (num !== 0 && !state.calledNumbers.includes(num)) {
      valid = false;
    }
  });

  if (!valid) {
    showToast("⚠️ Some marked numbers weren't called!");
    return;
  }

  endGame(true);
}

// ─── Game End ──────────────────────────────────────────────────
function endGame(won) {
  state.gameActive = false;
  clearInterval(state.callerInterval);

  const elapsed = state.gameStartTime ? Math.round((Date.now() - state.gameStartTime) / 1000) : 0;
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const timeStr = minutes > 0 ? minutes + "m " + seconds + "s" : seconds + "s";
  const markedCount = state.markedCells.size - 1; // exclude free space

  const resultIcon = document.getElementById("result-icon");
  const resultTitle = document.getElementById("result-title");
  const resultMsg = document.getElementById("result-message");
  const resultPrize = document.getElementById("result-prize");
  const resultStats = document.getElementById("result-stats");

  // Render stats
  resultStats.innerHTML = `
    <div class="result-stat-item">
      <span class="rs-value">${state.calledNumbers.length}</span>
      <span class="rs-label">Called</span>
    </div>
    <div class="result-stat-item">
      <span class="rs-value">${markedCount}</span>
      <span class="rs-label">Marked</span>
    </div>
    <div class="result-stat-item">
      <span class="rs-value">${timeStr}</span>
      <span class="rs-label">Time</span>
    </div>
  `;

  if (won) {
    const prize = state.currentRoom.prize;
    state.balance += prize;

    resultIcon.textContent = "🎉";
    resultTitle.textContent = "BINGO!";
    resultTitle.className = "result-title win";
    resultMsg.textContent =
      "Congratulations! You completed a winning pattern!";
    resultPrize.textContent = "+" + prize + " ETB";
    resultPrize.style.display = "block";

    launchConfetti();

    if (tg) {
      tg.HapticFeedback.notificationOccurred("success");
    }
  } else {
    resultIcon.textContent = "😔";
    resultTitle.textContent = "Game Over";
    resultTitle.className = "result-title lose";
    resultMsg.textContent = "Another player called Bingo first. Better luck next time!";
    resultPrize.style.display = "none";

    if (tg) {
      tg.HapticFeedback.notificationOccurred("error");
    }
  }

  showScreen("result");
}

// ─── Confetti ──────────────────────────────────────────────────
function launchConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ["#f5a623", "#ffc857", "#ff6b6b", "#4facfe", "#00d68f", "#a855f7", "#f472b6"];
  const pieces = [];

  for (let i = 0; i < 120; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: randomInt(6, 12),
      h: randomInt(4, 8),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 8,
      vx: (Math.random() - 0.5) * 4,
      vy: randomInt(2, 6),
      opacity: 1,
    });
  }

  let frame = 0;
  const maxFrames = 180;

  function animate() {
    if (frame >= maxFrames) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const fadeStart = maxFrames * 0.7;

    pieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05;
      p.rotation += p.rotSpeed;
      if (frame > fadeStart) {
        p.opacity = Math.max(0, 1 - (frame - fadeStart) / (maxFrames - fadeStart));
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    frame++;
    requestAnimationFrame(animate);
  }

  animate();
}

// ─── Game Reset ────────────────────────────────────────────────
function resetGame() {
  state.currentRoom = null;
  state.selectedBoard = null;
  state.boardNumbers = [];
  state.markedCells = new Set();
  state.calledNumbers = [];
  state.gameActive = false;
  state.gameStartTime = null;
  clearInterval(state.callerInterval);
  clearInterval(state.countdownInterval);

  const overlay = document.getElementById("countdown-overlay");
  if (overlay) overlay.remove();

  document.getElementById("called-numbers-strip").innerHTML = "";
  document.getElementById("current-number").textContent = "--";
  document.getElementById("game-called-count").textContent = "0";
  document.getElementById("bingo-btn").disabled = true;
  document.getElementById("game-status").textContent = "";
}

// ─── Wallet ────────────────────────────────────────────────────
function updateWallet() {
  document.getElementById("wallet-balance").textContent =
    state.balance.toLocaleString();
}

function updateGameStats() {
  if (!state.currentRoom) return;
  document.getElementById("game-players").textContent = state.currentRoom.players;
  document.getElementById("game-prize").textContent = state.currentRoom.prize;
}

// ─── Utilities ─────────────────────────────────────────────────
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function showToast(message) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}
