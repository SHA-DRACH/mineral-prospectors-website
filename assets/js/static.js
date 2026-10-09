// Static copy: there is no server to receive the contact form,
// so the message is handed to WhatsApp (or the visitor's email app).
(function () {
    'use strict';
    var form = document.querySelector('form[data-static]');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = form.elements.name.value.trim();
        var email = form.elements.email.value.trim();
        var phone = form.elements.phone.value.trim();
        var message = form.elements.message.value.trim();

        var problem = '';
        if (!name) problem = 'Please enter your name.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) problem = 'Please enter a valid email address.';
        else if (message.length < 10) problem = 'Please write a message of at least 10 characters.';

        var note = form.querySelector('.alert') || document.createElement('div');
        note.setAttribute('role', 'status');
        form.insertBefore(note, form.children[1]);
        if (problem) {
            note.className = 'alert alert--error';
            note.textContent = problem;
            return;
        }

        var text = 'Website enquiry\nName: ' + name + '\nEmail: ' + email + (phone ? '\nPhone: ' + phone : '') + '\n\n' + message;
        var wa = document.querySelector('.wa-float');
        var mail = document.querySelector('.contact__list a[href^="mailto:"]');
        var target = '';
        if (wa) target = wa.href.split('?')[0] + '?text=' + encodeURIComponent(text);
        else if (mail) target = mail.href + '?subject=' + encodeURIComponent('Website enquiry from ' + name) + '&body=' + encodeURIComponent(text);

        note.className = 'alert alert--success';
        note.textContent = wa ? 'Opening WhatsApp so you can send your message…' : 'Opening your email app so you can send your message…';
        if (target) window.open(target, '_blank', 'noopener');
    });
})();
