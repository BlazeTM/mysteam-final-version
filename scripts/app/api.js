"use strict";

const loginBtn = document.getElementById('loginbtn');
const chooseBtns = document.getElementsByClassName('chooseOption');
const listsBtns = document.getElementsByClassName('listsBtns');
const editBtns = document.getElementsByClassName('edit');
const pagesBtns = document.getElementsByClassName('pagebtn');
var lastOpened;
var editOrCreate;
var arrayOfTitles = [];
var onloadf;
var user;
var userId;
var game_id_selected;
var perPage = 1;
var actualPage;
var arrayOfDeleted = [];
var arrayNotDeletedGames = [];
var parts;

if(loginBtn){
  loginBtn.addEventListener('click', e => {
      const choosedUserText = document.getElementById('choosedUser');
      user = choosedUserText.textContent;
      document.cookie = 'id='+user;
      window.location.replace("http://praktyki.42web.io/main.html");
      onloadf = true;
  })
}
if(document.getElementById('editgamebtn')){

}
do{
  loadManager();
  
}while(onloadf)
//Zarzadzanie buttonami
for(var i = 0 ; i < pagesBtns.length; i++){
  pagesBtns[i].addEventListener('click', e => {
      const ele = e.target.classList.item(1);
      var l = 0;
      let toggle = document.getElementById(ele);
      
      for(var i = 1 ; i <= 5; i++){
        if(ele==='page'+i){
          if(undefined === document.getElementById('page'+i).classList.item(1)){
            toggle.classList.toggle("covered");
            break;
          }
        }else{
          document.getElementById('page'+i).classList.add("covered");
        }
      }
      toggle.classList.toggle("covered");
  }); 
}

    for(var i = 0 ; i < listsBtns.length; i++){
        listsBtns[i].addEventListener('click', e => {
            const ele = e.target.id;
            let toggle = document.getElementById(ele+"List");
            toggle.classList.toggle("show");
        }); 
    }
    for (var i = 0 ; i < chooseBtns.length; i++) {
      chooseBtns[i].addEventListener('click', e => {
          const btn = e.target;
          const btnContent = btn.textContent;
          const id = btn.classList.item(1);
          const choosedUserText = document.getElementById(id+"text");
          choosedUserText.innerHTML = btnContent;
          let toggle = document.getElementById(id+"List");
          toggle.classList.toggle("show");
      }); 
   }

//reszta funkcji
async function deleteGame(id){
  var idtosend = arrayOfTitles[id];
  var idtosend = idtosend['id'];
  console.log(idtosend);
  var data = {
    type: 'deleteGame',
    id: idtosend
  }
  var response = await postData("http://praktyki.42web.io/api.php", data);
  console.log(response);
  loadManager();
}
async function loadManager(){
   await createGameTitles();
   document.getElementById('games').innerHTML="";
    document.getElementById('games').innerHTML='<div class="pagesofgames covered" id="page1"></div><div class="pagesofgames covered" id="page2"></div><div class="pagesofgames covered" id="page3"></div><div class="pagesofgames covered" id="page4"></div><div class="pagesofgames covered" id="page5"></div>';
    perPage = 0;
    document.getElementById('page1').classList.toggle('covered');
    pagination();
    
}
function showGameDescription(id){
  if(!lastOpened){
    document.getElementById(id).classList.toggle('shown');
    lastOpened=id;
  }else {
    
    document.getElementById(lastOpened).classList.toggle('shown');
    document.getElementById(id).classList.toggle('shown');
    lastOpened=id;
  }
}
var countStars = function () {
    var checkedRadio = document.querySelector('.stars input:checked');
    var variable = checkedRadio.value;
    return variable;
  };

  document.querySelector('.stars').addEventListener('click', countStars);


