var amount_digits;
var number_generated;
var wynik=1;
var game_id=3;
const scoreTableBody = document.querySelector("#scoreTableBody");
function level(selected) {
    if (selected === "easy") {
        amount_digits = 2;
    }
    if (selected === "normal") {
        amount_digits = 3;
    }
    if (selected === "hard") {
        amount_digits = 4;
    }
    document.getElementById("levels").hidden = true;
    document.getElementById("start").hidden = false;
}

function start() {
    generateNumbers();
    document.getElementById("start").hidden = true;
    document.getElementById("container").hidden = false;
}

function generateNumbers() {
    if (amount_digits == 2) {
        number_generated = Math.floor(Math.random() * 100);
    }
    if (amount_digits == 3) {
        number_generated = Math.floor(Math.random() * 1000);
    }
    if (amount_digits == 4) {
        number_generated = Math.floor(Math.random() * 10000);
    }
    console.log(number_generated,"wygenerowany numer");
}

function check() {
    var number = parseInt(document.getElementById('number').value);
    console.log(number);
    if (number === number_generated) {
        alert("Brawo, wygrałeś! Wylosowana liczba to: " + number_generated);
        insertToDatabase();
        console.log(wynik, "ilość prób");
    } else if (number < number_generated) {
        alert("Wpisana liczba jest mniejsza od wygenerowanej.");
        wynik++;
    } else {
        alert("Wpisana liczba jest większa od wygenerowanej.");
        wynik++;
    }
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
      
      const przycisk = document.getElementById('btn');
      przycisk.addEventListener('click', function() {
        select_data(game_id);
      });