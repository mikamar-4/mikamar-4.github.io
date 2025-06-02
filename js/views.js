import { validateUser, getCurrentUser, setCurrentUser, checkForUser} from './auth.js';
import { loadScores, deleteUserScore} from './score.js';
import { startGame } from './game.js';
//import { startGame } from '../index.js';
import { navigateTo } from './router.js';
import { setCurrentView } from './state.js';
import { renderNav } from './render.js';

const appDiv = document.getElementById("app");

// --- VIEWS ---

// LOGIN VIEW
export function loginView() {
    setCurrentView("login");
    renderNav();

    appDiv.innerHTML = `
        <h1>Přihlášení</h1>
        <form id="login-form">
            <div id="login-name">
                <label for="username">Jméno:</label>
                <input type="text" id="username" placeholder="Zadej své jméno" required autofocus autocomplete="on"/ autofocus>
            </div>
            <div id="login-password">
                <label for="password">Heslo:</label>
                <input type="password" id="password" placeholder="Zadej své heslo" required autofocus autocomplete="on"/>
            </div>
            <button type="submit">Hrát</button>
        </form>
        <div id="login-info">
            <p id="login-info">Zadej své jméno a stiskni "Hrát". Pokud jsi tu již zapsaný, automaticky se přihlásíš. Pokud ne a pokud ještě neexistuje hráč se stejným jménem, vytvoří se Ti nový profil.</p>
            <div id="logo-container"></div>
        </div>
        
    `;

    validateUser();

}

// SCORE VIEW
export function scoreView(page = 1) {


    setCurrentView("score");
    renderNav();

    const scores = loadScores();
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
 

    const itemsPerPage = 5;
    const totalPages = Math.ceil(sorted.length / itemsPerPage);
    const start = (page - 1) * itemsPerPage;
    const currentPageItems = sorted.slice(start, start + itemsPerPage);

    appDiv.innerHTML = `
        <h1>Tabulka skóre</h1>
        ${sorted.length === 0 ? "<p>Žádná skóre zatím nejsou.</p>" : `
        <table>

            <thead>
                <tr><th>#</th><th>Jméno</th><th>Skóre</th><th class="removeScore" class="hidden">Smazat</th></tr>
            </thead>

            <tbody>
                ${currentPageItems.map(([name, score], index) => `
                    <tr><td>${start + index + 1}</td><td>${name}</td><td>${score}</td><td class="removeScore" class="hidden" data-username="${name}"><button>Smazat skóre</button></td></tr>
                `).join("")}
                
            </tbody>

        </table>
        <div id="pagination">
            <button data-page="${page - 1}" ${page === 1 ? "disabled" : ""}>Předchozí</button>
            <span>Stránka ${page} / ${totalPages}</span>
            <button data-page="${page + 1}" ${page === totalPages ? "disabled" : ""}>Další</button>
        </div>
        `}
    `;

   

    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    const deleteButtons = document.querySelectorAll('.removeScore');

    if (isAdmin && deleteButtons.length > 0) {

        deleteButtons.forEach(btn => {
            btn.classList.remove('hidden');
        });
    }else{
        deleteButtons.forEach(btn => {
            btn.classList.add('hidden');
        });
    }

    deleteButtons.forEach(button => {
        button.onclick = () => {
            const username = button.dataset.username;
            deleteUserScore(username);
        };
    });

     // Pagination buttons litseners
    const paginationDiv = document.getElementById("pagination");
    if (paginationDiv) {
        paginationDiv.addEventListener("click", e => {
        if (e.target.matches("button[data-page]")) {
            const newPage = parseInt(e.target.getAttribute("data-page"), 10);
            scoreView(newPage);
        }
        });
    }

}

// GAME VIEW
export function gameView() {

    const currentUser = getCurrentUser();

    if (!currentUser) {
        navigateTo("/login");
        return;
    }

    setCurrentView("game");
    renderNav();

    appDiv.innerHTML = `
    <div id="game">
        <div id="game-info">
            <section id="game-header">
                <h2>Hráč: ${currentUser}</h2>
                <div id="settings">
                    <button id="restartBtn">Restart</button>
                    <button id="muteBtn">Hudba</button>
                </div>
            </section>
            <p>Skóre: <span id="game-score">0</span></p>
        </div>
        <canvas id="game-canvas" width="800" height="300"></canvas>
        <div id="game-controls">
            <span>Mezerník = skok, P = pauza (on/off), R = restart, M = hudba (on/off)</span>
        </div>
    </div>
    `;

    const audio = document.getElementById("bg-audio");
    if (audio) {
        audio.play().catch(e => console.warn("Audio play blocked:", e));
        audio.volume = 0.25;
    }

    startGame();
}

// CONTROLS VIEW
export function controlsView() {
    renderNav();
    setCurrentView("controls");
    appDiv.innerHTML = `
    <section id="controls">
        <h1>Ovládání</h1>
        <p id="controls-text">
            Mezerník = skok
            <br>
            Esc/P = pauza
            <br>
            R = restart
            <br>
            M = ztlumit
        </p>
    </section>
    `;
}


export function showModal(message) {
  let modal = document.getElementById('modal');
  let messageBox, closeButton;

  // Find the "widnow", previously prepared modal
  messageBox = modal.querySelector('#modal-message');
  closeButton = modal.querySelector('#modal-close');

  // If no modal, create it
  messageBox.textContent = message;

  // Show modal window
  modal.classList.remove('hidden');

  // Block scrolling
  document.body.style.overflow = 'hidden';

  const closeModal = () => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  closeButton.onclick = closeModal;

  // Close byt button or escape
  
  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);
}
