// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const supportiveLines = [
    "Your perspective on things is consistently the most interesting part of my day.",
    "I've always admired how you handle the world, but even you deserve a world that handles you gently sometimes.",
    "If I could give you one thing, it would be the ability to see yourself through the eyes of the people who truly value you.",
    "You have a way of making the complicated feel simple, and the ordinary feel special.",
    "Your intelligence is far more attractive than just your smile, but I'll admit—the combination is quite lethal.",
    "I realized that any moment where you can just be yourself is the best version of that moment.",
    "They say a conversation with the right person can solve anything. You've certainly proved that theory correct for me."
];

const songs = [
    { title: "DARKHAAST", file: "DARKHAAST.mp3" },
    { title: "Voh Dekhnay Mein", file: "Voh Dekhnay Mein.mp3" },
    { title: "Raabta", file: "Raabta (Kehte Hain Khuda).mp3" }
];

const audio = document.getElementById("main-audio");

function playSpecificSong(index) {
    const song = songs[index];
    audio.src = song.file;
    audio.play();

    // Smooth scroll to music if not in view
    document.getElementById('music').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

const messagePara = "Gauri, I know today hasn't been easy for you. Sometimes the weight of everything can feel disproportionately heavy, and it's okay to acknowledge that. I wanted to create this space for you—not just to distract you, but to serve as a quiet reminder of the grace and resilience you carry, even when you aren't trying to. You don't always have to be at your best to be remarkable. Take a moment for yourself here, breathe, and remember that this day is just a single leaf in a very long and beautiful chapter. You are genuinely appreciated, more than words usually allow me to say.";

let lineIndex = 0;

// 1. Initial Timeline
const mainTL = gsap.timeline();
mainTL.from("#hero-title", { duration: 2, y: 30, opacity: 0, ease: "power3.out" })
    .from("#hero-subtitle", { duration: 1.5, y: 20, opacity: 0, ease: "power3.out" }, "-=1");

// 2. Typewriter Effect
function typeWriter(text, elementId, speed = 40) {
    let i = 0;
    const element = document.getElementById(elementId);
    if (!element) return;
    element.innerHTML = "";
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

ScrollTrigger.create({
    trigger: "#message",
    start: "top 80%",
    onEnter: () => typeWriter(messagePara, "typed-text")
});

// 3. Section Reveals
gsap.utils.toArray('.glass').forEach(section => {
    if (section.id !== "message") {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 90%",
            },
            duration: 1.5,
            y: 40,
            opacity: 0,
            ease: "power2.out"
        });
    }
});

