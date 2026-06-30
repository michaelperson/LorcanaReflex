//Ma zone de carte
const gameBoard=document.getElementById("game-board");
//Ma zone score
const score = document.getElementById("score");
//Bouton demarrage
const btnGo= document.getElementById("start-btn");
//Bouton rejouer
const btnRejouer = document.getElementById('replay-btn');
//modale de fin de partie
const modale = document.getElementById("end-modal");
//Level
//choix de la difficulté
const radio = document.querySelector('input[name="difficulty"]:checked');
const niveau     = radio.value;              // "facile" | "normal" | "extreme"
let level = 800; 
 
//Garder l'interval id pour pouvoir stopper le jeux
let intervalGame;
//Mon tableau de cartes
const Cards = [
  "Dodge!.jpg",
  "Donald_Duck_-_Buccaneer.jpg",
  "Flounder_-_Collectors_Companion.jpg",
  "Goofy_-_Super_Goof.jpg",
  "Gus_-_Champion_of_Cheese.jpg",
  "Mickey_Mouse_-_Playful_Sorcerer.jpg",
  "Olaf_-_Carrot_Enthusiast.jpg",
  "Pete_-_Rotten_Guy.jpg",
  "Pluto_-_Rescue_Dog.jpg"
];

//les cartes trouvées
const lightedCard=[];

//la carte courante retournée
let currentIndex;

//permet de retourner les cartes
const flip=function(back=1,index)
{
  if(!lightedCard.includes(index))
  {
    let flipCard = document.getElementById(`orcana-${index}`);
    if(back==1)
    { 
      flipCard.style.backgroundImage = "";       // reprend back.jpg du CSS
      flipCard.classList.remove("card--target");
      currentIndex=null;
    }
    else
    { 
      flipCard.style.backgroundImage = `url('./images/${Cards[index]}')`;
      flipCard.classList.add("card--target"); 
      currentIndex=index;     
      setTimeout(()=>{flip(1,index);},level-200);
    }
  }
}

//Permet de vérifier si la carte cliquée est celle qui était affichée et dans ce cas la laisser retournée
const checkLighted= function(clickIndex)
{
  if(currentIndex==undefined || currentIndex==null) return;
  
  if(currentIndex==clickIndex)
  {
    lightedCard.push(clickIndex);
    let currentScore= parseInt(score.textContent);
    currentScore++;
    score.textContent=currentScore;
    if(currentScore==Cards.length) 
      {
        clearInterval(intervalGame);
        modale.classList.remove("is-hidden");
        document.getElementById("final-score").textContent=currentScore;
        document.getElementById("finlevel").innerText=`(Niveau : ${niveau})`;
      }
  }
}

//Chargement initial du board
const loadGameBoard = function()
{
  gameBoard.innerHTML="";
  for(let i=0; i<9; i++)
  {

    let carte = document.createElement("div");
    carte.style.backgroundImage = "";
    carte.classList.add("card");
    carte.classList.add("card__face--back");
    carte.id=`orcana-${i}`;
    carte.addEventListener("click",()=> checkLighted(i));
    gameBoard.appendChild(carte);

  }
}

//Choix aléatoire d'un index
const nextIndex= function()
{
  const disponibles = [];
  for (let i = 0; i < 9; i++) {
    if (!lightedCard.includes(i)) 
      {
        disponibles.push(i);
      }
  }

  if (disponibles.length > 0) 
    {
      const index = disponibles[Math.floor(Math.random() * disponibles.length)];
      flip(0, index);
    }
}

 
//Démarrage du jeu

loadGameBoard(); 
btnGo.addEventListener("click",function()
{

  radio.disabled = true;
  level=Number(radio.dataset.spawn); 
  modale.classList.add("is-hidden");
  intervalGame =setInterval(nextIndex,level);
  btnGo.disabled = true;
});

//permet de rejouer
btnRejouer.addEventListener("click", function()
{
  loadGameBoard(); 
  btnGo.disabled = false;
  modale.classList.add("is-hidden");
  radio.disabled = false;
});