const wordFamilies = {
    "AR": ["CAR", "BAR", "JAR", "FAR", "TAR"],
    "AP": ["MAP", "TAP", "CAP", "LAP", "GAP"],
    "EN": ["TEN", "PEN", "HEN", "MEN", "DEN"],
    "AN": ["CAN", "PAN", "FAN", "MAN", "VAN"],
    "IT": ["BIT", "FIT", "SIT", "HIT", "PIT"],
    "IG": ["BIG", "PIG", "DIG", "WIG", "FIG"],
    "OT": ["HOT", "POT", "DOT", "NOT", "LOT"],
    "AT": ["CAT", "MAT", "PAT", "RAT", "SAT"],
    "OG": ["DOG", "LOG", "FOG", "HOG", "JOG"]
};

let words = [];
for (let suffix in wordFamilies) { words.push(...wordFamilies[suffix]); }
let currentIndex = 0;
const colors = ["#FF5757", "#5271FF", "#00C2CB", "#FF914D", "#7ED957", "#8C52FF"];

// THIS FUNCTION IS REQUIRED FOR THE OVERLAY
function startApp() {
    document.getElementById('start-overlay').style.display = 'none';
    updateDisplay();
}

function updateDisplay() {
    const wordElement = document.getElementById("word-text");
    const labelElement = document.getElementById("word-family-indicator");
    const currentWord = words[currentIndex];
    
    wordElement.innerHTML = "";
    wordElement.classList.remove("wiggle");
    void wordElement.offsetWidth; 

    for (let char of currentWord) {
        const span = document.createElement("span");
        span.innerText = char;
        span.style.textDecoration = "none";
        span.onclick = (e) => {
            e.stopPropagation();
            const utter = new SpeechSynthesisUtterance(char.toLowerCase()); // ADD .toLowerCase()
            utter.lang = 'en-US';
            window.speechSynthesis.speak(utter);
        };
        wordElement.appendChild(span);
    }
    
    const familySuffix = currentWord.substring(1);
    const colorIndex = Object.keys(wordFamilies).indexOf(familySuffix) % colors.length;
    wordElement.style.color = colors[colorIndex];
    labelElement.innerText = `-${familySuffix}`;
    
    wordElement.classList.add("wiggle");
    setTimeout(speakWord, 200);
}

// In updateDisplay, change the span.onclick:
span.onclick = (e) => {
    e.stopPropagation();
    const utter = new SpeechSynthesisUtterance(char.toLowerCase()); // ADD .toLowerCase()
    utter.lang = 'en-US';
    window.speechSynthesis.speak(utter);
};

// In speakWord, update the loop and the full word:
function speakWord() {
    const word = words[currentIndex];
    window.speechSynthesis.cancel();

    // 1. Spell letters (Lowercasing prevents "Capital...")
    for (let char of word) {
        const utter = new SpeechSynthesisUtterance(char.toLowerCase()); 
        utter.rate = 0.9; // Slightly slower as you requested
        utter.lang = 'en-US';
        window.speechSynthesis.speak(utter);
    }

    // 2. Pronounce full word
    const fullUtter = new SpeechSynthesisUtterance(word.toLowerCase());
    fullUtter.rate = 0.7; // Slower for clarity
    fullUtter.lang = 'en-US';
    window.speechSynthesis.speak(fullUtter);
}

function nextWord() {
    currentIndex = (currentIndex + 1) % words.length;
    updateDisplay();
    startCelebration();
}

function prevWord() {
    currentIndex = (currentIndex - 1 + words.length) % words.length;
    updateDisplay();
}

function startCelebration() {
    for (let i = 0; i < 40; i++) {
        const confetti = document.createElement("div");
        confetti.className = "confetti-piece";
        confetti.style.left = Math.random() * 100 + "%";
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 1.5 + 1.5) + "s";
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3000);
    }
}

// Keyboard Listeners
document.addEventListener('keydown', (e) => {
    if (e.key === "ArrowRight") nextWord();
    if (e.key === "ArrowLeft") prevWord();
    if (e.key === " ") speakWord();
});

// DO NOT call updateDisplay on window.onload. 
// The startApp() function will handle it after the user taps.