// 4. Subtle Decorative Elements (Removing Mouse Trail as requested)
function createDecor() {
    const symbols = ['🌻', '🌻', '🌸', '✨', '🍃', '🌻'];
    for (let i = 0; i < 15; i++) {
        const span = document.createElement("span");
        span.className = "floating-leaf";
        span.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        span.style.left = Math.random() * 100 + "vw";
        span.style.top = Math.random() * 100 + "vh";
        span.style.fontSize = (Math.random() * 1.5 + 1) + "rem";
        span.style.opacity = Math.random() * 0.3 + 0.1;
        span.style.position = "fixed";
        span.style.pointerEvents = "none";
        span.style.zIndex = "-1";
        document.body.appendChild(span);

        gsap.to(span, {
            y: "+=100",
            x: "+=50",
            rotation: Math.random() * 360,
            duration: Math.random() * 5 + 5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
}
createDecor();

// 5. Compliments Logic
function nextPickUpLine() {
    const display = document.getElementById("line-display");
    gsap.to(display, {
        y: -10,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
            lineIndex = (lineIndex + 1) % supportiveLines.length;
            display.innerText = `"${supportiveLines[lineIndex]}"`;
            gsap.fromTo(display,
                { y: 10, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
            );
        }
    });
}

// 6. Sunflower/Heart Game Logic
let score = 0;
let gameActive = false;
let gameInterval;

function startGame() {
    if (gameActive) return;
    gameActive = true;
    score = 0;
    document.getElementById("score").innerText = "Score: " + score;
    const canvas = document.getElementById("game-canvas");
    canvas.innerHTML = "";

    gsap.to(".cute-btn[onclick='startGame()']", { opacity: 0.5, pointerEvents: "none", scale: 0.9 });

    gameInterval = setInterval(() => {
        if (!gameActive) return;
        createFallingItem(canvas);
    }, 600);

    setTimeout(() => {
        stopGame();
    }, 20000);
}

function stopGame() {
    gameActive = false;
    clearInterval(gameInterval);

    const alertBox = document.createElement("div");
    alertBox.className = "glass floating";
    alertBox.style.position = "fixed";
    alertBox.style.top = "50%";
    alertBox.style.left = "50%";
    alertBox.style.transform = "translate(-50%, -50%)";
    alertBox.style.padding = "3rem";
    alertBox.style.zIndex = "10000";
    alertBox.style.textAlign = "center";
    alertBox.style.borderRadius = "20px";
    alertBox.innerHTML = `
        <h3 style="font-size: 3rem; color: #5D4037;">Beautifully Done 🌻</h3>
        <p style="font-size: 1.2rem; margin: 1rem 0;">You gathered ${score} bright moments!</p>
        <p>Keep that sunlight in your pocket today.</p>
        <button class="cute-btn" onclick="this.parentElement.remove()" style="margin-top:2rem">Return to Calm ✨</button>
    `;
    document.body.appendChild(alertBox);
    gsap.from(alertBox, { scale: 0, opacity: 0, duration: 0.6, ease: "back.out(1.5)" });

    gsap.to(".cute-btn[onclick='startGame()']", { opacity: 1, pointerEvents: "auto", scale: 1 });
}

function createFallingItem(container) {
    const item = document.createElement("div");
    item.innerHTML = Math.random() > 0.4 ? "🌻" : "💖";
    item.style.position = "absolute";
    item.style.left = Math.random() * (container.offsetWidth - 40) + "px";
    item.style.top = "-50px";
    item.style.fontSize = "2.5rem";
    item.style.cursor = "pointer";
    item.style.userSelect = "none";

    const incrementScore = () => {
        score++;
        document.getElementById("score").innerText = "Score: " + score;
        gsap.to(item, {
            scale: 2,
            opacity: 0,
            duration: 0.2,
            onComplete: () => item.remove()
        });
        item.onmousedown = null;
    };

    item.onmousedown = incrementScore;
    item.ontouchstart = (e) => { e.preventDefault(); incrementScore(); };

    container.appendChild(item);

    gsap.to(item, {
        y: container.offsetHeight + 80,
        x: "+=" + (Math.random() - 0.5) * 60,
        rotation: 360,
        duration: Math.random() * 2 + 1.5,
        ease: "none",
        onComplete: () => {
            if (item.parentElement) item.remove();
        }
    });
}

function sendHug() {
    const emojis = ["🌻", "🧸", "✨", "🌸", "🤍"];
    for (let i = 0; i < 25; i++) {
        const span = document.createElement("span");
        span.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        span.style.position = "fixed";
        span.style.left = "50vw";
        span.style.top = "50vh";
        span.style.fontSize = "2rem";
        span.style.zIndex = "1000";
        span.style.pointerEvents = "none";
        document.body.appendChild(span);

        gsap.to(span, {
            y: (Math.random() - 0.5) * 800,
            x: (Math.random() - 0.5) * 800,
            rotation: Math.random() * 720,
            opacity: 0,
            scale: 0.5,
            duration: 2.5,
            ease: "expo.out",
            onComplete: () => span.remove()
        });
    }
}

// 7. Button/Card Hover Bursts (Leaving subtle bursts, but removed the global trail)
document.querySelectorAll('.cute-btn, .song-item').forEach(el => {
    el.addEventListener('mouseenter', (e) => {
        const rect = el.getBoundingClientRect();
        for (let i = 0; i < 3; i++) {
            const item = document.createElement("span");
            item.innerText = Math.random() > 0.5 ? "🌸" : "🌻";
            item.style.position = "absolute";
            item.style.left = (rect.left + window.scrollX + Math.random() * rect.width) + "px";
            item.style.top = (rect.top + window.scrollY + Math.random() * rect.height) + "px";
            item.style.fontSize = "1rem";
            item.style.pointerEvents = "none";
            item.style.zIndex = "9999";
            document.body.appendChild(item);

            gsap.to(item, {
                y: "-=" + (Math.random() * 50 + 20),
                rotation: Math.random() * 360,
                opacity: 0,
                duration: 1,
                onComplete: () => item.remove()
            });
        }
    });
});
