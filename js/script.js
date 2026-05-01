// Theme toggle
let nightMode = false;

function toggleTheme() {
    nightMode = !nightMode;
    document.documentElement.setAttribute('data-theme', nightMode ? 'night' : '');
}

// Timeline detail toggle
function toggleDetails(entry) {
    const all = document.querySelectorAll('.timeline-entry .details');
    all.forEach(el => {
        if (el !== entry.querySelector('.details')) {
            el.style.display = 'none';
        }
    });
    const details = entry.querySelector('.details');
    details.style.display = (details.style.display === 'block') ? 'none' : 'block';
}

function FunnyAlert(message = "👀 This is private bro 😄") {

    let el = document.getElementById("funny-alert");

    // create if not exists
    if (!el) {
        el = document.createElement("div");
        el.id = "funny-alert";
        el.className = "funny-alert";
        document.body.appendChild(el);
    }

    el.innerText = message;
    el.classList.add("show");

    clearTimeout(el._timeout);

    el._timeout = setTimeout(() => {
        el.classList.remove("show");
    }, 2500);
}


// Modal content for role cards
function openExperienceModal(id) {
messages = [
    "🕵️‍♂️ NDA activated!",
    "🔒 Confidential",
    "🚫 Access denied for now!.",
];

    FunnyAlert(messages[Math.floor(Math.random() * messages.length)]);
}

function closeModal() {
    document.getElementById("exp-modal").style.display = "none";
}

window.onclick = function (event) {
    const modal = document.getElementById("exp-modal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

window.addEventListener('load', () => {
    document.querySelector('.timeline-track').scrollLeft = 0;
});

// Right-click blocker
$(document).on("contextmenu", function (e) {
    e.preventDefault();
    const toast = $("#rightClickToast");
    toast.stop(true, true).fadeIn(200).delay(2000).fadeOut(400);
});

// Block dev tools access
document.addEventListener("keydown", function (e) {
    if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
        (e.ctrlKey && e.key === "U")
    ) {
        e.preventDefault();
        alert("Hello Detective !. Developer tools are off-limits 😅");
    }
});

// Hire Me modal typewriter
const HM = {
    typerInterval: null,
    isTyping: false,

    open: function () {
        const modal = document.getElementById("hm-modal");
        const output = document.getElementById("hm-output");
        modal.style.display = "flex";
        output.textContent = "";
        this.stopTyping();
        const lines = [
            "🌟 Why Mayur?",
            " - 9+ years solving real backend problems at scale.",
            " - Built and modernized systems across Java, AWS, Python & Terraform.",
            " - Known for blending logic with creativity , automation and clean code.",
            "",
            "Availability",
            " - Tentatively open from early August 2025 for exciting new journeys",
            "",
            "Location Preference",
            " - Pune / Remote / Hybrid",
            "",
            "Roles I Love",
            " - Ones that value architecture thinking, ownership, and analytical depth.",
            " - Wherever I can flex my Technical + analytical skills",
            "",
            "Let's Talk",
            " - +91 **********"
        ];

        let i = 0;
        let currentText = "";

        const typeLine = () => {
            if (i >= lines.length) {
                this.isTyping = false;
                return;
            }

            let line = lines[i] + "\n";
            let j = 0;
            this.isTyping = true;

            this.typerInterval = setInterval(() => {
                currentText += line[j];
                output.textContent = currentText;
                j++;

                if (j >= line.length) {
                    clearInterval(this.typerInterval);
                    i++;
                    setTimeout(typeLine, 400);
                }
            }, 30);
        };

        typeLine();
    },

    close: function () {
        this.stopTyping();
        document.getElementById("hm-modal").style.display = "none";
    },

    stopTyping: function () {
        if (this.typerInterval) clearInterval(this.typerInterval);
        this.isTyping = false;
    }
};

// Googly eyes
(function () {
    const eyes = document.querySelectorAll('.eye');
    const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
    const radius = 8;

    function moveEyes(x, y) {
        eyes.forEach(eye => {
            const pupil = eye.querySelector('.pupil');
            const rect = eye.getBoundingClientRect();
            const eyeCenterX = rect.left + rect.width / 2;
            const eyeCenterY = rect.top + rect.height / 2;

            const angle = Math.atan2(y - eyeCenterY, x - eyeCenterX);
            const pupilX = clamp(Math.round(radius * Math.cos(angle)), -8, 8);
            const pupilY = clamp(Math.round(radius * Math.sin(angle)), -8, 8);

            pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
        });
    }

    document.addEventListener('mousemove', (e) => {
        moveEyes(e.clientX, e.clientY);
    });

    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            moveEyes(touch.clientX, touch.clientY);
        }
    });

    document.addEventListener('mouseleave', () => {
        document.querySelectorAll('.pupil').forEach(p => {
            p.style.transform = 'translate(0, 0)';
        });
    });
})();


$(document).ready(function () {
    const $btn = $('#cv-download-btn');
    const $rect = $btn.find('.btn-glow-rect');

    function updateRectSize() {
        const padding = 4;
        const width = $btn.outerWidth() - padding;
        const height = $btn.outerHeight() - padding;

        const borderRadius = parseInt($btn.css('border-radius')) || 12;

        $rect.attr({
            x: padding / 2,
            y: padding / 2,
            width: width,
            height: height,
            rx: borderRadius,
            ry: borderRadius
        });
    }

    // Initialize and handle resize
    updateRectSize();
    $(window).on('resize', updateRectSize);

    // Animation trigger
    $btn.on('mouseenter', function () {
        $btn.removeClass('animate-reverse').addClass('animate-forward');
    });

    $btn.on('mouseleave', function () {
        $btn.removeClass('animate-forward').addClass('animate-reverse');
    });
});