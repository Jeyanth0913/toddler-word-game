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
let userAttempt = "";
let slotsFilled = 0;
let starsEarned = 0;

function startApp() {
    document.getElementById('start-overlay').style.display = 'none';
    // Small delay helps the tablet focus
    setTimeout(updateDisplay, 100);
}

function updateDisplay() {
    const currentWord = words[currentIndex].toUpperCase();
    userAttempt = "";
    slotsFilled = 0;
    
    document.getElementById("feedback-icon").innerText = "";
    
    // Reset the 3 lines
    for(let i=0; i<3; i++) {
        const slot = document.getElementById(`slot-${i}`);
        if(slot) {
            slot.innerText = "_";
            slot.style.color = "#1e293b";
        }
    }

    // Jumble the letters for the bank
    const bank = document.getElementById("letter-bank");
    bank.innerHTML = "";
    let letters = currentWord.split("");
    letters.sort(() => Math.random() - 0.5);

    letters.forEach(letter => {
        const btn = document.createElement("button");
        btn.className = "letter-piece";
        btn.innerText = letter;
        btn.onclick = () => handleLetterTap(letter, btn);
        bank.appendChild(btn);
    });

    speakWord();
}

function handleLetterTap(letter, btn) {
    if (slotsFilled < 3) {
        const utter = new SpeechSynthesisUtterance(letter.toLowerCase());
        window.speechSynthesis.speak(utter);

        document.getElementById(`slot-${slotsFilled}`).innerText = letter;
        userAttempt += letter;
        slotsFilled++;
        btn.style.visibility = "hidden";

        if (slotsFilled === 3) {
            checkWord();
        }
    }
}

function checkWord() {
    const correctWord = words[currentIndex].toUpperCase();
    const icon = document.getElementById('feedback-icon');

    if (userAttempt === correctWord) {
        icon.innerText = "✅";
        const praise = new SpeechSynthesisUtterance("Yes!" + correctWord);
        window.speechSynthesis.speak(praise);
        
        addStar();
        startCelebration();
        
        // DELETE THE setTimeout(nextWord, 3000) LINE FROM HERE
        // Now it will just stay on the finished word until the arrow is pressed
        
    } else {
        icon.innerText = "❌";
        const tryAgain = new SpeechSynthesisUtterance("Not quite, try again!");
        window.speechSynthesis.speak(tryAgain);
        
        // Keep this reset so she can try the same word again if she misses
        setTimeout(updateDisplay, 1500);
    }
}

function speakWord() {
    const currentWord = words[currentIndex].toLowerCase();
    const utter = new SpeechSynthesisUtterance(currentWord);
    window.speechSynthesis.speak(utter);
}

function nextWord() {
    currentIndex = (currentIndex + 1) % words.length;
    updateDisplay();
}

function prevWord() {
    currentIndex = (currentIndex - 1 + words.length) % words.length;
    updateDisplay();
}

function addStar() {
    starsEarned++;
    const container = document.getElementById("star-container");
    const star = document.createElement("span");
    star.innerHTML = (starsEarned % 5 === 0) ? "🏆" : "⭐";
    star.className = "star-pop";
    container.appendChild(star);
}

function startCelebration() {
    const colors = ["#FF5757", "#5271FF", "#00C2CB", "#FF914D", "#7ED957", "#8C52FF"];
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement("div");
        confetti.className = "confetti-piece";
        confetti.style.left = Math.random() * 100 + "%";
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3000);
    }
}