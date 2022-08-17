const resultDisplay = document.getElementById("result");
const scoreDisplay = document.getElementById("score");
const bestScoreDisplay = document.getElementById("bestScore");
const startGame = document.getElementById("buttonNewGame");
let bestScore = 0;
let score = +localStorage.getItem("score");
const bestValue = +localStorage.getItem("bestScore");
bestScoreDisplay.innerText = bestValue;
scoreDisplay.innerText = score;
let stringNumbers = localStorage.getItem("continueGame");
let numbers = stringNumbers ? JSON.parse(stringNumbers) : [];

let debounceTimer = undefined;
const eventsToLock = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
]);
const debounceTime = 200;

document.addEventListener("keydown", function (event) {
  if (eventsToLock.has(event.code)) {
    if (debounceTimer) return;
    debounceTimer = setTimeout(() => {
      clearTimeout(debounceTimer);
      debounceTimer = undefined;
    }, debounceTime);
  }

  if (event.code == "ArrowUp") {
    handleUp();
  }
  if (event.code == "ArrowDown") {
    handleDown();
  }
  if (event.code == "ArrowLeft") {
    handleLeft();
  }
  if (event.code == "ArrowRight") {
    handleRight();
  }
});


function handleRight() {
  let oldArr = numbers.slice(0);

  moveSlideRight();
  moveSlideRight();
  moveRight();
  moveSlideRight();
  checkForWin();
  checkGameOver();
  if (equalArrays(oldArr, numbers)) {
    creatTwo();
  }
  putArrDiv();
  checkGameOver();
}

function handleLeft() {
  let oldArr = numbers.slice(0);
  moveSlideLeft();
  moveSlideLeft();
  moveLeft();
  moveSlideLeft();
  checkForWin();
  checkGameOver();
  if (equalArrays(oldArr, numbers)) {
    creatTwo();
  }
  putArrDiv();
  checkGameOver();
}

function handleUp() {
  let oldArr = numbers.slice(0);
  moveSlideUp();
  moveSlideUp();
  moveUp();
  moveSlideUp();
  checkForWin();
  checkGameOver();
  if (equalArrays(oldArr, numbers)) {
    creatTwo();
  }
  putArrDiv();
  checkGameOver();
}

function handleDown() {
  let oldArr = numbers.slice(0);
  moveSlideDown();
  moveSlideDown();
  moveDown();
  moveSlideDown();
  checkForWin();
  checkGameOver();
  if (equalArrays(oldArr, numbers)) {
    creatTwo();
  }
  putArrDiv();
  checkGameOver();
}

function moveRight() {
  for (let i = 15; i > 0; i--) {
    if (numbers[i] == numbers[i - 1] || numbers[i - 1] == 0) {
      if (i == 0 || i == 4 || i == 8 || i == 12) {
        continue;
      }
      countScore(numbers[i], numbers[i - 1]);
      numbers[i] = numbers[i - 1] + numbers[i];
      numbers[i - 1] = 0;
    }
  }
}

function moveLeft() {
  for (let i = 0; i < 15; i++) {
    if (numbers[i] == numbers[i + 1] || numbers[i + 1] == 0) {
      if (i == 3 || i == 7 || i == 11 || i == 15) {
        continue;
      }
      countScore(numbers[i], numbers[i + 1]);
      numbers[i] = numbers[i + 1] + numbers[i];
      numbers[i + 1] = 0;
    }
  }
}

function moveUp() {
  for (let i = 0; i < 12; i++) {
    if (numbers[i] == numbers[i + 4] || numbers[i + 4] == 0) {
      if (numbers[i] == numbers[i + 4]) {
        countScore(numbers[i], numbers[i + 4]);
      }
      numbers[i] = numbers[i + 4] + numbers[i];
      numbers[i + 4] = 0;
    }
  }
}

function moveDown() {
  for (let i = 15; i > 3; i--) {
    if (numbers[i] == numbers[i - 4] || numbers[i - 4] == 0) {
      if (numbers[i] == numbers[i - 4]) {
        countScore(numbers[i], numbers[i - 4]);
      }
      numbers[i] = numbers[i - 4] + numbers[i];
      numbers[i - 4] = 0;
    }
  }
}

function moveSlideRight() {
  for (let i = 1; i < 16; i++) {
    if (i == 4 || i == 8 || i == 12) {
      continue;
    }
    if (numbers[i] === 0) {
      numbers[i] = numbers[i - 1];
      numbers[i - 1] = 0;
    }
  }
  checkForWin();
}

function moveSlideLeft() {
  for (let i = 15; i > 0; i--) {
    if (i == 4 || i == 8 || i == 12) {
      continue;
    }
    if (numbers[i - 1] === 0) {
      numbers[i - 1] = numbers[i];
      numbers[i] = 0;
    }
  }

  checkForWin();
}

function moveSlideDown() {
  for (let i = 0; i < 12; i++) {
    if (numbers[i + 4] === 0) {
      numbers[i + 4] = numbers[i];
      numbers[i] = 0;
    }
  }
  checkForWin();
}

