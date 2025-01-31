function createPlayer(name, mark) {
  const playerName = name;
  const playerMark = mark;

  const getName = () => playerName;
  const getMark = () => playerMark;

  return { getName, getMark };
}

const gameboard = (function () {
  let board;

  const fillBoard = () => {
    board = Array(3)
      .fill(null)
      .map(() => Array(3).fill(null));
  };

  const calculatePosition = (position) => {
    return [Math.floor((position - 1) / 3), (position - 1) % 3];
  };

  const setPosition = (position, newValue) => {
    const [row, column] = calculatePosition(position);

    board[row][column] = newValue;
  };

  const getBoard = () => board;

  return { setPosition, getBoard, fillBoard };
})();

const game = (function () {
  let playerOne;
  let playerTwo;
  let currentPlayer;
  let turns;
  let thereIsAWinner;

  const start = () => {
    gameboard.fillBoard();
    thereIsAWinner = false;

    if (!(playerOne && playerTwo)) {
      const playerOneName = document.querySelector("#playerOneName").value;
      const playerTwoName = document.querySelector("#playerTwoName").value;

      if (!playerOneName || !playerTwoName) {
        alert("The players' names must not be empty...");
        return;
      }

      playerOne = createPlayer(playerOneName, "X");
      playerTwo = createPlayer(playerTwoName, "O");

      gameStartForm.close();
    }

    currentPlayer = Math.random() < 0.5 ? playerOne : playerTwo;
    turns = 9;

    const board = document.querySelector(".board");
    const currentTurnParagraph = document.querySelector(".currentTurn");

    board.innerHTML = "";

    for (let i = 1; i <= 9; i++) {
      const square = document.createElement("div");

      square.setAttribute("data-position", i);

      square.addEventListener("click", () => {
        if (!thereIsAWinner && square.textContent === "") {
          square.textContent = currentPlayer.getMark();

          gameboard.setPosition(
            square.dataset.position,
            currentPlayer.getMark(),
          );

          turns--;

          checkGameOver();

          if (thereIsAWinner) {
            currentTurnParagraph.textContent = "";
          } else {
            if (currentPlayer === playerOne) {
              currentPlayer = playerTwo;
            } else {
              currentPlayer = playerOne;
            }

            currentTurnParagraph.textContent = `${currentPlayer.getName()}'s turn (${currentPlayer.getMark()})`;
          }
        }
      });

      board.appendChild(square);
    }

    currentTurnParagraph.textContent = `${currentPlayer.getName()}'s turn (${currentPlayer.getMark()})`;
  };

  const checkGameOver = () => {
    const boardArray = gameboard.getBoard();

    // horizontal lines
    for (const row of boardArray) {
      if (row[0] !== null && row[0] === row[1] && row[1] === row[2]) {
        gameOver(currentPlayer);
        return;
      }
    }

    // vertical lines
    for (let i = 0; i <= 2; i++) {
      if (
        boardArray[0][i] !== null &&
        boardArray[0][i] === boardArray[1][i] &&
        boardArray[1][i] === boardArray[2][i]
      ) {
        gameOver(currentPlayer);
        return;
      }
    }

    // diagonal lines
    if (
      (boardArray[0][0] !== null &&
        boardArray[0][0] === boardArray[1][1] &&
        boardArray[1][1] === boardArray[2][2]) ||
      (boardArray[0][2] !== null &&
        boardArray[0][2] === boardArray[1][1] &&
        boardArray[1][1] === boardArray[2][0])
    ) {
      gameOver(currentPlayer);
      return;
    }

    // tie
    if (turns === 0) {
      gameOver();
    }
  };

  const gameOver = (winner = null) => {
    thereIsAWinner = true;

    const gameEndDialog = document.querySelector(".gameEnd");
    const resultsParagraph = document.querySelector(".results");
    const restartButton = document.querySelector(".restartButton");

    if (winner === null) {
      resultsParagraph.textContent = `It's a tie!`;
    } else {
      resultsParagraph.textContent = `${winner.getName()} is the winner!`;
    }

    restartButton.addEventListener("click", (event) => {
      event.preventDefault();

      game.start();
      gameEndDialog.close();
    });

    gameEndDialog.showModal();
  };

  return { start };
})();

const gameStartForm = document.querySelector(".gameStartForm");
const playButton = document.querySelector(".playButton");

playButton.addEventListener("click", (event) => {
  event.preventDefault();

  game.start();
});

gameStartForm.showModal();
