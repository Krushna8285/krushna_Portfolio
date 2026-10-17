/**
 * KRUSHNA RATHOD - PORTFOLIO INTERACTION ENGINE
 * Clean, lightweight, high-performance vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. DYNAMIC TYPING EFFECT
  const typingElement = document.getElementById('typingText');
  const typingPhrases = [
    'Python Full Stack Developer',
    'Autonomous RAG AI Engineer',
    'FastAPI & React Developer',
    'ChromaDB & Vector Search Specialist',
    'LangChain & Llama 3.2 Specialist'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let speed = 90;

  function typeEffect() {
    if (!typingElement) return;

    const currentPhrase = typingPhrases[phraseIndex];
    if (isDeleting) {
      typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      speed = 35;
    } else {
      typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      speed = 90;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      speed = 1800; // Pause when phrase is complete
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % typingPhrases.length;
      speed = 400; // Pause before new phrase
    }

    setTimeout(typeEffect, speed);
  }
  typeEffect();

  // 2. THEME SWITCHER (DARK / LIGHT)
  const themeToggle = document.getElementById('themeToggle');
  const htmlRoot = document.documentElement;
  const savedTheme = localStorage.getItem('krushna_theme_clean') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const active = htmlRoot.getAttribute('data-theme');
      const next = active === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', next);
      localStorage.setItem('krushna_theme_clean', next);
    });
  }

  // 3. MOBILE MENU TOGGLE
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // 4. ACTIVE NAVIGATION LINK ON SCROLL
  const trackedSections = document.querySelectorAll('section[id]');
  function updateActiveNav() {
    const scrollPos = window.pageYOffset + 140;

    trackedSections.forEach(sec => {
      const secHeight = sec.offsetHeight;
      const secTop = sec.offsetTop;
      const secId = sec.getAttribute('id');
      const targetNav = document.querySelector(`.nav-link[href*="${secId}"]`);

      if (scrollPos >= secTop && scrollPos < secTop + secHeight) {
        if (targetNav) targetNav.classList.add('active');
      } else {
        if (targetNav) targetNav.classList.remove('active');
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav);

  // 5. ANIMATE PROGRAMMING LANGUAGE LEVEL BARS ON SCROLL
  const langBars = document.querySelectorAll('.lang-bar-fill');
  let langAnimated = false;

  function animateLangBars() {
    const langSection = document.querySelector('.languages-section');
    if (!langSection) return;

    const rect = langSection.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.85 && !langAnimated) {
      langAnimated = true;
      langBars.forEach(bar => {
        const level = bar.style.getPropertyValue('--level');
        bar.style.width = level;
      });
    }
  }
  window.addEventListener('scroll', animateLangBars);
  animateLangBars();

  // 6. RAG LIVE CHAT SIMULATION HANDLER
  const demoChatBody = document.getElementById('demoChatBody');
  const demoInput = document.getElementById('demoInput');
  const sampleButtons = document.querySelectorAll('.sample-btn');

  const ragAnswers = {
    'vector': 'ChromaDB persists high-dimensional embeddings generated with nomic-embed-text. When a query is received, it executes a Cosine Similarity Search to retrieve top-k (k=3) relevant passage chunks within 45ms.',
    'llm': 'The system runs Meta Llama 3.2 (1B/3B parameters) locally via Ollama. It receives the prompt injected with strict contextual bounds so it answers without any hallucination.',
    'fastapi': 'FastAPI provides the asynchronous REST API layer (POST /chat) with CORS middleware, validating input through Pydantic and streaming answers smoothly to the React frontend.',
    'default': 'Krushna built this RAG system using LangChain, ChromaDB, FastAPI, and Llama 3.2 to ground LLM answers strictly on uploaded PDF documentation with verified citations.'
  };

  window.handleDemoQuery = function(e) {
    if (e) e.preventDefault();
    const query = demoInput.value.trim();
    if (!query) return;

    // Append user message
    const userBubble = document.createElement('div');
    userBubble.className = 'demo-msg user-msg';
    userBubble.innerHTML = `<div class="msg-author"><i class="fa-solid fa-user"></i> You</div><div>${query}</div>`;
    demoChatBody.appendChild(userBubble);
    demoInput.value = '';

    // Show bot thinking state
    const botBubble = document.createElement('div');
    botBubble.className = 'demo-msg bot-msg';
    botBubble.innerHTML = `<div class="msg-author"><i class="fa-solid fa-spinner fa-spin"></i> Assistant</div><div>Searching ChromaDB vector store...</div>`;
    demoChatBody.appendChild(botBubble);
    demoChatBody.scrollTop = demoChatBody.scrollHeight;

    // Simulate response delay
    setTimeout(() => {
      let ans = ragAnswers['default'];
      const q = query.toLowerCase();

      if (q.includes('vector') || q.includes('chroma') || q.includes('search')) {
        ans = ragAnswers['vector'];
      } else if (q.includes('llm') || q.includes('model') || q.includes('llama')) {
        ans = ragAnswers['llm'];
      } else if (q.includes('fastapi') || q.includes('react') || q.includes('connect')) {
        ans = ragAnswers['fastapi'];
      }

      botBubble.innerHTML = `<div class="msg-author"><i class="fa-solid fa-robot"></i> RAG AI Assistant (Llama 3.2)</div><div>${ans}</div>`;
      demoChatBody.scrollTop = demoChatBody.scrollHeight;
    }, 650);
  };

  sampleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-query');
      demoInput.value = q;
      handleDemoQuery();
    });
  });

  // 7. PROJECT DETAILS MODAL
  const projectModal = document.getElementById('projectModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBody = document.getElementById('modalBody');

  const projectData = {
    'rag-system': {
      title: 'Offline RAG System & AI Knowledge Assistant',
      tag: 'MAIN FLAGSHIP PROJECT &bull; GENERATIVE AI &amp; FULL-STACK',
      overview: 'An autonomous Retrieval-Augmented Generation (RAG) platform that converts PDF technical manuals into vector embeddings, stores them in ChromaDB, and performs context-grounded Q&A using Llama 3.2 via Ollama and FastAPI.',
      features: [
        'Document Ingestion: PyPDFLoader parsing of complex multi-page manuals.',
        'Semantic Chunking: RecursiveCharacterTextSplitter with 500-token chunk size and 50-token overlap.',
        'Vector Embeddings: Dense vectors generated via nomic-embed-text.',
        'Persistent Vector Store: ChromaDB integration with sub-50ms cosine similarity retrieval.',
        'Asynchronous Backend: FastAPI REST service with Pydantic validation and CORS support.',
        'Modern Frontend: React + Vite responsive chat UI with message history.'
      ],
      impact: 'Eliminates LLM hallucination and accelerates manual technical document search by over 90%.',
      tech: 'Python 3.12, FastAPI, LangChain, ChromaDB, Llama 3.2, Ollama, React, Vite, JavaScript',
      github: 'https://github.com/Krushna8285'
    },
    'employee-mgmt': {
      title: 'Enterprise Employee Management System',
      tag: 'PYTHON FULL-STACK WEB APPLICATION',
      overview: 'Full-featured web portal designed to centralize staff directories, departmental assignments, attendance logging, and salary adjustments.',
      features: [
        'Python Flask Backend: Structured MVC architecture with session-based authentication.',
        'Relational Database: Normalized MySQL tables with foreign keys and secure parameterized queries.',
        'CRUD Operations: Seamless addition, updating, deletion, and search of personnel records.',
        'Responsive Interface: Modern dashboard with attendance logs and role-based views.'
      ],
      impact: 'Centralized manual spreadsheet tracking, saving administrative teams over 60% of daily record-keeping time.',
      tech: 'Python, Flask, MySQL, HTML5, CSS3, JavaScript, Git',
      github: 'https://github.com/Krushna8285'
    },
    'student-mgmt': {
      title: 'Student Management System',
      tag: 'PYTHON OOP &bull; CRUD APPLICATION',
      overview: 'A Python application that manages student records using object-oriented programming, keeping student data and the operations on it in separate, reusable classes.',
      features: [
        'Object-Oriented Design: Classes and methods model students and the actions performed on them.',
        'CRUD Operations: Add, view, update, delete and search student records.',
        'Clean Structure: Logic separated from the menu/interface so features are easy to extend.'
      ],
      impact: 'Practical project that strengthened my Python OOP fundamentals and structured-code habits.',
      tech: 'Python, OOP, Git',
      github: 'https://github.com/Krushna8285'
    },
    'loan-prediction': {
      title: 'Loan Approval Predictive Intelligence System',
      tag: 'MACHINE LEARNING &amp; EXPLORATORY DATA ANALYSIS',
      overview: 'Predictive classification model developed in Python to evaluate customer creditworthiness across 500+ financial records.',
      features: [
        'Data Cleaning: Imputation of missing values, outlier treatment, and feature normalization.',
        'Exploratory Data Analysis: Correlation matrices and demographic distribution analysis with Matplotlib & Seaborn.',
        'Model Training: Benchmarked Logistic Regression and Decision Trees with hyperparameter tuning.'
      ],
      impact: 'Identified that applicant credit history and debt-to-income ratios represent over 70% of approval weight.',
      tech: 'Python, Pandas, NumPy, Scikit-Learn, Matplotlib, Seaborn',
      github: 'https://github.com/Krushna8285'
    },
    'hospital-dashboard': {
      title: 'Hospital Operations & Resource Analytics Dashboards',
      tag: 'BUSINESS INTELLIGENCE &amp; DATA MODELING',
      overview: 'Two interactive Power BI dashboards providing clinical administration executive visibility into bed occupancy, turnaround times, and staff load.',
      features: [
        'Star Schema Modeling: Clean relational relationships between patient logs, departments, and shifts.',
        'DAX KPI Formulas: Formulated measures for Average Length of Stay (ALOS) and Bed Turnover Index.',
        'Interactive Drill-Downs: Dynamic cross-filtering and time-intelligence reporting.'
      ],
      impact: 'Empowered administrators to forecast bed shortages ahead of peak hours and reallocate medical resources efficiently.',
      tech: 'Power BI, DAX, Power Query, Star Schema, Excel',
      github: 'https://github.com/Krushna8285'
    }
  };

  function openModal(projectId) {
    const p = projectData[projectId];
    if (!p) return;

    modalBody.innerHTML = `
      <span class="modal-tag">${p.tag}</span>
      <h3>${p.title}</h3>

      <div class="modal-section-title"><i class="fa-solid fa-bullseye"></i> Problem &amp; Architecture Overview</div>
      <p>${p.overview}</p>

      <div class="modal-section-title"><i class="fa-solid fa-gears"></i> Key Engineering Highlights</div>
      <ul class="modal-list">
        ${p.features.map(f => `<li>${f}</li>`).join('')}
      </ul>

      <div class="modal-section-title"><i class="fa-solid fa-chart-line"></i> Value &amp; Impact</div>
      <p>${p.impact}</p>

      <div class="modal-section-title"><i class="fa-solid fa-layer-group"></i> Technologies Used</div>
      <p><strong>${p.tech}</strong></p>

      <div class="modal-actions">
        <a href="${p.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
          <i class="fa-brands fa-github"></i> View GitHub Source
        </a>
        <a href="https://wa.me/919322576780?text=Hi%20Krushna,%20I%20reviewed%20your%20project:%20${encodeURIComponent(p.title)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
          <i class="fa-brands fa-whatsapp"></i> Chat on WhatsApp
        </a>
      </div>
    `;

    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.view-project-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const projId = btn.getAttribute('data-project');
      openModal(projId);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.classList.contains('active')) {
      closeModal();
    }
  });

  // 8. BACK TO TOP BUTTON
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    });
  }

  // 9. FOOTER YEAR
  const yearElem = document.getElementById('currentYear');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
});

// 10. CONTACT FORM SUBMISSION
function handleContactSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim() || 'Python Full Stack / RAG Engineer Inquiry';
  const message = document.getElementById('message').value.trim();
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (!name || !email || !message) {
    alert('Please fill out all required fields.');
    return;
  }

  const initialBtnHTML = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Preparing message...';
  submitBtn.disabled = true;

  const mailBody = `Hi Krushna,%0D%0A%0D%0AMy name is ${encodeURIComponent(name)} (${encodeURIComponent(email)}).%0D%0A%0D%0A${encodeURIComponent(message)}`;
  const mailUrl = `mailto:krushnanrathod123@gmail.com?subject=${encodeURIComponent(subject)}&body=${mailBody}`;

  setTimeout(() => {
    window.location.href = mailUrl;

    formStatus.className = 'form-status success';
    formStatus.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you, ${name}! Your email client has been launched with your message.`;
    formStatus.style.display = 'block';

    submitBtn.innerHTML = initialBtnHTML;
    submitBtn.disabled = false;

    document.getElementById('contactForm').reset();
  }, 600);
}
