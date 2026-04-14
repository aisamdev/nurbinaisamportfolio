/*
  CHATBOT SETUP INSTRUCTIONS:
  1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
  2. Add variable: GROQ_API_KEY = your key from console.groq.com
  3. Redeploy the project
  4. The chatbot will work on the live Vercel URL
*/

// ============================================================
// PORTFOLIO — script.js
// Chatbot uses Vercel serverless proxy (/api/chat) — no API key in frontend
// ============================================================

const SYSTEM_PROMPT = `You are Aisam Nurbin's personal AI assistant on his portfolio website.

About Aisam:
- Freelance video editor and BSIT-2B student at ZPPSU (Zamboanga Peninsula Polytechnic State University), Zamboanga del Sur, Philippines
- Skills: Short-form video editing (CapCut, DaVinci Resolve), Web Development (HTML, CSS, JavaScript, PHP, MySQL), IoT (Arduino, ESP32)
- Projects: ZPPSU Student Portal (CRUD + PHPMailer), Smart Plant Watering System (Arduino), Triple B Sol Feedback Exit System (ESP32)
- Portfolio: aisamportfolio.vercel.app | Email: mishinei.aisamn1@gmail.com
- Experience: Freelance Video Editor 2026-present, BSIT student 2024-present
- Achievement: Top 1 in Video Production at Ateneo de Zamboanga University work immersion 2023

Your behavior:
- When asked about Aisam (his skills, projects, experience, contact, availability) — answer based on the information above
- When asked general questions (technology, coding, video editing tips, AI, etc.) — answer helpfully and knowledgeably like a general assistant
- When asked casual questions (greetings, jokes, general chat) — respond in a friendly, natural way
- Always be friendly, concise, and professional
- Do NOT say you can only answer about Aisam — you can answer anything
- Keep responses under 4 sentences unless a detailed answer is truly needed
- If someone asks who you are, say: "I'm Aisam's AI assistant! I can tell you about his work, or help answer any questions you have."`;

let chatHistory = [];

async function callGroq(userMessage) {
  console.log("Sending to /api/chat proxy...");

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemPrompt: SYSTEM_PROMPT,
      messages: [
        ...chatHistory,
        { role: 'user', content: userMessage }
      ]
    })
  });

  console.log("Proxy response status:", response.status);

  const data = await response.json();

  if (!response.ok) {
    console.error("Proxy error:", data);
    throw new Error(`Request failed: ${response.status}`);
  }

  console.log("Reply received:", data);

  if (!data.reply) {
    throw new Error("No reply in response");
  }

  chatHistory.push({ role: 'user', content: userMessage });
  chatHistory.push({ role: 'assistant', content: data.reply });

  return data.reply;
}

function appendMessage(role, text) {
  const chatMessages = document.getElementById("chatMessages");
  if (!chatMessages) return;
  const bubble = document.createElement("div");
  bubble.classList.add("chat-bubble");
  if (role === "user") {
    bubble.classList.add("bubble-user");
  } else {
    bubble.classList.add("bubble-assistant");
  }
  bubble.textContent = text;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  const chatMessages = document.getElementById("chatMessages");
  if (!chatMessages) return "";
  const id = "typing-" + Date.now();
  const el = document.createElement("div");
  el.id = id;
  el.classList.add("chat-bubble", "bubble-assistant", "typing-indicator");
  el.innerHTML = "<span></span><span></span><span></span>";
  chatMessages.appendChild(el);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return id;
}

