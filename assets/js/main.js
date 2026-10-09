(function () {
    'use strict';

    // Scroll animations. Content stays visible if the AOS script fails to load.
    if (window.AOS) {
        AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60 });
    } else {
        document.querySelectorAll('[data-aos]').forEach(function (el) { el.removeAttribute('data-aos'); });
    }

    // Mobile navigation
    var burger = document.getElementById('burger');
    var nav = document.getElementById('nav');
    function setNav(open) {
        nav.classList.toggle('is-open', open);
        document.body.classList.toggle('nav-open', open);
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    if (burger && nav) {
        burger.addEventListener('click', function () { setNav(!nav.classList.contains('is-open')); });
        var navClose = document.getElementById('navClose');
        if (navClose) navClose.addEventListener('click', function () { setNav(false); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });
        document.addEventListener('click', function (e) {
            if (nav.classList.contains('is-open') && !nav.contains(e.target) && !burger.contains(e.target)) setNav(false);
        });
        window.addEventListener('resize', function () { if (window.innerWidth > 1100) setNav(false); });
    }

    // Header shadow + back-to-top button
    var header = document.getElementById('header');
    var toTop = document.getElementById('toTop');
    function onScroll() {
        var y = window.scrollY;
        if (header) header.classList.toggle('is-stuck', y > 10);
        if (toTop) toTop.classList.toggle('is-visible', y > 600);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

    // Category filters (projects, gallery)
    document.querySelectorAll('[data-filter-group]').forEach(function (group) {
        var name = group.getAttribute('data-filter-group');
        group.addEventListener('click', function (e) {
            var btn = e.target.closest('[data-filter]');
            if (!btn) return;
            group.querySelectorAll('.chip').forEach(function (c) { c.classList.toggle('is-active', c === btn); });
            var wanted = btn.getAttribute('data-filter');
            document.querySelectorAll('[data-filter-item="' + name + '"]').forEach(function (item) {
                item.classList.toggle('is-hidden', wanted !== 'all' && item.getAttribute('data-category') !== wanted);
            });
            if (window.AOS) AOS.refresh();
        });
    });

    // Welcome video: load the YouTube/Vimeo player only when the visitor presses play
    document.querySelectorAll('.video__play').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var frame = document.createElement('iframe');
            frame.src = btn.getAttribute('data-embed');
            frame.title = 'Welcome video';
            frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
            frame.allowFullscreen = true;
            btn.replaceWith(frame);
        });
    });

    // Gallery lightbox
    var box = document.getElementById('lightbox');
    if (box) {
        var img = box.querySelector('img');
        var cap = box.querySelector('figcaption');
        var current = 0;
        function items() {
            return Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]:not(.is-hidden)'));
        }
        function show(i) {
            var list = items();
            if (!list.length) return;
            current = (i + list.length) % list.length;
            img.src = list[current].getAttribute('href');
            img.alt = cap.textContent = list[current].getAttribute('data-caption') || '';
            box.hidden = false;
            document.body.style.overflow = 'hidden';
        }
        function close() {
            box.hidden = true;
            img.removeAttribute('src');
            document.body.style.overflow = '';
        }
        document.addEventListener('click', function (e) {
            var link = e.target.closest('[data-lightbox]');
            if (link) { e.preventDefault(); show(items().indexOf(link)); }
        });
        box.querySelector('.lightbox__close').addEventListener('click', close);
        box.querySelector('.lightbox__nav--prev').addEventListener('click', function () { show(current - 1); });
        box.querySelector('.lightbox__nav--next').addEventListener('click', function () { show(current + 1); });
        box.addEventListener('click', function (e) { if (e.target === box) close(); });
        document.addEventListener('keydown', function (e) {
            if (box.hidden) return;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') show(current - 1);
            if (e.key === 'ArrowRight') show(current + 1);
        });
    }
})();
