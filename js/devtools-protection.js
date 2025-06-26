
// Configurable action: choose 'blur', 'wipe', or 'redirect'
const DEVTOOLS_ACTION = 'wipe'; // options: 'blur', 'wipe', 'redirect'
window.addEventListener("load", () => {
    const msg = document.createElement("div");
    msg.className = "devtools-message";
    msg.innerText = "👋 Hey inspector! Keep your hands off my HTML 😆";

    // Clear body and insert only message
    document.body.innerHTML = "";
    document.body.appendChild(msg);
});


const messages = [
  "🧐 Caught you peeking under the hood!",
  "😏 Trying to hack this page? It's all bubblegum and duct tape anyway.",
  "🚫 DevTools? More like DevFools. Nice try!",
  "👀 If you find secrets here, let me know. I’m curious too!",
  "🤖 Sorry, this code is held together by memes and luck. Hands off!",
  "💣 Warning: Opening DevTools may void your warranty.",
  "🥷 Ninja mode detected. But your jutsu failed.",
  "🕵️‍♂️ That’s illegal in 43 galaxies. Close DevTools now!"
];

function isDevToolsOpen() {
    const threshold = 60;

    const devtools =
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold;

    // Additional detection using debugger timing
    let opened = false;
    const start = performance.now();
    //debugger;
    if (performance.now() - start > 50) {
        opened = true;
    }

    return devtools || opened;
}

function createExplosionEffect() {
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = 0;
    container.style.left = 0;
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.pointerEvents = "none";
    container.style.zIndex = 9998;

    for (let i = 0; i < 30; i++) {
        const emoji = document.createElement("div");
        emoji.innerText = ["💥", "💣", "🔥", "🚨"][Math.floor(Math.random() * 4)];
        emoji.style.position = "absolute";
        emoji.style.fontSize = "2rem";
        emoji.style.top = Math.random() * 100 + "%";
        emoji.style.left = Math.random() * 100 + "%";
        emoji.style.animation = "boom 1s ease-out forwards";
        container.appendChild(emoji);
    }

    document.body.appendChild(container);
    setTimeout(() => container.remove(), 1200);
}

function handleDevToolsDetection() {
    const body = document.body;
    const msgId = "devtools-warning";

    if (isDevToolsOpen()) {
        if (!document.getElementById(msgId)) {
            const msg = document.createElement("div");
            msg.className = "devtools-message";
            msg.id = msgId;
            msg.innerText = messages[Math.floor(Math.random() * messages.length)];
            document.body.appendChild(msg);
            createExplosionEffect();
        }

        if (DEVTOOLS_ACTION === "blur") {
            body.classList.add("devtools-detected");
        } else if (DEVTOOLS_ACTION === "wipe") {
            document.body.innerHTML = "<h1 style='text-align:center; color:red;'>🔒 DevTools Detected. Access Denied.</h1>";
        } else if (DEVTOOLS_ACTION === "redirect") {
            window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        }
    } else {
        body.classList.remove("devtools-detected");
        const msg = document.getElementById(msgId);
        if (msg) msg.remove();
    }
}

// Run detection early and often
document.addEventListener("DOMContentLoaded", handleDevToolsDetection);
window.addEventListener("load", handleDevToolsDetection);
setInterval(handleDevToolsDetection, 1000);