async function createGameTitles(){
  var response = await getMaxIdGame();
  var idMax = response['id'];
  var y = 0;
  var x =0;
  arrayOfDeleted = [];
  arrayOfTitles =[];
  /*var data = {
    type: 'getDeletedGames'
  }
  
  var arrayOfDeletedEncoded = await postData("http://praktyki.42web.io/api.php", data);
  console.log(arrayOfDeletedEncoded);
  for(var i = 0; i < arrayOfDeletedEncoded.length; i++){
    var a = arrayOfDeletedEncoded[i];
    arrayOfDeleted[i] = a['id'];
    console.log(arrayOfDeleted);}
*/
  for(var i = 3; i <= idMax; i++){
      var title = "";
      title = await getGameTitle(i);
      
      var data = {
        type : "getMaxDeletedGames"
      }
      var maxDeletedId = postData("http://praktyki.42web.io/api.php", data);
      if(title['idn'] === i){
          arrayOfDeleted[y]=title['idn'];
  
          y = y+1;

      }else {
        arrayOfTitles[x]= title;
        x++;
      }
      
      
  }
  document.getElementById('user').innerHTML = getCookie("id");
}
function getCookie(name) {
  const value = `; ${document.cookie}`;
  console.log(value);
  parts = value.split(`; ${name}=`);
  console.log(parts);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return parts[1];
}
function pagination(){

  var records = arrayOfTitles.length;


  var pages = records % 3;

  
  if (pages === 0) {
    pages = records/3;

  } else {
    pages = (parseInt(pages)+1);
  }

  for(var i = 1; i <= pages; i++){


    

    actualPage = i;
    for(var perPage1 = perPage ;perPage1 < perPage+3; perPage1++){
      var title = arrayOfTitles[perPage1]; 

      var html = '<div class="item-card-open"><div class="item-header gamecard" onclick="showGameDescription('+perPage1+')"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABvklEQVR4nO3Xz4dWURzH8df0c1oOKUmKJClJP0iJiIiIFplFZjdp12IWEy2iVdpEi2gRUUS0iIj+g9lEIkmSMUpKqSn97snlDNf1bTzPdO/zPJPz5mzuPZ/P9/M957rnXjKZTCaTyWQy/yW7cRrbex0EmzGObe0K9uAnWviOYb1jOGVopUxtNXEmCVol4YjuM1JayJkx1o5wJ35UhL8wqnuMpprlDEWmre0aHCtt3cz4jVOa52QQvtiJ450aHcbXilErPWJNMZYWqlzvG47O1fAQvgRNnFU/40GdIvyRfzXej+nA/Lxmw3/GwboK7MPHoMiFGrzPBb6fcEDN7MWHoNhlDMzBbwAXA7/ptOuNsANvg6JXsKDD8JcCn/fpK6BRitPwTVD8Bha2oS8avRro32GXLrEJL4MQN7FoFl3R4LVA97qTQ6ouNmIqCHMLi/8S/now/xW26BHr8DwIdReDpXlLcDuYN4kNesxaPAvC3cMyLMWd4P4LrNcnrMHTIOT9NKrXi7mFpq9YiUdB2Op4gtX6lBV4OEv4x1ilzxnCRBD+AZabJwxVmphI1+YVgziR/q7Kr9RMJpPJZDKZTIY/TYnN8w9HTIIAAAAASUVORK5CYII="> <span class="title game'+perPage1+'">'+title['game_name']+'</span> <span id="game'+perPage1+'" class="starsgame  game'+perPage1+'"><span></div><div id="'+perPage1+'" class="item-description"><p class="description game'+perPage1+'">'+ title['game_description'] +'</p><a class="game'+perPage1+' description" onclick="playGame('+perPage1+')">Zagraj w gre</a><br><a class="game'+perPage1+' edit" onclick="gameEditManager('+perPage1+')" >Edytuj gre</a><br><a class="game'+perPage1+' delete" onclick="deleteGame('+perPage1+')" >Usuń gre</a></div></div>';

      document.getElementById('page'+actualPage).innerHTML += html;
      
      var reviews = title['reviews'];
      reviews = reviews['amountReviews'];
      var reviewsAmount = title['reviewsAmount'];
      reviewsAmount = parseInt(reviewsAmount['sumReviews']) ;
      var rating = parseFloat(reviewsAmount/reviews);

      html= "";
      var html1 ="";
      if(rating>4.5){
        html1 = '<svg class="arrow starss" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg><svg class="arrow starss" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg><svg class="arrow starss" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg><svg class="arrow starss" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg><svg class="arrow starss" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>';
      }
      if( rating<=4.5 && rating>=4.0){      
        html1 = '<svg class="arrow starss" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg><svg class="arrow starss" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg><svg class="arrow starss" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg><svg class="arrow starss" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg><svg class="arrow starss" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M288 0c-12.2 .1-23.3 7-28.6 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3L288 439.8V0zM429.9 512c1.1 .1 2.1 .1 3.2 0h-3.2z"/></svg>'
      }
      if(rating<=4.0 && rating>=3.5){
        html1 = '<svg class="arrow starss" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg><svg class="arrow starss" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg><svg class="arrow starss" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg><svg class="arrow starss" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>'
      }
      if(rating <=3.5 && rating>=3.0){
        html1= '<svg class="arrow starss" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg><svg class="arrow starss" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg><svg class="arrow starss" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg><svg class="arrow starss" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M288 0c-12.2 .1-23.3 7-28.6 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3L288 439.8V0zM429.9 512c1.1 .1 2.1 .1 3.2 0h-3.2z"/></svg>'
      }
      if(rating <=3.0 && rating>=2.5){
        html1 = '<svg class="arrow starss" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg><svg class="arrow starss" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg><svg class="arrow starss" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>';
      }
      if(rating <=2.5 && rating>=2.0){
        html1 = '<svg class="arrow starss" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg><svg class="arrow starss" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg><svg class="arrow starss" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M288 0c-12.2 .1-23.3 7-28.6 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3L288 439.8V0zM429.9 512c1.1 .1 2.1 .1 3.2 0h-3.2z"/></svg>';
      }
      if(rating <=2.0 && rating>=1.5){
        html1 ='<svg class="arrow starss" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg><svg class="arrow starss" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>';
      }
      if(rating <=1.5 && rating>=1.0){
        html1 = '<svg class="arrow starss" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg><svg class="arrow starss" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M288 0c-12.2 .1-23.3 7-28.6 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3L288 439.8V0zM429.9 512c1.1 .1 2.1 .1 3.2 0h-3.2z"/></svg>' 
      }
      if(rating <=1.0){
        html1 = '<svg class="arrow starss" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>';
      }

      document.getElementById('game'+perPage1).innerHTML = html1;
    
  }
    perPage = perPage + 3;
  }
  
}
function playGame(id){
  id = id+1;
  window.location.replace("http://praktyki.42web.io/gry/"+id+".html");
}

