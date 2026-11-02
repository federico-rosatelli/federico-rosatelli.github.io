const languageColor = {
  "Python": "#3572A5",
  "Go": "#00ADD8",
  "Kotlin": "#A97BFF",
  "TypeScript": "#3178c6",
  "JavaScript": "#f1e05a",
  "Vue": "#41b883",
  "HTML": "#e34c26",
  "Jupyter Notebook": "#DA5B0B",
  "C": "#555555",
  "C++": "#f34b7d",
  "EJS": "#a91e50",
  "Assembly": "#6E4C13"
};

const fallbackRepos = [
  {
    name: "PyABD",
    html_url: "https://github.com/federico-rosatelli/PyABD",
    description: "Fast, unsupervised video action boundary detection in PyTorch via feature similarity & hierarchical clustering (CVPR 2022).",
    language: "Python",
    stargazers_count: 0,
    updated_at: "2026-03-27T10:48:16Z"
  },
  {
    name: "GeoFusion",
    html_url: "https://github.com/federico-rosatelli/GeoFusion",
    description: "Interactive platform for geometric design, SLSQP optimization, and 3D visualization of stellarator plasma boundaries.",
    language: "Python",
    stargazers_count: 0,
    updated_at: "2026-08-19T15:39:34Z"
  },
  {
    name: "vision-systems",
    html_url: "https://github.com/federico-rosatelli/vision-systems",
    description: "Flea Beetle Crop Damage Assessment using DINOv3 ViT-S/16, Multiple Instance Learning (MIL), and RF-DETR detection.",
    language: "Jupyter Notebook",
    stargazers_count: 0,
    updated_at: "2026-09-29T15:35:40Z"
  },
  {
    name: "uav-drone-path",
    html_url: "https://github.com/federico-rosatelli/uav-drone-path",
    description: "3D coordinate grid & obstacle avoidance path planning package for autonomous virtual UAV navigation.",
    language: "Python",
    stargazers_count: 4,
    updated_at: "2026-01-16T12:14:54Z"
  },
  {
    name: "Horus",
    html_url: "https://github.com/federico-rosatelli/Horus",
    description: "Saliency Detection & Environment Monitoring by UAVs via Spatiotemporal Knowledge Distillation.",
    language: "Python",
    stargazers_count: 0,
    updated_at: "2024-11-18T16:17:19Z"
  },
  {
    name: "Bio-Server",
    html_url: "https://github.com/federico-rosatelli/Bio-Server",
    description: "High-performance Go server backend for computational biology platforms.",
    language: "Go",
    stargazers_count: 0,
    updated_at: "2023-06-08T16:09:26Z"
  },
  {
    name: "Vulgaris-Platform",
    html_url: "https://github.com/federico-rosatelli/Vulgaris-Platform",
    description: "Vue.js front-end interface for interactive biological data views and tables.",
    language: "Vue",
    stargazers_count: 0,
    updated_at: "2023-06-10T17:54:04Z"
  },
  {
    name: "wasa-photo",
    html_url: "https://github.com/federico-rosatelli/wasa-photo",
    description: "Full-stack photo sharing social network backend in Go and REST API architecture.",
    language: "Go",
    stargazers_count: 0,
    updated_at: "2023-03-12T14:16:26Z"
  },
  {
    name: "centralized-botnet",
    html_url: "https://github.com/federico-rosatelli/centralized-botnet",
    description: "Distributed network security research prototype implemented in Python and Golang.",
    language: "Go",
    stargazers_count: 0,
    updated_at: "2023-06-08T16:02:14Z"
  }
];

let allRepos = [...fallbackRepos];

