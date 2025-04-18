
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure the DOM is fully loaded before mounting the app
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("Root element not found!");
    return;
  }
  createRoot(rootElement).render(<App />);
});
