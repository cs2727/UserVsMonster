//Alert Message Array 
const alertMessages = ["Congratulations, you have defeated the Monster!", "Unfortunately, the Monster has defeated you, better luck next time!"];

// Counter Variables
let monsterCounter = 0;
let userCounter = 0;
let roundCounter = 1;
let value = 0;
let monsterResponseToggler = true;

//Start Game Elements
const startGameOverlay = document.getElementById("startGameOverlay");
const startGameContainer = document.getElementById('startGameContainer');
const startGameButton = document.getElementById('startGameBtn');

//Health Bar Label Elements 
const userLabel = document.getElementById('userLabel');
const monsterLabel = document.getElementById('monsterLabel');

//Health Bar Elements
const userHealthBar = document.getElementById('userHealthBar');
const monsterHealthBar = document.getElementById('monsterHealthBar');

//Health Bar Number 
const userHealthNumber = document.getElementById('userHealthNumber');
const monsterHealthNumber = document.getElementById('monsterHealthNumber');

//Round Header Elements
const roundHeader = document.getElementById('roundHeader');
const roundCommencingHeader = document.getElementById('roundCommencingHeader');
const roundContextHeader = document.getElementById('roundContextHeader');

//Round Score Elements
const monsterScore = document.getElementById('monsterScore');
const userScore = document.getElementById('userScore');

// Button Elements
const attackButton = document.getElementById('attack-Button');
const superAttackButton = document.getElementById("superAttack-Button");
const healButton = document.getElementById('heal-Button');
const resetButton = document.getElementById('reset-Button');

//Audio Img Element
const audioImage = document.getElementById('audioImg');

//Audio Elements
const backgroundAudio = new Audio('Audio/GameAudio/backgroundMusic.mp3');
const inputAudio = new Audio();

backgroundAudio.volume = 0.1;
inputAudio.volume = 0.6;



// Function for User Input  (Attack/SuperAttack/Heal) ----------------------
function userInput(eventObject){
    const idOfButton = eventObject.currentTarget.id; 
    let value, attackOrHeal = 0;

    disableButtonsToggler(true); //disabling buttons

    if (idOfButton === "attack-Button"){ 
        roundContextHeader.innerText = "User is attacking...";
        value = Math.floor(Math.random() * (50 - 30 + 1) + 30);
    }
    else if (idOfButton === "superAttack-Button") {
        roundContextHeader.innerText = "User is super attacking...";
        value = Math.floor(Math.random() * (15 - 10 + 1) + 10);
    }
    else {
        roundContextHeader.innerText = "User is healing...";
        value = Math.floor(Math.random() * (10 - 6 + 1) + 6);
        attackOrHeal = 1;
    }

    roundContextHeader.style.display = 'block';
    attackOrHeal === 0 ? changingAudio('Audio/GameAudio/userAttack.mp3') : changingAudio('Audio/GameAudio/healing.mp3');
    attackOrHeal === 0 ? monsterHealthBar.value -= value : userHealthBar.value += value; // User attacks Monster or Heals
    attackOrHeal === 0 ? monsterHealthNumber.innerText = monsterHealthBar.value : userHealthNumber.innerText = userHealthBar.value;
    healthBarChecker(monsterHealthBar); // checks Monster's health
    setTimeout(monsterResponse, 3200); // Monster's response to User
};






// Function for Monster's response to User Inputs -----------------------
function monsterResponse(){
    const attackOrHeal = Math.floor(Math.random() * (2 - 1 + 1) + 1); // Decides if Monster Attacks or Heals (1 = attack, 2 = heal)
    const intensityMax = roundCounter === 1 ? 30 : roundCounter === 2 ? 20 : 25, intensityMin = roundCounter === 1 ? 25 : roundCounter === 2 ? 15: 20; 
    let value; // the value of the attack or heal
    
 
     if (monsterResponseToggler === false){ //Stops Monster from responding to User if Monster is dead
        monsterResponseToggler = true;
         return;
     };

    if (attackOrHeal === 1){
        roundContextHeader.innerText = "Monster is attacking...";
        value = Math.floor(Math.random() * (intensityMax - intensityMin + 1) + intensityMin);
    }
    else {
        roundContextHeader.innerText = "Monster is healing...";
        value = Math.floor(Math.random() * (10 - 6 + 1) + 6);
    }

    attackOrHeal === 1 ? changingAudio('Audio/GameAudio/monsterAttack.mp3') : changingAudio('Audio/GameAudio/healing.mp3');
    attackOrHeal === 1 ? userHealthBar.value -= value : monsterHealthBar.value += value; // Monster attacks User or Heals
    attackOrHeal === 1 ? userHealthNumber.innerText = userHealthBar.value : monsterHealthNumber.innerText = monsterHealthBar.value;
    healthBarChecker(userHealthBar); // Check's Users health

    setTimeout(() => { //the reason this setTimeout is here is because we need 2 seconds to show the round Context header as without this, it'll remove the context Header without information being displayed
        if (monsterCounter !== 2 || userHealthBar.value !== 0){ // only execute if MonsterCounter is not = 2, and userhealthBar is not = 0
            roundContextHeader.style.display = 'none';
            disableButtonsToggler(false); //enabling buttons
         };
        }, 2000);
   
};