function renderRepos(filterText = "") {
  const container = document.getElementById("live-repos-container");
  if (!container) return;

  const query = filterText.trim().toLowerCase();
  const filtered = allRepos.filter((r) => {
    if (r.name === "federico-rosatelli.github.io") return false;
    const matchName = r.name.toLowerCase().includes(query);
    const matchDesc = (r.description || "").toLowerCase().includes(query);
    const matchLang = (r.language || "").toLowerCase().includes(query);
    return matchName || matchDesc || matchLang;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<p style="color: var(--text-secondary); grid-column: 1/-1;">No matching repositories found.</p>`;
    return;
  }

  container.innerHTML = filtered
    .slice(0, 12)
    .map((repo) => {
      const lang = repo.language || "Code";
      const color = languageColor[lang] || "#2dd4bf";
      const year = repo.updated_at ? new Date(repo.updated_at).getFullYear() : "";
      const stars = repo.stargazers_count > 0 ? `<span>★ ${repo.stargazers_count}</span>` : "";
      const desc = repo.description
        ? repo.description
        : "Open-source software & engineering repository by Federico Rosatelli.";

      return `
        <a class="live-repo-item" href="${repo.html_url}" target="_blank" rel="noopener">
          <div>
            <div class="live-repo-name">
              <span>${repo.name}</span>
              <i class="fas fa-arrow-up-right-from-square" style="font-size: 0.78rem; color: var(--text-muted);"></i>
            </div>
            <p class="live-repo-desc">${desc}</p>
          </div>
          <div class="live-repo-meta">
            <span><span class="lang-dot" style="background-color: ${color};"></span>${lang}</span>
            ${stars}
            <span>Updated ${year}</span>
          </div>
        </a>
      `;
    })
    .join("");
}

function loadGitHubData() {
  renderRepos();

  fetch("https://api.github.com/users/federico-rosatelli/repos?sort=updated&per_page=100")
    .then((res) => (res.ok ? res.json() : Promise.reject()))
    .then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        // Merge curated descriptions for repos that have empty GitHub descriptions
        const descOverrides = {
          "vision-systems": "Flea Beetle Crop Damage Assessment using DINOv3 ViT-S/16, Multiple Instance Learning (MIL), and RF-DETR (University of Bonn).",
          "wasa-photo": "Full-stack photo sharing platform written in Go and Vue.js (Sapienza Web & Software Architecture).",
          "biologia": "Computational biology data processing and analysis toolkit in Python.",
          "Os1-Bot": "Automated Telegram / Discord bot utility built in Python."
        };
        allRepos = data
          .filter((r) => !r.fork)
          .map((r) => ({
            ...r,
            description: r.description || descOverrides[r.name] || ""
          }));
        renderRepos(document.getElementById("repo-search")?.value || "");
      }
    })
    .catch(() => {
      // Keep fallbackRepos rendered
    });
}

// Project Category Filtering
function filterProjects(category, btnEl) {
  document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
  if (btnEl) btnEl.classList.add("active");

  const cards = document.querySelectorAll(".project-card");
  cards.forEach((card) => {
    const cats = (card.getAttribute("data-category") || "").split(" ");
    if (category === "all" || cats.includes(category)) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

// Language Toggle (EN / IT)
let currentLang = "en";

function toggleLanguage() {
  currentLang = currentLang === "en" ? "it" : "en";
  const btn = document.getElementById("lang-toggle-btn");
  if (btn) {
    btn.textContent = currentLang === "en" ? "IT 🇮🇹" : "EN 🇬🇧";
  }

  document.querySelectorAll("[data-en][data-it]").forEach((el) => {
    const text = el.getAttribute(`data-${currentLang}`);
    if (text) {
      el.innerHTML = text;
    }
  });
}

// Mobile Menu
function toggleMobileMenu() {
  const nav = document.getElementById("nav-links");
  if (nav) nav.classList.toggle("open");
}

// Contact Form Handler
function sendMessage() {
  const name = document.getElementById("name-form")?.value.trim();
  const email = document.getElementById("email-form")?.value.trim();
  const subject = document.getElementById("subject-form")?.value.trim() || "Portfolio Inquiry";
  const message = document.getElementById("message-form")?.value.trim();
  const feedback = document.getElementById("form-feedback");

  if (!name || !email || !message) {
    if (feedback) {
      feedback.style.display = "block";
      feedback.style.background = "rgba(239, 68, 68, 0.15)";
      feedback.style.border = "1px solid rgba(239, 68, 68, 0.4)";
      feedback.style.color = "#fca5a5";
      feedback.textContent =
        currentLang === "en"
          ? "Please fill in your Name, Email, and Message."
          : "Compila Nome, Email e Messaggio per continuare.";
    }
    return;
  }

  const mailtoSubject = encodeURIComponent(`[Portfolio] ${subject} — from ${name}`);
  const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
  window.location.href = `mailto:frosatelli@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

  if (feedback) {
    feedback.style.display = "block";
    feedback.style.background = "rgba(45, 212, 191, 0.15)";
    feedback.style.border = "1px solid rgba(45, 212, 191, 0.4)";
    feedback.style.color = "#5eead4";
    feedback.textContent =
      currentLang === "en"
        ? "Opening your email client to send the message directly to Federico!"
        : "Apertura del client email per inviare il messaggio direttamente a Federico!";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadGitHubData();

  const searchInput = document.getElementById("repo-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderRepos(e.target.value);
    });
  }

  // Close mobile menu when clicking a link
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      document.getElementById("nav-links")?.classList.remove("open");
    });
  });
});
