const database_of_words = ["słoń","jabłko adama", "komputer",
"programowanie",
"javascript",
"wisielec",
"internet",
"openai",
"gra",
"pisanie",
"kod",
"algorytm",
"testowanie",
"rozwój",
"projektowanie",
"aplikacja",
"strona",
"framework",
"baza danych",
"serwer",
"hosting",
"debugowanie",
"przeglądarka",
"responsywność",
"bezpieczeństwo",
"sieć",
"logika",
"backend",
"frontend",
"interfejs",
"system",
"komponent",
"interakcja",
"konsola",
"zdarzenie",
"komunikacja",
"aplikacja mobilna",
"aplikacja webowa",
"edycja",
"kolor",
"typografia",
"plik",
"zarządzanie",
"struktura",
"rozwiązanie",
"wersjonowanie",
"integracja",
"rozwiązanie",
"platforma",
"prototyp",
"logowanie",
"autoryzacja",
"prywatność",
"cyfrowy",
"komunikat",
"rozmiar",
"wydajność",
"optymalizacja",
"responsywność",
"kompatybilność",
"urządzenie",
"projekt",
"projektant",
"strategia",
"scenariusz",
"użytkownik",
"testowanie",
"walidacja",
"komponent",
"szablon",
"menu",
"interaktywny",
"wtyczka",
"wersja",
"bezpieczeństwo",
"zarządzanie",
"projektowanie",
"struktura",
"rozwiązanie",
"platforma",
"prototyp",
"logowanie",
"autoryzacja",
"prywatność",
"cyfrowy",
"komunikat",
"rozmiar",
"wydajność",
"optymalizacja",
"responsywność",
"kompatybilność",
"urządzenie",
"projekt",
"projektant",
"strategia",
"scenariusz",
"użytkownik",
"testowanie",
"walidacja",
"komponent",
"szablon",
"menu",
"interaktywny",
"wtyczka",
"wersja",
"bezpieczeństwo",
"zarządzanie"];
var selected_level;
var category_selected;
var cache_string;
var array_of_string=[];
var wrong =0;
var loses =0;
var generated_word;
var win =0;
var game_id=2;
var wynik;
const alfabets_letter = ["a","ą","b","c","ć","d","e","ę","f","g","h","i","j","k","l","ł","m","n","ń","o","ó","p","q","r","s","ś","t","u","v","w","x","y","z","ź","ż"];

function selectLevel(level){
    if(
        level === "easy"
    ){
        selected_level = level;
        document.getElementById("select-level").hidden = true;
        document.getElementById("category").hidden = false;
    }
    if(
        level === "normal"
    ){
        selected_level = level;
        document.getElementById("select-level").hidden = true;
        document.getElementById("category").hidden = false;
    }
    if(
        level === "hard"
    ){
        selected_level = level;
        document.getElementById("select-level").hidden = true;
        document.getElementById("category").hidden = false;
    }
    console.log(selected_level);
}

function categorySelect(category){
     if(
        category === "general"
     ){
        document.getElementById("category").hidden = true;
        document.getElementById("game").hidden = false;
        category_selected = category;
     }
     console.log(category_selected)
}
function start(){
    var i = generateRandomWord();
    breakStringToLetters(database_of_words[i]);
}
function breakStringToLetters(our_string){
    cache_string = our_string;
    for(var i = 0; i < cache_string.length; i++){
        array_of_string[i] = cache_string.charAt(i);
    }
    console.log(array_of_string);
    document.getElementById("button-start").hidden = true;
    password();
    keyboardGenerate();
    generateRandomWord()
}
function keyboardGenerate(){
    var html = '<br>'
    document.getElementById('buttons').innerHTML += html;
    for(var i = 0; i <alfabets_letter.length ; i++){
        if(i==5 || i==11 || i==17 || i==23 || i==29 ){
            var html ='<button onclick="check('+i+')" id="'+i+'">'+alfabets_letter[i]+'</button><br>'
        document.getElementById('buttons').innerHTML += html;
        }else {
        var html ='<button onclick="check('+i+')" id="'+i+'">'+alfabets_letter[i]+'</button>'
        document.getElementById('buttons').innerHTML += html;}
    }
}

