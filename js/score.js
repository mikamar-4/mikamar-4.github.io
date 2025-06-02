const STORAGE_KEY = "highscores";
import { navigateTo } from './router.js';
import { showModal } from './views.js';


export function loadScores() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

export function saveScores(scores) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
}


// Checks the current score and saves it if it's a new high score. Only works in the "game" view.
export function checkScore(currentView){
  if (currentView === "game") {
    const scoreText = document.getElementById("game-score")?.textContent || "0";
    const currentScore = parseInt(scoreText, 10);
    saveHighScoreIfBeaten(currentScore);
  } 
}


// Saves the score if it's higher than the previous one
export function saveHighScoreIfBeaten(user, newScore) {
  const scores = loadScores();
  const prevScore = scores[user] || 0;

  if (newScore > prevScore) {
    scores[user] = newScore;
    saveScores(scores);
    showModal("Dosáhl jsi nového nejlepšího skóre!");
  }
}

export function deleteUserScore(username, page) {

  const score = JSON.parse(localStorage.getItem('highscores')) || {};
  
  delete score[username];
  localStorage.setItem('highscores', JSON.stringify(score));

  showModal(`Záznam uživatele "${username}" byl smazán.`);
  navigateTo(`/score?page=${page}`);
}