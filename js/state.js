// Global state management for the app
export let currentView = null;
export let lastPage = null;

export function setCurrentView(view) {
  currentView = view;
}

export function getCurrentView() {
  return currentView;
}

export function setLastPage(page) {
  lastPage = page;
}

export function getLastPage() {
  return lastPage;
}