async function gameEditManager(id){
  openEditGame();
  var ourGame = arrayOfTitles[id];
  document.getElementById('editgametitle').value = ourGame['game_name'];
  document.getElementById('editgamecategorytext').innerHTML = ourGame['type_name'];
  document.getElementById('editplatformtext').innerHTML = ourGame['platform_name'];
  document.getElementById('editimg').innerHTML = '<img src="'+ourGame['screenshot']+'" alt="puste zdjecie">';
  document.getElementById('editgamebtn').innerHTML = "Edytuj gre";
  var data = {
    type: 'getIdFromName',
    name: ourGame['game_name']
  }
  id = await postData('http://praktyki.42web.io/api.php', data);
  game_id_selected = id['id'];
  console.log(game_id_selected);
}
function openAddGame(){
  if(!editOrCreate || editOrCreate === "create"){
    document.getElementById('gameAdd').classList.toggle('shown');
    if(!editOrCreate){
      editOrCreate= "create";
    }else{
      editOrCreate= "";
    }
    
  }else{
    document.getElementById('gameAdd').classList.toggle('shown');
    document.getElementById('gameEdit').classList.toggle('shown');
    editOrCreate= "create";
  }
}
async function editGameData(){
  var name = document.getElementById('editgametitle').value;
  var id = game_id_selected;
  var category = document.getElementById('editgamecategorytext').textContent;
  var platform = document.getElementById('editplatformtext').textContent;
  var screenshot = document.getElementById('editimg').src;
  var rating = parseInt(countStars());
  var data = {
    type : 'getAuthorId',
    id : id
  }
  if(category = "logiczna"){
    category = 1 ;
  }
  if(platform = "html"){
    platform = 1 ;
  }
  var author_id = await postData("http://praktyki.42web.io/api.php", data);
  var player_id = checkUserIdFromName(getCookie("id"));
  data = {
    type: "editGameData", 
    id: id,
    name: name,
    description: "",
    category: category,
    platform: platform,
    screenshot: "",
    rating: rating,
    author_id: author_id['author_id'],
    player_id: player_id
  }
  var response = await postData("http://praktyki.42web.io/api.php", data);
  document.getElementById('games').innerHTML = "";
  await loadManager();
  
}
async function newGameData(){
  var name = document.getElementById('newgametitle').value;
  var id = await getMaxIdGame();
  console.log(id);
  var id = id['id'];
  console.log(id);

  
  var category = document.getElementById('gamecategorytext').textContent;
  var platform = document.getElementById('platformtext').textContent;
  var screenshot = "";
  var player_id = checkUserIdFromName(getCookie("id"));
  var rating = parseInt(countStars());
  if(category = "logiczna"){
    category = 1 ;
  }
  if(platform = "html"){
    platform = 1 ;
  }
  var data = {
    type: "newGameData", 
    id: id,
    name: name,
    description: "",
    category: category,
    platform: platform,
    screenshot: "",
    rating: rating,
    author_id: player_id,
    player_id: player_id
  }

  var response = await postData("http://praktyki.42web.io/api.php", data);

  openEditGame();
  await loadManager();
}
function openEditGame(){
  if(!editOrCreate || editOrCreate === "edit"){
    document.getElementById('gameEdit').classList.toggle('shown');
    if(!editOrCreate){
      editOrCreate= "edit";
    }else{
      editOrCreate= "";
    }
  }else{
    document.getElementById('gameAdd').classList.toggle('shown');
    document.getElementById('gameEdit').classList.toggle('shown');
    editOrCreate= "edit";
  }
}
async function getGameTitle(id){
  var data = {
    id: id,
    type: 'getGameData'
    
  }
  var gameData;
  gameData = await postData("http://praktyki.42web.io/api.php",data);
  return gameData;
}

async function getMaxIdGame(){
  var type = 'getMaxIdGame';
    var data = {
        type: type
    }
    var maxIdGame;
    maxIdGame = await postData("http://praktyki.42web.io/api.php", data)
    return maxIdGame;
}
function checkUserIdFromName(user){
  if(user === "Kacper Zapart"){
    return 1;
  }
  if(user === "Pawel Nawrot"){
    return 2;
  }
  if(user === "Bartlomiej Zielinski"){
    return 3;
  }
  if(user === "Konrad Kucharski"){
    return 4;
  }
  if(user === "Mateusz Furman"){
    return 5;
  }
  if(user === "Kacper Gabrysiak"){
    return 6;
  }
}
function checkUserNameFromid(user){
  if(user === 1){
    return "Kacper Zapart";
  }
  if(user === 2){
    return "Pawel Nawrot";
  }
  if(user === 3){
    return "Bartlomiej Zielinski";
  }
  if(user === 4){
    return "Konrad Kucharski";
  }
  if(user === 5){
    return "Mateusz Furman";
  }
  if(user === 6){
    return "Kacper Gabrysiak";
  }
}