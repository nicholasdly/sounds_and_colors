// Global constants
const nextClueWaitTime = 1000;  // How long to wait before starting playback of the clue sequence

// Global variables
var pattern = [2, 2, 4, 3, 2, 1, 2, 4];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;  // Must be between 0.0 and 1.0
var guessCounter = 0;
var clueHoldTime = 1000;  // How long to hold each clue's light/sound
var cluePauseTime = 333;  // How long to pause in between clues

function startGame() {
  // Initializes game variables
  progress = 0;
  clueHoldTime = 1000;
  cluePauseTime = 333; 
  randomizePattern();
  gamePlaying = true;
  
  // Swaps the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  
  playClueSequence();
}

function stopGame() {
  gamePlaying = false;
  
  // Swaps the Start and Stop buttons
  document.getElementById("stopBtn").classList.add("hidden");
  document.getElementById("startBtn").classList.remove("hidden");
}

function lightButton(btn) {
  document .getElementById("button"+btn).classList.add("lit");
}
function clearButton(btn) {
  document .getElementById("button"+btn).classList.remove("lit");
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  guessCounter = 0;
  let delay = nextClueWaitTime; // Set delay to initial wait time
  for (let i=0; i<=progress; i++) {  // For each clue that has been revealed
    console.log("Play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]);  // Set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

function guess(btn) {
  console.log("User guessed: " + btn);
  if (!gamePlaying) {
    return;
  }
  
  if (btn == pattern[guessCounter]) {  // If guess is correct
    if (guessCounter >= progress) {  // If turn is over
      if (progress == pattern.length-1) {  // If last turn
        winGame();
      } else {
        progress += 1
        clueHoldTime -= 50
        cluePauseTime -= 20
        playClueSequence();
      }
    } else { guessCounter += 1; }
  } else { loseGame(); }
}

function loseGame() {
  stopGame();
  alert("Game Over! You lost.");
}

function winGame() {
  stopGame();
  alert("Game Over! You won!!");
}

function randomizePattern() {
  for (let i=0; i<pattern.length; i++) {
    pattern[i] = Math.floor(1 + Math.random() * 4)
  }
}

// Sound Synthesis Functions
const freqMap = {
  1: 200,
  2: 300,
  3: 400,
  4: 500
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)