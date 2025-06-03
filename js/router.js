import { getCurrentUser, clearCurrentUser } from "./auth.js";
import { checkScore } from "./score.js";
import { loginView, gameView, scoreView, controlsView } from "./views.js";


export function navigateTo(path) {
  checkScore();
  
  // User logout handling
  if (path === "/login") {
    clearCurrentUser();
    if(getCurrentUser() === 'admin') {
      localStorage.removeItem('isAdmin');
    }

    // Stop and reset background audio
    const audio = document.getElementById("bg-audio");
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

  }

  // Set the URL for the history
  if (window.location.pathname !== path) {
    document.title = "BeerRunner - " + path;
    history.pushState({}, "", path);
  }
  router();
}

export function router() {
  const path = (window.location.pathname);

  if (path === "/login") {
    loginView(getCurrentUser());
  } else if (path === "/game") {
    gameView();
  } else if (path === "/score") {
    scoreView();
  } else if (path === "/controls") {
    controlsView();
  } else {
    navigateTo("/index.html");
  }
}