// Function for checking User and Monster Health Bar values --------------
function healthBarChecker(healthBarElement){
    let gameWinner;

    if (healthBarElement.value > 0){ // if User Or Monster's health is not 0, function will finish executing
        healthBarTransitionColor(healthBarElement);
        return;
    }
    else if (healthBarElement.id === "monsterHealthBar"){ // Monster is dead
        userCounter++;
        userScore.innerText = `User: ${userCounter}`;
    }
    else { // User is dead
        monsterCounter++;
        monsterScore.innerText = `Monster: ${monsterCounter}`;
    };

    monsterResponseToggler = false;
    roundContextHeader.style.display = 'none';

    gameWinner = userCounter === 2 ? 0 : monsterCounter === 2 ? 1 : 'Pending'; // Deciding Game Winner 

    if (gameWinner !== 'Pending'){ // If User Or Monster has won 2 rounds, this code will execute and stop the function from executing further
        alert(alertMessages[gameWinner]);
        roundContextHeader.style.display = 'block';
        roundContextHeader.innerText = gameWinner === 0 ?  'User has Won' : 'Monster has Won'; // code for crown to appear on Winner
        resetButton.disabled = false;
        return;
    }

    roundHeader.style.display = 'none'; 
    roundCommencingHeader.style.display = 'block';

    // 3 Second Delay Between Rounds 
    setTimeout(() => {
        roundCounter++;
        roundHeader.textContent = `Round ${roundCounter} / 3`;
        userHealthBar.value = 100;
        userHealthNumber.innerText = 100;
        monsterHealthBar.value = 100;
        monsterHealthNumber.innerText = 100;
        healthBarTransitionColor('newRound');
        roundCommencingHeader.style.display = 'none';
        roundHeader.style.display = 'block';
        disableButtonsToggler(false);
    }, 3000);

};







// Function for changing Monster and User health bar colors --------------
function healthBarTransitionColor(healthBarElement){
    
    if (healthBarElement === 'newRound'){ // code for when new round commences, both monster and user health needs to be back to color Green!
        const arr = [monsterHealthBar.classList, userHealthBar.classList];
        for (let i = 0; i < 2; i++){
            for(const element of arr[i]){
                arr[i].remove(element);
            }
        }
        monsterHealthBar.classList.add('greenHealthBar');
        userHealthBar.classList.add('greenHealthBar');
    }
    else if (healthBarElement.value >= 67 && healthBarElement.value <= 100){ // Code Changing User Or Monster health bar to Green
        healthBarElement.classList.remove('yellowHealthBar');
        healthBarElement.classList.add('greenHealthBar')
    }
    else if (healthBarElement.value >= 34 && healthBarElement.value <= 67){ // Code Changing User Or Monster health bar to Yellow
        healthBarElement.classList.remove('greenHealthBar', 'redHealthBar');
        healthBarElement.classList.add('yellowHealthBar');
    }
    else {
        healthBarElement.classList.remove('yellowHealthBar'); // Code Changing User Or Monster health bar to Red
        healthBarElement.classList.add('redHealthBar');
    };
};









// Function for either disabling or not the Game Buttons -----------
function disableButtonsToggler(value){
    const documentButtons = document.querySelectorAll('input[type="button"]');
    for (const element of documentButtons){
        element.disabled = value;
    };
};








//Function for resetting the game -------------------------
function resetHandler(){
    if (roundCounter === 1 && monsterHealthBar.value === 100 && userHealthBar.value === 100){
        alert('No need to reset game')
        return;
    };
   location.reload();
};









//Function For Removing Start Game Overlay ---------------
function removeStartGameOverlay(){
    startGameOverlay.style.display = 'none';
    startGameContainer.style.display = 'none';
    backgroundMusicToggler();
};









//Function for turning ON/Off background music -------------------------
function backgroundMusicToggler(){
 
    if (value % 2 === 1){
        backgroundAudio.pause();
        audioImage.src = "Images/audioOff.png";
    }
    else {
        audioImage.src = "Images/audioOn.png";
        backgroundAudio.loop = true;
        backgroundAudio.play();
    }
    
    value++;
};









// Function for changing Audio for User and Monster Inputs (Attack/Heal/SuperAttack) --------------
function changingAudio(value){
        inputAudio.src = value;
        inputAudio.play();
};
















// Registered Event Listeners -------------------------------

//User Input Buttons
attackButton.addEventListener('click', userInput);
superAttackButton.addEventListener('click', userInput);
healButton.addEventListener('click', userInput);
resetButton.addEventListener('click', resetHandler);

//Start Game Button
startGameButton.addEventListener('click', removeStartGameOverlay);


//Audio Image
audioImage.addEventListener('click', backgroundMusicToggler);
