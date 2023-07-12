window.addEventListener('load', () => {
    var game_id=4;
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
    window.select_data = select_data;
    const scoreTableBody = document.querySelector("#scoreTableBody");
    const przycisk = document.getElementById('btn');
    przycisk.addEventListener('click', function() {
      select_data(game_id);
    }); 

    let snake, move, nextMove, points, apple, running;
    const ctx = document.getElementById('snake-canvas').getContext('2d');
    var wynik = 0;
    setDefault();
    addKeyDownEventListener();
    setInterval(renderFrame, 100);
    
    function renderFrame() {
        if (running) {
            if (nextMove.x !== -move.x || nextMove.y !== -move.y) {
                move = nextMove;
            }
            snake.push({ x: processBound(getHead().x + move.x), y: processBound(getHead().y + move.y) });
            if (snake.filter(square => square.x === getHead().x && square.y === getHead().y).length >= 2) {
                setDefault();
                insertToDatabase();
                wynik = 0;
            } else {
                console.log(getHead());
                if (getHead().x === apple.x && getHead().y === apple.y) {
                    points++;
                    wynik += 1;
                    apple = generateAppleLocation();
                }
                points <= 0 ? snake.shift() : points--;
            }
        }

        ctx.fillStyle = 'green';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = 'blue';
        snake.forEach(square => ctx.fillRect(square.x * 20, square.y * 20, 18, 18));
        ctx.fillStyle = 'red';
        ctx.fillRect(apple.x * 20, apple.y * 20, 18, 18)
    }

    function getHead() {
        return snake[snake.length - 1];
    }

    function processBound(xOrY) {
        if (xOrY > 19) {
            return 0;
        } else if (xOrY < 0) {
            return 19;
        }
        return xOrY;
    }

    function setDefault() {
        snake = [{ x: 10, y: 10 }];
        [move, nextMove] = Array(2).fill({ x: 0, y: 0 });
        points = 2;
        running = false;
        apple = generateAppleLocation();
    }

    function generateAppleLocation() {
        let location;
        do {
            location = { x: generateRandomNumber(19), y: generateRandomNumber(19) };
        } while (snake.filter(square => square.x === location.x && square.y === location.y).length > 0);
        return location;
    }

    function generateRandomNumber(max) {
        return Math.floor(Math.random() * (max + 1));
    }

    function addKeyDownEventListener() {
        window.addEventListener('keydown', e => {
            if (e.code.startsWith('Arrow')) {
                e.preventDefault();
                running = true;
            }
            switch (e.code) {
                case 'ArrowLeft':
                    nextMove = { x: -1, y: 0 };
                    break;
                case 'ArrowRight':
                    nextMove = { x: 1, y: 0 };
                    break;
                case 'ArrowDown':
                    nextMove = { x: 0, y: 1 };
                    break;
                case 'ArrowUp':
                    nextMove = { x: 0, y: -1 };
            }
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
});
