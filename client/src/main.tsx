import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Import buffer polyfill before any other imports that might use Buffer
import "./lib/buffer-polyfill";

// Initialize Sentry error tracking
import { initSentry } from "./lib/sentry";

// Add Google Fonts import
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap";
document.head.appendChild(link);

// Add Font Awesome
const fontAwesome = document.createElement("link");
fontAwesome.rel = "stylesheet";
fontAwesome.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";
document.head.appendChild(fontAwesome);

// Add title
const title = document.createElement("title");
title.textContent = "$CHONK9K - The Chonkpump 9000 Token";
document.head.appendChild(title);

// Initialize Sentry for error tracking
initSentry();

createRoot(document.getElementById("root")!).render(<App />);
