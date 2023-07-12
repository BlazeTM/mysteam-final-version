const gameBoard = document.querySelector("#gameboard");
const infoDisplay = document.querySelector("#info");
const scoreTableBody = document.querySelector("#scoreTableBody");
var wynik;
var game_id=1;
const startCells = [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
];

var go = "koło";
infoDisplay.textContent = "Teraz gra koło";

function createBoard() {
  startCells.forEach((_cell, index) => {
    const cellElement = document.createElement("div");
    cellElement.classList.add("square");
    cellElement.id = index;
    cellElement.addEventListener("click", whose_turn);
    gameBoard.append(cellElement);
  });
}

createBoard();

function whose_turn(e) {
  const goDisplay = document.createElement("div");
  goDisplay.classList.add(go);
  e.target.append(goDisplay);
  go = go == "koło" ? "krzyżyk" : "koło";
  infoDisplay.textContent = "Teraz gra " + go + "!";
  e.target.removeEventListener("click", whose_turn);
  checkScore();
}

function checkScore() {
  const allSquares = document.querySelectorAll(".square");
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  let isFilled = true;

  winningCombos.forEach(array => {
    const circleWins = array.every(
      cell => allSquares[cell].firstChild?.classList.contains("koło")
    );

    const crossWins = array.every(
      cell => allSquares[cell].firstChild?.classList.contains("krzyżyk")
    );

    if (circleWins) {
      infoDisplay.textContent = "Koło wygrywa!";
      allSquares.forEach(square => square.removeEventListener('click', whose_turn));
      isFilled = false;
      wynik=200;
      insertToDatabase();
      return;
}
if (crossWins) {
infoDisplay.textContent = "Krzyżyk wygrywa!";
wynik=100;

allSquares.forEach(square => square.removeEventListener('click', whose_turn));
isFilled = false;

insertToDatabase();
return;
}
array.forEach(cell => {
if (!allSquares[cell].firstChild) {
isFilled = false;
}
});
});

if (isFilled) {
infoDisplay.textContent = "Remis";
wynik=50;
insertToDatabase();

}

const restartButton = document.getElementById("restartButton");
restartButton.addEventListener("click", restartGame);
}

function restartGame() {
const allSquares = document.querySelectorAll(".square");
allSquares.forEach(square => {
square.innerHTML = "";
square.addEventListener("click", whose_turn);
infoDisplay.textContent = "Teraz gra koło";
});
}
function select_data(game_id) {
  var data = {
    game_id: game_id
  };

  fetch('select.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(function(response) {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error('Error retrieving data from server.');
      }
    })
    .then(function(data) {
      scoreTableBody.innerHTML = data;
    })
    .catch(function(error) {
      console.log('Error: ' + error);
    });
}


function insertToDatabase()
{
    var data = {
        wynik: wynik,
        game_id:game_id
    };

    fetch('insert.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(function (response) {
            if (response.ok) {
                console.log('Wartość zmiennej ile_prob została wysłana do insert.php.');
            } else {
                console.log('Błąd podczas wysyłania wartości zmiennej ile_prob.');
            }
        })
        .catch(function (error) {
            console.log('Błąd sieci: ' + error);
        });
    }
    const przycisk = document.getElementById('btn');
    przycisk.addEventListener('click', function() {
      select_data(game_id);
    });