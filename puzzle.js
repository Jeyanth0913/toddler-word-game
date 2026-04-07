const puzzleSets = [
    { 
        name: "Animals", 
        items: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🦁"], 
        oddOptions: ["🍎", "🚗", "🍦", "⚽", "🎸"] 
    },
    { 
        name: "Birds", 
        items: ["🦆", "🦜", "🦉", "🐦", "🐧", "🦅", "🦢", "🦩", "🦃"], 
        oddOptions: ["🚜", "⏰", "🍕", "🚲", "🧸"] 
    },
    { 
        name: "Shapes", 
        items: ["🔺", "🟡", "🟦", "⭐", "💎", "⬛", "🟢", "⬡", "💠"], 
        oddOptions: ["🐱", "🍎", "🚀", "🍦", "🦒"] 
    },
    { 
        name: "Balls", 
        items: ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🎱", "🏓"], 
        oddOptions: ["🍌", "🥦", "🚁", "🦋", "🍩"] 
    },
    { 
        name: "Sea Life", 
        items: ["🐙", "🦑", "🦐", "🦞", "🦀", "🐡", "🐠", "🐬", "🐳", "🦈"], 
        oddOptions: ["🚁", "🚜", "🚲", "🏠", "🌵"] 
    },
    { 
        name: "Weather", 
        items: ["☀️", "☁️", "🌧️", "❄️", "⚡", "🌙", "🌈", "🌪️", "🌡️"], 
        oddOptions: ["🍔", "🍟", "🧸", "👟", "🎸"] 
    },
    { 
        name: "Music", 
        items: ["🎸", "🎻", "🎹", "🎺", "🥁", "🪕", "🎷", "🪗", "📻"], 
        oddOptions: ["🍉", "🥕", "🚲", "🐶", "🧥"] 
    },
    { 
        name: "Food", 
        items: ["🍕", "🍔", "🍟", "🌭", "🥪", "🌮", "🥗", "🥘", "🍝"], 
        oddOptions: ["👟", "🪥", "🚁", "🐧", "⭐"] 
    },
    { 
        name: "Fruit", 
        items: ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍓", "🫐", "🍍"], 
        oddOptions: ["🚒", "🚢", "🧤", "🎸", "🦓"] 
    },
    { 
        name: "Vehicles", 
        items: ["🚗", "🚕", "🚙", "🚌", "🚑", "🚒", "🚜", "🚲", "✈️"], 
        oddOptions: ["🦉", "🥥", "🧁", "🌷", "🧸"] 
    }
];
let starsEarned = 0;
// Add these at the top of your puzzle.js
let currentPuzzleIndex = 0;
// We will store the puzzles so we can go back and forth
let puzzleHistory = [];

function startPuzzle() {
    document.getElementById('start-overlay').style.display = 'none';
    generatePuzzle();
}

function generatePuzzle() {
    const grid = document.getElementById("puzzle-grid");
    const feedback = document.getElementById("feedback-icon");
    grid.innerHTML = "";
    feedback.innerText = "";

    // 1. Pick a random category set
    const set = puzzleSets[Math.floor(Math.random() * puzzleSets.length)];
    
    // 2. Pick 3 different items from the category
    let categoryItems = [...set.items];
    categoryItems.sort(() => Math.random() - 0.5);
    let item1 = categoryItems[0];
    let item2 = categoryItems[1];
    let item3 = categoryItems[2];

    // 3. Pick ONE random odd emoji from the options list
    let oddEmoji = set.oddOptions[Math.floor(Math.random() * set.oddOptions.length)];

    // 4. Create and shuffle the 4 items
    let displayItems = [
        { emoji: item1, isOdd: false },
        { emoji: item2, isOdd: false },
        { emoji: item3, isOdd: false },
        { emoji: oddEmoji, isOdd: true }
    ];
    displayItems.sort(() => Math.random() - 0.5);

    // 5. Create the buttons
    displayItems.forEach(item => {
        const btn = document.createElement("button");
        btn.className = "letter-piece"; 
        btn.style.fontSize = "80px";
        btn.style.padding = "20px";
        btn.innerText = item.emoji;
        btn.onclick = () => checkAnswer(item.isOdd, btn);
        grid.appendChild(btn);
    });
}


function checkAnswer(isCorrect, btn) {
    const feedback = document.getElementById("feedback-icon");
    
    if (isCorrect) {
        feedback.innerText = "✅";
        const utter = new SpeechSynthesisUtterance("You got it!");
        window.speechSynthesis.speak(utter);
        addStar();
        startCelebration();
        
        // REMOVED: setTimeout(generatePuzzle, 2000); 
        // It will now stay on this screen until the arrow is pressed
        
    } else {
        feedback.innerText = "❌";
        const utter = new SpeechSynthesisUtterance("Try again!");
        window.speechSynthesis.speak(utter);
        btn.style.opacity = "0.3"; 
    }
}

function nextPuzzle() {
    generatePuzzle();
}

// Optional: If you want her to be able to see the last one again
function prevPuzzle() {
    // For now, this just generates a new one, 
    // but usually, kids just want the "Next" button!
    generatePuzzle();
}

// Reuse your existing addStar and startCelebration functions below
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
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement("div");
        confetti.className = "confetti-piece";
        confetti.style.left = Math.random() * 100 + "%";
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 2000);
    }
}