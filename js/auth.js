import { navigateTo } from './router.js';
import { showModal } from './views.js';
let currentUser = null;


function sanitize(input) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function validateUser(){
  document.getElementById("login-form").addEventListener("submit", e => {
    e.preventDefault();

    const username = sanitize(e.target.username.value.trim());

    const password = sanitize(e.target.password.value.trim());

    if (!username || username.length < 3 || username.length > 20){
        showModal("Zadej platné jméno o nejméně 3 a nejvýše 20 znacích.")
        return;
    }
  
    if (!password || password.length < 3){
      showModal("Zadej platné heslo o minimálně 3 znacích.");
      return;
    }
  
    if(checkForUser(username, password)){
      setCurrentUser(username);
      navigateTo("/game");
    }else{
      showModal("Špatné heslo. Zkus to znovu.");
    }
        
  });
}


export function getCurrentUser() {
  return currentUser;
}

export function setCurrentUser(username) {
  currentUser = username;
  sessionStorage.setItem("currentUser", username);
}

export function clearCurrentUser() {
  currentUser = null;
  if(sessionStorage.getItem('isAdmin') === 'true') {
    sessionStorage.removeItem('isAdmin');
  }
  sessionStorage.removeItem("currentUser");
}

export function loadCurrentUserFromSession() {
  currentUser = sessionStorage.getItem("currentUser") || null;
}

export function checkForUser(username, password) {
  if (!username || !password) return false;

  // Have to use sessionStorage for admin. It is not pretty but is works for our cause.
  // Would do better IRL.
  if (username === 'admin' && password === 'admin') {
    sessionStorage.setItem('isAdmin', 'true');
    sessionStorage.setItem('currentUser', 'admin');
    showModal('Přihlášen jako admin');
    return true; 
  }else{
    const users = JSON.parse(localStorage.getItem('users')) || {};

  // The user DOES exist
  if (users[username]) {
    return users[username] === password;
  }

  // If the user does not exist, create a new user
  users[username] = password;
  localStorage.setItem('users', JSON.stringify(users));
  return true;
  }
}