function moveSlideUp() {
  for (let i = 15; i > 3; i--) {
    if (i == 0 || i == 1 || i == 2 || i == 3) {
      continue;
    }
    if (numbers[i - 4] === 0) {
      numbers[i - 4] = numbers[i];
      numbers[i] = 0;
    }
  }

  checkForWin();
}

function start(arr) {
  numbers = arr;
  const previousBoard = document.getElementById("board");
  if (previousBoard) {
    previousBoard.remove();
  }
  let board = document.createElement("div"); //почитать
  board.classList.add("board");
  board.id = "board";
  document.body.appendChild(board);
  for (let i = 0; i < 16; i++) {
    if (!arr[i]) {
      arr[i] = 0;
    }
    let tile = document.createElement("div");
    tile.classList.add("tile");
    tile.id = i;
    tile.innerText = arr[i] || 0;
    recolor(tile, arr[i]);
    board.appendChild(tile);
  }
  const summ = arr.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    0
  );
  if (!summ) {
    creatTwo();
    creatTwo();
  }
}
function preStart() {
  localStorage.removeItem("continueGame");
  localStorage.removeItem("score");
  score = 0;
  scoreDisplay.innerText = score;

  start([]);
}
startGame.onclick = preStart;
start(numbers);


function creatTwo() {
  let rounded;
  let random = Math.random();
  let twoOrFour = random > 0.8 ? 4 : 2;
  do {
    rounded = Math.floor(Math.random() * 16);
  } while (numbers[rounded] !== 0);
  numbers[rounded] = twoOrFour;
  const target = document.getElementById(rounded.toString());
  target.innerText = twoOrFour;
  recolor(target, twoOrFour);
  localStorage.setItem("continueGame", JSON.stringify(numbers));
  localStorage.setItem("score", JSON.stringify(score));
}
function countScore(current, next) {
  if (current == next) {
    score = score + (next + current);
    scoreDisplay.innerText = score;
    if (score > bestScoreDisplay.innerText) {
      bestScoreDisplay.innerText = score;
      localStorage.setItem("bestScore", score);
    }
  }
}

function putArrDiv() {
  for (let i = 0; i < 16; i++) {
    const el = document.getElementById(i);

    el.innerText = numbers[i];
    recolor(el, numbers[i]);
  }
}

function checkForWin() {
  for (let i = 0; i < 16; i++) {
    if (numbers[i] == 2048) {
      resultDisplay.innerHTML = "You Win!";
    }
  }
}

function checkGameOver() {
  let zero = 0;
  let counter = 0;
  for (let i = 0; i < 15; i++) {
    if (numbers[i] === 0) {
      zero++;
      break;
    }
    if (i != 3 && i != 7 && i != 11 && i !== 12 && i !== 13 && i !== 14) {
      if (numbers[i] === numbers[i + 1] || numbers[i] === numbers[i + 4]) {
        counter++;
        break;
      }
    } else if (i == 3 && i == 7 && i == 11) {
      if (numbers[i] == numbers[i + 4]) {
        counter++;
        break;
      }
    } else if (i == 12 && i == 13 && i == 14) {
      if (numbers[i] == numbers[i + 1]) {
        counter++;
        break;
      }
    }
  }
  if (zero === 0 && counter == 0) {
    resultDisplay.innerHTML = "You're Loser!";
    document.removeEventListener("keydown", function (event) {
      if (eventsToLock.has(event.code)) {
        if (debounceTimer) return;
        debounceTimer = setTimeout(() => {
          clearTimeout(debounceTimer);
          debounceTimer = undefined;
        }, debounceTime);
      }

      if (event.code == "ArrowUp") {
        handleUp();
      }
      if (event.code == "ArrowDown") {
        handleDown();
      }
      if (event.code == "ArrowLeft") {
        handleLeft();
      }
      if (event.code == "ArrowRight") {
        handleRight();
      }
    });
  }
}

function equalArrays(a, b) {
  for (let i = 0; i < 16; i++) if (a[i] !== b[i]) return true;
  return false;
}

function recolor(tile, index) {
  if (index === 0) {
    tile.style.color = "blueviolet";
  }
  if (index === 2) {
    tile.style.color = "red";
  }
  if (index === 4) {
    tile.style.color = "orange";
  }
  if (index === 8) {
    tile.style.color = "yellow";
  }
  if (index === 16) {
    tile.style.color = "green";
  }
  if (index === 32) {
    tile.style.color = "blue";
  }
  if (index === 64) {
    tile.style.color = "indigo";
  }
  if (index === 128) {
    tile.style.color = "violet";
  }
  if (index === 256) {
    tile.style.color = "gray";
  }
  if (index === 512) {
    tile.style.color = "white";
  }
  if (index === 1024) {
    tile.style.color = "silver";
  }
  if (index === 2048) {
    tile.style.color = "azure";
  }
}
