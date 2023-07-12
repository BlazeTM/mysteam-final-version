const cardColors = ["red", "red", "green", "green", "blue", "blue", "brown", "brown", "yellow", "yellow", "gray", "gray", "cadetblue", "cadetblue", "violet", "violet", "lightgreen", "lightgreen"];
var wynik=0;
var game_id=5;
const scoreTableBody = document.querySelector("#scoreTableBody");

let cards = document.querySelectorAll("#blok");
cards = [...cards]; 


const startTime = new Date().getTime(); 

let activeCard = "";
const activeCards = []; 

const gameLength = cards.length / 2; //9

let gameResult = 0;

const clickCard = function () {

    activeCard = this;
    if (activeCard == activeCards[0]) return;

    activeCard.classList.remove("hidden");
    if (activeCards.length === 0) {
        console.log("1 element");
        activeCards[0] = activeCard;
        return;

    }
    else {
        console.log("2 element");

        cards.forEach(card => card.removeEventListener("click", clickCard))
 
        activeCards[1] = activeCard;

        setTimeout(function () {

            if (activeCards[0].className === activeCards[1].className) {
                console.log("wygrane")
                wynik++;
                activeCards.forEach(card => card.classList.add("off"))
                gameResult++;
                cards = cards.filter(card => !card.classList.contains("off"));

                if (gameResult == gameLength) {
                    const endTime = new Date().getTime();
                    const gameTime = (endTime - startTime) / 1000
                    console.log(wynik);
                    insertToDatabase();
                    alert(`Udało się! Twój wynik to: ${gameTime} sekund`)
                }
            }
  
            else {
                console.log("przegrana")
                wynik++;
                activeCards.forEach(card => card.classList.add("hidden"))
            }

            activeCard = "";
            activeCards.length = 0;
            cards.forEach(card => card.addEventListener("click", clickCard))

        }, 500)
    }
};


const init = function () {

    cards.forEach(card => {
 
        const position = Math.floor(Math.random() * cardColors.length); 
        card.classList.add(cardColors[position]);
      
        cardColors.splice(position, 1);
    })
    
    setTimeout(function () {
        cards.forEach(card => {
            card.classList.add("hidden")
            card.addEventListener("click", clickCard)
        })
    }, 2000)
}

init();

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