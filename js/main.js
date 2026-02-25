/**
 * PCD Investment Partners — Main JavaScript
 * Vanilla JS, no dependencies
 */
(function () {
    'use strict';

    /* ============================================
       HEADER SCROLL EFFECT
       ============================================ */
    const header = document.getElementById('site-header');
    let lastScrollY = 0;

    function handleHeaderScroll() {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScrollY = scrollY;
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll(); // run on load

    /* ============================================
       MOBILE MENU TOGGLE
       ============================================ */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function () {
            const isOpen = mobileMenu.classList.contains('open');

            if (isOpen) {
                mobileMenu.classList.remove('open');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.setAttribute('aria-label', 'Menu openen');
            } else {
                mobileMenu.classList.remove('hidden');
                // Force reflow before adding open class for transition
                mobileMenu.offsetHeight;
                mobileMenu.classList.add('open');
                mobileMenuBtn.classList.add('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
                mobileMenuBtn.setAttribute('aria-label', 'Menu sluiten');
            }
        });
    }

    /* ============================================
       MOBILE DROPDOWN TOGGLES
       ============================================ */
    const mobileDropdownBtns = document.querySelectorAll('.mobile-dropdown-btn');

    mobileDropdownBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const content = btn.nextElementSibling;
            const isOpen = content.classList.contains('open');

            // Close all other mobile dropdowns
            mobileDropdownBtns.forEach(function (otherBtn) {
                const otherContent = otherBtn.nextElementSibling;
                if (otherContent !== content) {
                    otherContent.classList.remove('open');
                    otherContent.classList.add('hidden');
                    otherBtn.classList.remove('active');
                }
            });

            if (isOpen) {
                content.classList.remove('open');
                content.classList.add('hidden');
                btn.classList.remove('active');
            } else {
                content.classList.remove('hidden');
                content.offsetHeight; // reflow
                content.classList.add('open');
                btn.classList.add('active');
            }
        });
    });

    /* ============================================
       FAQ ACCORDION
       ============================================ */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');

        if (!trigger || !content) return;

        trigger.addEventListener('click', function () {
            const isActive = item.classList.contains('active');

            // Close all FAQ items (one-open-at-a-time)
            faqItems.forEach(function (otherItem) {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
                    var otherContent = otherItem.querySelector('.faq-content');
                    otherContent.classList.remove('open');
                    otherContent.classList.add('hidden');
                }
            });

            if (isActive) {
                item.classList.remove('active');
                trigger.setAttribute('aria-expanded', 'false');
                content.classList.remove('open');
                content.classList.add('hidden');
            } else {
                item.classList.add('active');
                trigger.setAttribute('aria-expanded', 'true');
                content.classList.remove('hidden');
                content.offsetHeight; // reflow
                content.classList.add('open');
            }
        });
    });

    /* ============================================
       SCROLL-TRIGGERED ANIMATIONS (IntersectionObserver)
       ============================================ */
    if ('IntersectionObserver' in window) {
        var animatedElements = document.querySelectorAll('.fade-in-up');

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        // Fallback: show everything immediately
        document.querySelectorAll('.fade-in-up').forEach(function (el) {
            el.classList.add('visible');
        });
    }

    /* ============================================
       ANIMATED STAT COUNTERS (IntersectionObserver)
       ============================================ */
    if ('IntersectionObserver' in window) {
        var counters = document.querySelectorAll('.stat-counter');

        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        counters.forEach(function (counter) {
            counterObserver.observe(counter);
        });
    }

    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-target'), 10);
        if (isNaN(target)) return;

        var duration = 2000; // ms
        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);

            // Ease out cubic
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.round(eased * target);

            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target;
            }
        }

        requestAnimationFrame(step);
    }

    /* ============================================
       SMOOTH SCROLL FOR ANCHOR LINKS
       ============================================ */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                var headerHeight = header ? header.offsetHeight : 0;
                var targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (mobileMenu && mobileMenu.classList.contains('open')) {
                    mobileMenu.classList.remove('open');
                    mobileMenuBtn.classList.remove('active');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    /* ============================================
       CLOSE MOBILE MENU ON RESIZE TO DESKTOP
       ============================================ */
    var mediaQuery = window.matchMedia('(min-width: 1024px)');

    function handleResize(e) {
        if (e.matches && mobileMenu && mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    }

    mediaQuery.addEventListener('change', handleResize);

})();