function password(){
    for(var i=0; i<cache_string.length; i++){
        if(cache_string[i]===" "){
            var html= '<div class="passwords" id="'+i+'">  </div>'
        document.getElementById('password').innerHTML += html;
        }else{
        var html= '<div class="passwords" id="'+i+'"> _ </div>'
        document.getElementById('password').innerHTML += html;
        }
    }
}

function generateRandomWord(){
    generated_word = Math.floor(Math.random() * database_of_words.length);
    console.log(generated_word);
    return generated_word;
}

function check(letter){
    if(loses!=12){
    wrong =0;
    var cached_letter = alfabets_letter[letter];
    for(var i=0; i < array_of_string.length; i++){
        if(array_of_string[i]=== cached_letter){
            document.getElementById(i).innerHTML = cached_letter;
        } else{
            
            wrong++;
        }
    }
    if(wrong === array_of_string.length){
        console.log("-1 serce")
        if(selected_level==="easy"){
            loses++;
        }
        if(selected_level==="normal"){
            loses= loses+2;
        }
        if(selected_level==="hard"){
            loses= loses+4;
        }
    }else{
        win++;
        console.log("1")
    }
}

if(win === array_of_string.length){
    var html ='<h1>WYGRAŁEŚ</h1>'
    document.getElementById('results').innerHTML = html;
    document.getElementById("buttons").hidden = true;
    document.getElementById("results").hidden = false;
    wynik=100;
    insertToDatabase();
    }

if(loses === 1){
    var html ='<img src="1.png" alt="miejsce na obrazek wisielec"><br>'
    document.getElementById('imge').innerHTML = html;
}
if(loses === 2){
    var html ='<img src="2.png" alt="miejsce na obrazek wisielec"><br>'
    document.getElementById('imge').innerHTML = html;
}
if(loses === 3){
    var html ='<img src="3.png" alt="miejsce na obrazek wisielec"><br>'
    document.getElementById('imge').innerHTML = html;
}
if(loses === 4){
    var html ='<img src="4.png" alt="miejsce na obrazek wisielec"><br>'
    document.getElementById('imge').innerHTML = html;
}if(loses === 5){
    var html ='<img src="5.png" alt="miejsce na obrazek wisielec"><br>'
    document.getElementById('imge').innerHTML = html;
}if(loses === 6){
    var html ='<img src="6.png" alt="miejsce na obrazek wisielec"><br>'
    document.getElementById('imge').innerHTML = html;
}if(loses === 7){
    var html ='<img src="7.png" alt="miejsce na obrazek wisielec"><br>'
    document.getElementById('imge').innerHTML = html;
}if(loses === 8){
    var html ='<img src="8.png" alt="miejsce na obrazek wisielec"><br>'
    document.getElementById('imge').innerHTML = html;
}if(loses === 9){
    var html ='<img src="9.png" alt="miejsce na obrazek wisielec"><br>'
    document.getElementById('imge').innerHTML = html;
}if(loses === 10){
    var html ='<img src="10.png" alt="miejsce na obrazek wisielec"><br>'
    document.getElementById('imge').innerHTML = html;
}if(loses === 11){
    var html ='<img src="11.png" alt="miejsce na obrazek wisielec"><br>'
    document.getElementById('imge').innerHTML = html;
}if(loses === 12){
    var html ='<img src="12.png" alt="miejsce na obrazek wisielec"><br>'
    document.getElementById('imge').innerHTML = html;
    var html2 = '';
        document.getElementById('password').innerHTML = html2;
    for(var i=0; i<cache_string.length; i++){
        if(cache_string[i]===" "){
            var html= '<div class="passwords" id="'+i+'">  </div>'
        document.getElementById('password').innerHTML += html;
        }else{
            var html= '<div class="passwords" id="'+i+'"> '+cache_string[i]+' </div>'
            document.getElementById('password').innerHTML += html;
        }
        
    }
    wynik=50;
insertToDatabase();

}
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