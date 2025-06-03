import { getCurrentUser, setCurrentUser} from './auth.js';

let backgroundOffset = 0;
const PARALLAX_SPEED = 0.5;

const CITY_WIDTH = 960;
const CITY_HEIGHT = 300 ;

const canvasWidth = 800;
const canvasHeight = 300;

const scale = Math.min(canvasWidth / CITY_WIDTH, canvasHeight / CITY_HEIGHT);

const SPRITE_WIDTH = 96;
const SPRITE_HEIGHT = 48 ;
const FRAME_COUNT = 8;
const TICKS_PER_FRAME = 4; // menší = rychlejší animace

let frameIndex = 0;
let frameTick = 0;

const nav = document.querySelector("nav");

// City animation - "paralax-like" movement
const cityImg = new Image();
cityImg.src = "../sources/img/city_dark.PNG";
// source: https://opengameart.org/content/city-parallax-pixel-art

// Player animation - sprites
const sprite = new Image();
sprite.src = "../sources/img/playerRun.PNG";
// source: https://deadrevolver.itch.io/pixel-prototype-player-sprites



export function draw(ctx, canvas, player, obstacles) {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  frameTick++;
  if (frameTick >= TICKS_PER_FRAME) {
    frameTick = 0;
    frameIndex = (frameIndex + 1) % FRAME_COUNT;
  }


  // Backgriund movement
  backgroundOffset -= PARALLAX_SPEED;
  if (backgroundOffset <= -CITY_WIDTH) {
    backgroundOffset = 0;
  }

  // Backhround rendering
  const cityY = canvas.height - CITY_HEIGHT;

  // The moving city effect - adding the same picture again and again like a trin wagons.
  ctx.drawImage(cityImg, backgroundOffset + CITY_WIDTH, cityY, CITY_WIDTH, CITY_HEIGHT);
  ctx.drawImage(cityImg, backgroundOffset, cityY, CITY_WIDTH, CITY_HEIGHT);
  
  // Something ressemablig a road at the bottom of the canvas
  ctx.fillStyle = 'grey';
  ctx.fillRect(0, canvasHeight-10, canvasWidth, canvasHeight);

  // Rendering player character
  ctx.drawImage(
    sprite,
    frameIndex * SPRITE_WIDTH, 0,
    SPRITE_WIDTH, SPRITE_HEIGHT,
    player.x - (SPRITE_WIDTH - player.width) / 2,
    player.y - (SPRITE_HEIGHT - player.height) / 2,
    SPRITE_WIDTH, 
    SPRITE_HEIGHT 
  );

  // Rendering obstacles

  for (let ob of obstacles) {
    ob.draw(ctx);
  }

}

export function drawPause(ctx, canvas) {
  const text = "PAUZA";

  ctx.font = "120px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = "rgba(0, 0, 0, 0.01)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);


  ctx.fillStyle = "white";

  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

export function drawGameOver(ctx, canvas) {
  const text = "Game Over. Pro opakování stiskni R";

  ctx.font = "32px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = "rgba(0, 0, 0, 0.95)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";

  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}


// Fnction to render different views for different occasions - user logged/not logged in
export function renderNav() {
    const currentUser = getCurrentUser();
    let links = "";

    if (!currentUser) {
        links += `<a href="/login" data-link>Hra</a>`;
        links += `<a href="/score" data-link>Skóre</a>`;
        links += `<a href="/controls" data-link>Ovládání</a>`;
    } else {
        links += `<a href="/game" data-link>Hra</a>`;
        links += `<a href="/score" data-link>Skóre</a>`;
        links += `<a href="/controls" data-link>Ovládání</a>`;
        links += `<a href="/login" data-link data-logout="true">Odhlásit se</a>`;
    }

  
    nav.innerHTML = links;

    const currentPath = window.location.pathname;
    const allLinks = nav.querySelectorAll("a");

    allLinks.forEach(link => {
        const href = link.getAttribute("href");
        link.classList.toggle("active", href === currentPath);
    });

    
}

function createBRLogo() {

  // Tryying to make "GTA V" style logo with "B" and "R" letters

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");


    svg.setAttribute("width", "200");
    svg.setAttribute("height", "150");
    svg.setAttribute("viewBox", "0 0 200 150");

    // B path
    const pathB = document.createElementNS(svgNS, "path");

    pathB.setAttribute("d", `M 20 30 L 20 130 L 60 130 C 90 130, 90 90, 60 80 L 20 80 L 60 80 C 90 80, 90 40, 60 30 L 20 30 Z`);
    pathB.setAttribute("fill", "aqua");
    pathB.setAttribute("stroke", "pink");
    pathB.setAttribute("stroke-width", "3");
 
    // R path
    const pathR = document.createElementNS(svgNS, "path");
    pathR.setAttribute("d", `M 110 30 L 110 130 L 140 130 L 140 90 C 140 70, 160 70, 160 50 C 160 30, 140 30, 140 30 L 110 30 Z M 140 90 L 180 130 L 150 130 L 140 110 Z`);
    pathR.setAttribute("fill", "aqua");
    pathR.setAttribute("stroke", "pink");
    pathR.setAttribute("stroke-width", "3");

    svg.appendChild(pathB);
    svg.appendChild(pathR);

    document.getElementById("logo-container").appendChild(svg);

}

window.addEventListener("DOMContentLoaded", createBRLogo);




