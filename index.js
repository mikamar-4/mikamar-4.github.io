import { router, navigateTo } from "./js/router.js";
import { showModal } from "./js/views.js";

import {
  getCurrentUser,
  loadCurrentUserFromSession
} from "./js/auth.js";

function initialize() {

  loadCurrentUserFromSession();

  // If there is no session with logged user, redirect them to the login page
  if (!getCurrentUser() && window.location.pathname !== "/login") {
    navigateTo("/login");
    return;
  }
  
  router();
};

// --- Inititialization --- SPA starts running
initialize();

// Check the onleni status

window.addEventListener('offline', () => {
  showModal('Přišli jsme o připojení k síti. Stránka nemusí fungovat správně.');
});

window.addEventListener('online', () => {
  showModal('Připojení opět získáno. Stránka by měla fungovat správně.');
});

