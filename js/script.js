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

// Modal content for role cards
function openExperienceModal(id) {
    const experienceDetails = {
        1: {
            title: "Jr. Java Developer",
            company: "Evoke Systems and Solutions Pvt. Ltd.",
            period: "Dec 2015 - Jan 2017 ",
            location: "Pune, Maharashtra, India · Hybrid",
            skills: "Java,Oracle DB",
            role: "</br>\n• Worked as a Jr. Java Developer contributing to scalable software development projects." +
                "</br>\n• Assisted in designing software architecture under senior guidance." +
                "</br>\n• Developed core application logic and backend components using Java." +
                "</br>\n• Collaborated closely with teammates and business owners to gather and clarify requirements." +
                "</br>\n• Participated in testing and debugging to ensure high-quality software delivery."
        },
        4: {
            title: "Software Development Consultant",
            company: "Capgemini",
            period: "Dec 2020 – May 2023",
            location: "India",
            skills: "Java 8, Spring Boot, AWS, Jenkins, Git, REST APIs, Python",
            role: "</br>\n" +
                "• Led a team of 7 developers, guiding architecture and implementation across AWS, Python, and Java.</br>" +
                "• Built cloud infrastructure from scratch using AWS services with a focus on scalability and resilience.</br>" +
                "• Designed and implemented an event-driven architecture to streamline system workflows.</br>" +
                "• Developed and enforced unit testing practices to ensure high code quality and coverage.</br>" +
                "• Mentored the team on AWS, Python, Java, and testing best practices, fostering technical growth.</br>" +
                "• Collaborated with Product Owners to define user stories and shape project delivery timelines.</br>" +
                "• Enabled data accessibility for analytics through AWS Athena and Glue, supporting data-driven insights.</br>" +
                "• Created automation tools and dashboards in Splunk for real-time monitoring and reporting.</br>" +
                "• Generated detailed reports to support operational visibility and business decision-making.</br>"

        },
        3: {
            title: "Software Developer for IBM",
            company: "Experis IT India",
            period: "Dec 2018 – Dec 2020",
            location: "Pune",
            skills: "Java, VXML, Microsoft SQL Server, REST, SOAP, Genesys",
            role: "</br>\n• Worked as a Senior Developer, implementing detailed solutions based on guidance from technical leads." +
                "</br>\n• Developed automation tools to support daily operations and reduce manual effort for support teams." +
                "</br>\n• Designed and implemented IVR workflows using VXML and Java for efficient customer interactions." +
                "</br>\n• Created Genesys IRD flows and configured Knowledge Manager for managing email-based workflows." +
                "</br>\n• Enhanced and upgraded existing systems by identifying and resolving functional flaws." +
                "</br>\n• Collaborated with cross-functional teams on Idea and Vodafone migration initiatives." +
                "</br>\n• Contributed to system testing, validating the functionality and stability of implemented designs."
        },
        2: {
            title: "Software Developer",
            company: "e-Aaria Software",
            period: "Feb 2017 – Aug 2018",
            location: "Bhosari",
            skills: "Java, AngularJS, Android SDK, SQL",
            role: "</br>\n• Single-handedly brought ERP system modules to Android, enabling mobile-first operations." +
                "</br>\n• Founded and led the Android development team to build scalable ERP-related mobile applications." +
                "</br>\n• Designed a decoupled system architecture with separate APIs, later used by Angular-based web applications." +
                "</br>\n• Gathered requirements directly from business owners and manufacturing personnel to ensure practical usability." +
                "</br>\n• Developed Android apps to handle end-to-end workflows-from order placement to invoice generation." +
                "</br>\n• Worked as a full-stack developer, modernizing front-end experiences using Angular and building supporting APIs." +
                "</br>\n• Actively contributed to UI/UX modernization to align the ERP system with current design standards."
        },
        5: {
            title: "Module Lead",
            company: "YASH Technologies",
            period: "May 2023 – Present",
            location: "Pune, Maharashtra, India · Hybrid",
            skills: "AWS, REST API, Terraform, Microservices, Java, CI/CD, Docker, Agile, Node.js",
            role: `</br>
• Spearheading modernization efforts for legacy Java systems while supporting existing codebases.</br>
• Designing and deploying scalable cloud infrastructure on AWS to enhance system reliability and performance.</br>
• Collaborating with cross-functional teams and Product Owners to gather, analyze, and refine requirements.</br>
• Acting as a self-sufficient contributor, taking full ownership of complex tasks from ideation to production delivery.</br>
• Ensuring all solutions are scalable, maintainable, and aligned with industry best practices.
`,
        }

    };

    const exp = experienceDetails[id];
    document.getElementById("modal-body").innerHTML = `
    <h2 class="modal-body-text">${exp.title} – ${exp.company}</h2class>
    <p><strong>Duration:</strong> ${exp.period}</p>
    <p><strong>Location:</strong> ${exp.location}</p>
    <p><strong>Skills:</strong> ${exp.skills}</p>
    <p><strong>Role & Responsibilities:</strong> ${exp.role}</p>
  `;
    document.getElementById("exp-modal").style.display = "block";
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
            " - mayursontale@gmail.com",
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