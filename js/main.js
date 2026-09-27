document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    body.classList.remove("theme-preload");
    body.classList.add("js-enabled");

    // Element References
    const themeToggle = document.getElementById("theme-toggle");
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
    const siteNav = document.getElementById("site-nav");
    const profileImage = document.getElementById("profile-image");
    const scrollProgressFill = document.querySelector(".scroll-progress-fill");
    const atelierThread = document.querySelector(".atelier-thread");
    const atelierThreadNumber = document.getElementById("atelier-thread-number");
    const atelierThreadNote = document.getElementById("atelier-thread-note");
    const atelierThreadProgress = document.getElementById("atelier-thread-progress");

    // Theme Setup
    const THEME_KEY = "little-atelier-theme";

    function getSavedTheme() {
        try {
            return localStorage.getItem(THEME_KEY);
        } catch (error) {
            return null;
        }
    }

    function saveTheme(theme) {
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch (error) {
            return;
        }
    }

    function updateThemeColor(theme) {
        const themeColor = document.querySelector('meta[name="theme-color"]');
        if (!themeColor) return;
        themeColor.setAttribute("content", theme === "dark" ? "#171314" : "#f8f0f1");
    }

    function updateThemeButton(theme) {
        if (!themeToggle) return;
        const isDark = theme === "dark";
        themeToggle.setAttribute("aria-pressed", String(isDark));
        themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    }

    function applyTheme(theme, shouldSave = true) {
        const normalizedTheme = theme === "dark" ? "dark" : "light";
        body.setAttribute("data-theme", normalizedTheme);
        updateThemeButton(normalizedTheme);
        updateThemeColor(normalizedTheme);
        if (shouldSave) {
            saveTheme(normalizedTheme);
        }
    }

    const savedTheme = getSavedTheme();
    if (savedTheme === "dark" || savedTheme === "light") {
        applyTheme(savedTheme, false);
    } else {
        applyTheme("light", false);
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const currentTheme = body.getAttribute("data-theme") || "light";
            const nextTheme = currentTheme === "dark" ? "light" : "dark";
            applyTheme(nextTheme);
        });
    }

    // Mobile Navigation
    function openMobileMenu() {
        if (!siteNav || !mobileMenuToggle) return;
        siteNav.classList.add("is-open");
        mobileMenuToggle.classList.add("is-open");
        mobileMenuToggle.setAttribute("aria-expanded", "true");
        mobileMenuToggle.setAttribute("aria-label", "Close navigation");
    }

    function closeMobileMenu() {
        if (!siteNav || !mobileMenuToggle) return;
        siteNav.classList.remove("is-open");
        mobileMenuToggle.classList.remove("is-open");
        mobileMenuToggle.setAttribute("aria-expanded", "false");
        mobileMenuToggle.setAttribute("aria-label", "Open navigation");
    }

    if (mobileMenuToggle && siteNav) {
        mobileMenuToggle.addEventListener("click", () => {
            const isOpen = siteNav.classList.contains("is-open");
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        siteNav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                closeMobileMenu();
            });
        });
    }

    document.addEventListener("click", (event) => {
        if (!siteNav || !mobileMenuToggle) return;
        const clickedInsideNav = siteNav.contains(event.target);
        const clickedToggle = mobileMenuToggle.contains(event.target);
        if (!clickedInsideNav && !clickedToggle) {
            closeMobileMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) {
            closeMobileMenu();
        }
    });

    // Page Detection
    const currentPage = window.location.pathname.split("/").pop().toLowerCase();
    const isHomePage = currentPage === "" || currentPage === "index.html";
    const isProjectsPage = currentPage === "projects.html";
    const isContactPage = currentPage === "contact.html";
    const isProjectDetailsPage = currentPage === "project-details.html";

    // Navigation Active States
    const navLinks = document.querySelectorAll(".nav-link");

    function clearActiveNav() {
        navLinks.forEach((link) => {
            link.classList.remove("is-active");
        });
    }

    const sectionToNav = {
        home: "home",
        work: "work",
        about: "about",
        learning: "about",
        process: "about"
    };

    function setActiveNav(sectionId) {
        if (!navLinks.length) return;
        clearActiveNav();
        const navTarget = sectionToNav[sectionId];
        if (!navTarget) return;

        navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            if (!href) return;
            if (isHomePage && href.endsWith(`#${navTarget}`)) {
                link.classList.add("is-active");
            }
        });
    }

    function setPageNav(page) {
        clearActiveNav();
        navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            if (!href) return;
            if (page === "projects" && href === "projects.html") {
                link.classList.add("is-active");
            }
            if (page === "contact" && href === "contact.html") {
                link.classList.add("is-active");
            }
            if (page === "work" && href === "index.html#work") {
                link.classList.add("is-active");
            }
        });
    }

    if (isProjectsPage) setPageNav("projects");
    if (isContactPage) setPageNav("contact");
    if (isProjectDetailsPage) setPageNav("projects");

    // Home Page Section Tracking
    const scrollSections = Array.from(document.querySelectorAll("[data-scroll-section]"));
    let activeSectionIndex = 0;

    function updateActiveHomeSection(index) {
        if (!isHomePage) return;
        if (!scrollSections[index]) return;
        activeSectionIndex = index;
        const section = scrollSections[index];
        if (section.id) {
            setActiveNav(section.id);
        }
    }

    function determineActiveHomeSection() {
        if (!isHomePage || !scrollSections.length) return;
        const viewportCenter = window.innerHeight / 2;
        let closestIndex = 0;
        let closestDistance = Number.POSITIVE_INFINITY;

        scrollSections.forEach((section, index) => {
            const rectangle = section.getBoundingClientRect();
            const sectionCenter = rectangle.top + rectangle.height / 2;
            const distance = Math.abs(sectionCenter - viewportCenter);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });

        updateActiveHomeSection(closestIndex);
    }

    if (isHomePage) determineActiveHomeSection();

    // Scroll Progress
    function updateScrollProgress() {
        if (!scrollProgressFill) return;
        const documentHeight = document.documentElement.scrollHeight;
        const viewportHeight = window.innerHeight;
        const scrollableHeight = documentHeight - viewportHeight;

        if (scrollableHeight <= 0) {
            scrollProgressFill.style.width = "0%";
            return;
        }

        const percentage = (window.scrollY / scrollableHeight) * 100;
        const clampedPercentage = Math.min(100, Math.max(0, percentage));
        scrollProgressFill.style.width = `${clampedPercentage}%`;
    }

    // Atelier Thread Tracking
    function updateAtelierThread(index) {
        if (!atelierThread || !atelierThreadNumber || !atelierThreadNote || !scrollSections.length) return;
        const section = scrollSections[index];
        if (!section) return;

        const number = String(index + 1).padStart(2, "0");
        const note = section.dataset.scrollNote || "Keep Building.";

        atelierThreadNumber.textContent = number;
        atelierThreadNote.style.opacity = "0";

        window.setTimeout(() => {
            atelierThreadNote.textContent = note;
            atelierThreadNote.style.opacity = "1";
        }, 100);

        if (atelierThreadProgress) {
            const maximum = Math.max(scrollSections.length - 1, 1);
            const progress = (index / maximum) * 100;
            atelierThreadProgress.style.height = `${progress}%`;
        }
    }

    function updateAtelierThreadFromScroll() {
        if (!scrollSections.length) return;
        const viewportCenter = window.innerHeight / 2;
        let closestIndex = 0;
        let closestDistance = Number.POSITIVE_INFINITY;

        scrollSections.forEach((section, index) => {
            const rectangle = section.getBoundingClientRect();
            const sectionCenter = rectangle.top + rectangle.height / 2;
            const distance = Math.abs(sectionCenter - viewportCenter);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });
        updateAtelierThread(closestIndex);
    }

    if (scrollSections.length) updateAtelierThread(0);

    // Reveal Animations
    const isStaticEntryPage = body.classList.contains("page-projects") || body.classList.contains("page-contact");
    const revealSelectors = [
        ".project-card", ".work-item", ".about-introduction", ".journey-item",
        ".skill-group", ".learning-content", ".process-card", ".contact-preview-content",
        ".closing-content", ".project-detail-overview-item", ".case-study-process-item",
        ".project-detail-list-item", ".stack-item", ".lesson-item", ".project-archive-note"
    ];

    if (!isStaticEntryPage) {
        revealSelectors.forEach((selector) => {
            document.querySelectorAll(selector).forEach((element) => {
                element.setAttribute("data-reveal", "");
            });
        });
    }

    const revealElements = document.querySelectorAll("[data-reveal]");

    if (!isStaticEntryPage && "IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });
    }

    // Portrait Fallback
    if (profileImage) {
        const placeholder = document.querySelector(".portrait-placeholder");
        profileImage.addEventListener("error", () => {
            profileImage.style.display = "none";
            if (placeholder) placeholder.style.display = "grid";
        });

        profileImage.addEventListener("load", () => {
            profileImage.style.display = "block";
            if (placeholder) placeholder.style.display = "none";
        });

        if (profileImage.complete && profileImage.naturalWidth === 0) {
            profileImage.style.display = "none";
            if (placeholder) placeholder.style.display = "grid";
        }
    }

    // Project Filtering
    const filterButtons = document.querySelectorAll(".filter-button");
    const projectCards = document.querySelectorAll(".project-card");
    const projectEmptyState = document.getElementById("project-empty-state");

    if (filterButtons.length && projectCards.length) {
        filterButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const filter = button.dataset.filter || "all";

                filterButtons.forEach((item) => {
                    item.classList.toggle("is-active", item === button);
                });

                let visibleCount = 0;
                projectCards.forEach((card) => {
                    const categories = (card.dataset.category || "").toLowerCase().split(/\s+/).filter(Boolean);
                    const matches = filter === "all" || categories.includes(filter.toLowerCase());

                    if (matches) {
                        card.style.display = "";
                        card.setAttribute("aria-hidden", "false");
                        visibleCount++;
                    } else {
                        card.style.display = "none";
                        card.setAttribute("aria-hidden", "true");
                    }
                });

                if (projectEmptyState) {
                    projectEmptyState.hidden = visibleCount !== 0;
                }
            });
        });
    }

    // Internal Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");
            if (!href || href === "#") return;
            const target = document.querySelector(href);
            if (!target) return;

            event.preventDefault();
            const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

            target.scrollIntoView({
                behavior: prefersReducedMotion ? "auto" : "smooth",
                block: "start"
            });
            window.history.pushState(null, "", href);
        });
    });

    // Scroll Event handling
    let ticking = false;
    function handleScroll() {
        if (ticking) return;
        window.requestAnimationFrame(() => {
            updateScrollProgress();
            if (isHomePage) determineActiveHomeSection();
            updateAtelierThreadFromScroll();
            ticking = false;
        });
        ticking = true;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", () => {
        updateScrollProgress();
        if (isHomePage) determineActiveHomeSection();
        updateAtelierThreadFromScroll();
    });

    updateScrollProgress();

    // Hash / Page Load Position
    window.addEventListener("hashchange", () => {
        if (!isHomePage) return;
        window.setTimeout(() => {
            determineActiveHomeSection();
            updateAtelierThreadFromScroll();
        }, 100);
    });

    // Contact Form submission handling
    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const submitButton = contactForm.querySelector(".form-submit");
            if (!submitButton) return;
            const buttonText = submitButton.querySelector("span");
            if (!buttonText) return;

            const originalText = buttonText.textContent;
            submitButton.disabled = true;
            buttonText.textContent = "Message Ready";

            window.setTimeout(() => {
                buttonText.textContent = originalText;
                submitButton.disabled = false;
            }, 1800);
        });
    }

    // Placeholder Links
    document.querySelectorAll('a[href="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
        });
    });
});