function removeTyping(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

document.addEventListener("DOMContentLoaded", () => {
  // ── Navbar scroll border ────────────────────────────────
  const siteNav = document.querySelector('.site-nav');
  window.addEventListener('scroll', () => {
    if (siteNav) {
      if (window.scrollY > 10) {
        siteNav.classList.add('scrolled');
      } else {
        siteNav.classList.remove('scrolled');
      }
    }
  });

  // ── Theme toggle ─────────────────────────────────────────
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");

  const applyTheme = (theme) => {
    const t = theme === "light" ? "light" : "dark";
    body.classList.remove("light", "dark");
    body.classList.add(t);
    if (themeToggle) {
      const label = t === "dark" ? "Switch to light mode" : "Switch to dark mode";
      themeToggle.setAttribute("aria-label", label);
      themeToggle.setAttribute("title", label);
    }
    localStorage.setItem("portfolio-theme", t);
  };

  applyTheme(localStorage.getItem("portfolio-theme") || "dark");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      applyTheme(body.classList.contains("dark") ? "light" : "dark");
    });
  }

  // ── Lucide icons ─────────────────────────────────────────
  if (typeof lucide !== "undefined") lucide.createIcons();

  // ── Skeleton loader ──────────────────────────────────────
  const skeletonTargets = document.querySelectorAll(".skeleton-target");
  skeletonTargets.forEach((t) => t.classList.add("skeleton-active"));
  setTimeout(() => skeletonTargets.forEach((t) => t.classList.remove("skeleton-active")), 1200);

  // ── Scroll animations ────────────────────────────────────
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));

  // ── Smooth scroll for anchor links ───────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // ── Gallery ──────────────────────────────────────────────
  const galleryTrack = document.getElementById("galleryTrack");
  const galleryPrev = document.getElementById("galleryPrev");
  const galleryNext = document.getElementById("galleryNext");

  const scrollGallery = (direction) => {
    if (!galleryTrack) return;
    const firstItem = galleryTrack.querySelector(".gallery-item");
    const width = firstItem ? firstItem.getBoundingClientRect().width : 280;
    galleryTrack.scrollBy({ left: direction * (width + 12), behavior: "smooth" });
  };

  if (galleryPrev) galleryPrev.addEventListener("click", () => scrollGallery(-1));
  if (galleryNext) galleryNext.addEventListener("click", () => scrollGallery(1));

  // ── Chatbot ──────────────────────────────────────────────
  const chatTrigger  = document.getElementById("chatTrigger");
  const chatPanel    = document.getElementById("chatPanel");
  const chatClose    = document.getElementById("chatClose");
  const chatForm     = document.getElementById("chatForm");
  const chatInput    = document.getElementById("chatInput");
  const chatSend     = document.getElementById("chatSend");
  const chatMessages = document.getElementById("chatMessages");

  const openChat = () => {
    if (!chatPanel) return;
    chatPanel.classList.add("open");
    chatPanel.setAttribute("aria-hidden", "false");
    setTimeout(() => { if (chatInput) chatInput.focus(); }, 120);
  };

  const closeChat = () => {
    if (!chatPanel) return;
    chatPanel.classList.remove("open");
    chatPanel.setAttribute("aria-hidden", "true");
  };

  if (chatTrigger) chatTrigger.addEventListener("click", openChat);
  if (chatClose)   chatClose.addEventListener("click", closeChat);

  document.addEventListener("click", (e) => {
    if (!chatPanel || !chatPanel.classList.contains("open")) return;
    if (chatPanel.contains(e.target) || (chatTrigger && chatTrigger.contains(e.target))) return;
    closeChat();
  });

  // Welcome message shown once on first open
  let greeted = false;
  if (chatTrigger) {
    chatTrigger.addEventListener("click", () => {
      if (!greeted) {
        greeted = true;
        setTimeout(() => {
          appendMessage("assistant", "Hi! I'm Aisam's AI assistant. Ask me anything about his skills, projects, or experience!");
        }, 300);
      }
    });
  }

  // Send message
  const sendMessage = async () => {
    if (!chatInput || !chatMessages) return;
    const text = chatInput.value.trim();
    if (!text) return;

    chatInput.value = "";
    appendMessage("user", text);

    const typingId = showTyping();

    try {
      const reply = await callGroq(text);
      removeTyping(typingId);
      appendMessage("assistant", reply);
    } catch (err) {
      removeTyping(typingId);
      console.error("Chatbot error:", err);
      appendMessage("assistant", "Sorry, I'm having trouble connecting right now. Try again!");
    }

    if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  if (chatForm) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      sendMessage();
    });
  }

  if (chatSend) {
    chatSend.addEventListener("click", (e) => {
      e.preventDefault();
      sendMessage();
    });
  }

  if (chatInput) {
    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }
});
