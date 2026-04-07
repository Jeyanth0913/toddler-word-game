const wordFamilies = {
    "AR": ["CAR", "BAR", "JAR", "FAR", "TAR"],
    "AP": ["MAP", "TAP", "CAP", "LAP", "GAP"],
    "EN": ["TEN", "PEN", "HEN", "MEN", "DEN"],
    "AN": ["CAN", "PAN", "FAN", "MAN", "VAN"],
    "IT": ["BIT", "FIT", "SIT", "HIT", "PIT"],
    "IG": ["BIG", "PIG", "DIG", "WIG", "FIG"],
    "OT": ["HOT", "POT", "DOT", "NOT", "LOT"],
    "AT": ["CAT", "MAT", "PAT", "RAT", "SAT"],
    "OG": ["DOG", "LOG", "FOG", "HOG", "JOG"],
    "ET": ["NET", "JET", "WET", "PET", "SET"],
    "IP": ["LIP", "ZIP", "TIP", "DIP", "HIP"],
    "UN": ["SUN", "RUN", "BUN", "GUN", "FUN"],
    "UB": ["TUB", "SUB", "RUB", "HUB", "CUB"],
    "OP": ["MOP", "TOP", "HOP", "POP", "COP"],
    "AD": ["SAD", "MAD", "DAD", "BAD", "PAD"]
};

let words = [];
for (let suffix in wordFamilies) { words.push(...wordFamilies[suffix]); }
let currentIndex = 0;
const colors = ["#FF5757", "#5271FF", "#00C2CB", "#FF914D", "#7ED957", "#8C52FF"];

let starsEarned = 0;
let completedFamilies = []; // This will store ["AR", "AP", etc.]

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
    void wordElement.offsetWidth; // Trigger reflow

    // Build interactive letters
    for (let char of currentWord) {
        const span = document.createElement("span");
        span.innerText = char;
        span.style.textDecoration = "none";
        span.onclick = (e) => {
            e.stopPropagation();
            const utter = new SpeechSynthesisUtterance(char.toLowerCase());
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

function speakWord() {
    const word = words[currentIndex];
    window.speechSynthesis.cancel();

    for (let char of word) {
        const utter = new SpeechSynthesisUtterance(char.toLowerCase()); 
        utter.rate = 0.9; 
        utter.lang = 'en-US';
        window.speechSynthesis.speak(utter);
    }

    const fullUtter = new SpeechSynthesisUtterance(word.toLowerCase());
    fullUtter.rate = 0.7; 
    fullUtter.lang = 'en-US';
    window.speechSynthesis.speak(fullUtter);
}

function nextWord() {
    const currentFamily = words[currentIndex].substring(1);
    currentIndex = (currentIndex + 1) % words.length;
    const newFamily = words[currentIndex].substring(1);
    
    // Only add a star if the family changed AND she hasn't finished it yet
    if (currentFamily !== newFamily && !completedFamilies.includes(currentFamily)) {
        completedFamilies.push(currentFamily); // Mark this family as "Done"
        addStar();
    }

    updateDisplay();
    startCelebration();
}

function prevWord() {
    currentIndex = (currentIndex - 1 + words.length) % words.length;
    updateDisplay();
}

function addStar() {
    starsEarned++;
    const container = document.getElementById("star-container");
    const star = document.createElement("span");
    star.innerHTML = "⭐";
    star.className = "star-pop";
    
    if (starsEarned % 5 === 0) {
        star.innerHTML = "🏆";
        star.classList.add("trophy-animation");
    }
    
    container.appendChild(star);
    
    const praise = new SpeechSynthesisUtterance("You earned a star! Great job!");
    praise.rate = 0.9;
    window.speechSynthesis.speak(praise);
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

document.addEventListener('keydown', (e) => {
    if (e.key === "ArrowRight") nextWord();
    if (e.key === "ArrowLeft") prevWord();
    if (e.key === " ") speakWord();
});