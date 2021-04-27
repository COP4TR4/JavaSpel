// Code goes here

let suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades']; //Skapar färgerna
let values = ['Ace', 'King', 'Queen', 'Jack', //Skapar de olika nummren
  'Ten', 'Nine', 'Eight', 'Seven', 'Six', //Queen, Jack och King är alla 10
  'Five', 'Four', 'Three', 'Two', 'One'
];

let textArea = document.getElementById('text-area'); //Skapar en ID där texten är
let newGameButton = document.getElementById('new-game-button'); //ID för nytt spel knapp
let hitButton = document.getElementById('hit-button'); //ID för 'hit'
let stayButton = document.getElementById('stay-button'); //ID för 'stay'

hitButton.style.display = 'none'; //Innan spelet börjat finns inte Hit och Stay knapparna
stayButton.style.display = 'none';

let gameStart = false,
  gameOver = false,
  playWon = false,  
  dealerCards = [], //Alla startvärden
  playerCards = [],
  dealerScore = 0,
  playerScore = 0,
  deck = [];

newGameButton.addEventListener('click', function() {
  gameStarted = true; 
  gameOver = false;   //Startar spelet och då är vinst och förlust inte deklarerat
  playerWon = false;

  deck = createDeck();  
  shuffleDeck(deck);
  dealerCards = [getNextCard(), getNextCard()];
  playerCards = [getNextCard(), getNextCard()]; //Ger ut korten till spelare och dealer
  newGameButton.style.display = 'none';
  hitButton.style.display = 'inline';
  stayButton.style.display = 'inline';
  showStatus();
})

function createDeck() { //skapar decket där korten är
  let deck = []
  for (let suitIdx = 0; suitIdx < suits.length; suitIdx++) {
    for (let valueIdx = 0; valueIdx < values.length; valueIdx++) {
      let card = {
        suit: suits[suitIdx],
        value: values[valueIdx]
      }
      deck.push(card); //Ger ut korten
    }
  }
  return deck;
}

function shuffleDeck(deck){
  for(let i=0; i<deck.length; i++) //Blandar korten
  {
    let swapIdx = Math.trunc(Math.random() *deck.length); //Math.trunc tar bort alla decimaler
    let tmp = deck[swapIdx];     //Math.random ser till att det är random mellan de 52 korten
    deck[swapIdx] = deck[i];
    deck[i] = tmp; 
  }
}

hitButton.addEventListener('click', function(){ //När man trycker på knappen händer följande:
  playerCards.push(getNextCard());  //Ger ut ett nytt kort
  checkForEndOfGame(); //Kollar om man hamnat över 21 (då har man fölorat)
  showStatus(); //Visar totalen
});

stayButton.addEventListener('click', function(){
  gameOver = true; //När man tryckt på stay kan man inte länre dra kort och då kollar man
  //vem som vunnit (om spelar är under 21 men större än dealer = vinst)
  //(Om spelaren under 21 men mindre än dealer = Förlust)
  //(Om spelaren under 21 men dealer mer än 21 = Vinst)
  checkForEndOfGame();
  showStatus(); 
});

function checkForEndOfGame(){
  updateScores();
  
  if(gameOver){
    while(dealerScore<playerScore &&
          playerScore <=21 &&
          dealerScore <=21){
            dealerCards.push(getNextCard()); //Allt detta förklarat över ^^^
            updateScores();
    }
  }
    
    if(playerScore>21){
      playerWon = false;
      gameOver = true;
    }
    
    else if(dealerScore>21){
      playerWon = true;
      gameOver = true;
    }
    
    else if(gameOver){
      if(playerScore>dealerScore){
        playerWon = true;
      }
      else{
        playerWon = false;
      }
    }
}

function getCardString(card) {
  return card.value + " of " + card.suit;
}
function getCardNumericValue(card){
  switch(card.value){
    case 'Ace':
      return 1;
    case 'Two':
      return 2;
    case 'Three':
      return 3;
    case 'Four':
      return 4;
    case 'Five':
      return 5;
    case 'Six':
      return 6;
    case 'Seven':
      return 7;
    case 'Eight':
      return 8;
    case 'Nine':
      return 9;
    default:
      return 10; //Card.suit är alltid 10
  }
}
function showStatus()
{
  if(!gameStarted)
  {
    textArea.innerText = 'Welcome to Blackjack!';
    return; 
  }
  
  let dealerCardString = '';
  for(let i=0; i<dealerCards.length; i++) //Här räknar den ut totalvärde på korten för dealer
  {
    dealerCardString += getCardString(dealerCards[i]) + '\n';
  }
  let playerCardString='';
  for(let i=0; i<playerCards.length; i++) //Här räknar den ut totalvärde på korten för player
  {
    playerCardString += getCardString(playerCards[i]) + '\n';
  }
  
  updateScores();
  
  textArea.innerText = 'Dealer has:\n' +
                        dealerCardString + 
                        '(score: ' + dealerScore + ')\n\n' + //skriver ut värde för dealer
                        
                        'Player has:\n' +
                        playerCardString + 
                        '(score: ' + playerScore + ')\n\n'; //skriver ut värde för Player
                        
  if(gameOver){
    if(playerWon)
    {
      textArea.innerText += "YOU WIN!";
    }
    else{
      textArea.innerText += "DEALER WINS";
    }
    newGameButton.style.display = 'inline'; //Hit och Stay knapparna försvinner och ändast "nytt spel" komme rupp
    hitButton.style.display = 'none';
    stayButton.style.display = 'none';
    
  }
}

function getScore(cardArray){ //Ace är speciell eftersom den kan vara 1 och 11
  let score = 0;
  let hasAce = false;
  for(let i=0; i<cardArray.length; i++){ //Här kollar den vad värdet ska vara
    let card = cardArray[i];
    score += getCardNumericValue(card);
    if(card.value == 'Ace'){
      hasAce = true;
    }
    
    if(hasAce && score+10<=21){ //Om totalvärdet är mindre än 21 (och man har ace) får man 11
      return score+10; //Om totalvärdet är mer än 21 (Och man har ace) får man 1
    }
  }
   return score; 
}

function updateScores(){
  dealerScore = getScore(dealerCards); //Funktionen används längre upp, detta är funktionen för poängen
  playerScore = getScore(playerCards); 
}


function getNextCard() { //Denna funktionen används längre upp, har med kortutdelning
  return deck.shift();
}
