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
};

// ─── Room Definitions ──────────────────────────────────────────
const ROOMS = [
  {
    id: "bronze",
    name: "Bronze Room",
    bet: 10,
    tier: "bronze",
    players: randomInt(8, 20),
    prize: 0,
  },
  {
    id: "silver",
    name: "Silver Room",
    bet: 25,
    tier: "silver",
    players: randomInt(5, 15),
    prize: 0,
  },
  {
    id: "gold",
    name: "Gold Room",
    bet: 50,
    tier: "gold",
    players: randomInt(3, 12),
    prize: 0,
  },
  {
    id: "diamond",
    name: "Diamond Room",
    bet: 100,
    tier: "diamond",
    players: randomInt(2, 8),
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
      <div class="room-info">
        <div class="room-name">${room.name}</div>
        <div class="room-details">
          <span>👥 ${room.players} players</span>
          <span>🏆 ${room.prize} ETB</span>
        </div>
      </div>
      <div class="room-bet">${room.bet}<small> ETB</small></div>
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

  container.innerHTML = boards
    .map(
      (board, idx) => `
    <div class="board-option" data-board-idx="${idx}" onclick="selectBoard(${idx})">
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

  let html = headers.map((h) => `<div class="bingo-header">${h}</div>`).join("");

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
function startCalling() {
  state.gameActive = true;
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

    // Update display
    const currentEl = document.getElementById("current-number");
    currentEl.textContent = num;
    currentEl.style.animation = "none";
    currentEl.offsetHeight; // trigger reflow
    currentEl.style.animation = "pulse 0.5s ease";

    document.getElementById("game-called-count").textContent =
      state.calledNumbers.length;

    // Update strip
    const strip = document.getElementById("called-numbers-strip");
    strip.querySelectorAll(".called-chip").forEach((c) => c.classList.remove("latest"));
    const chip = document.createElement("div");
    chip.className = "called-chip latest";
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

  const resultIcon = document.getElementById("result-icon");
  const resultTitle = document.getElementById("result-title");
  const resultMsg = document.getElementById("result-message");
  const resultPrize = document.getElementById("result-prize");

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

// ─── Game Reset ────────────────────────────────────────────────
function resetGame() {
  state.currentRoom = null;
  state.selectedBoard = null;
  state.boardNumbers = [];
  state.markedCells = new Set();
  state.calledNumbers = [];
  state.gameActive = false;
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
