let num1, num2, correctAnswer;
let starsEarned = 0;

function startMath() {
    document.getElementById('start-overlay').style.display = 'none';
    generateProblem();
}

function generateProblem() {
    // 1. Pick a target sum between 2 and 10
    const targetSum = Math.floor(Math.random() * 9) + 2; 

    // 2. Pick num1 and num2
    num1 = Math.floor(Math.random() * (targetSum - 1)) + 1;
    num2 = targetSum - num1;
    correctAnswer = targetSum;

    // 3. Update the Equation Text
    const equationElement = document.getElementById("equation-text");
    equationElement.innerHTML = `
        <div class="math-block">
            <div>${num1}</div>
            <div class="dots">${"•".repeat(num1)}</div>
        </div>
        <div class="math-operator">+</div>
        <div class="math-block">
            <div>${num2}</div>
            <div class="dots">${"•".repeat(num2)}</div>
        </div>
        <div class="math-operator">= ?</div>
    `;
    
    // Voice prompt
    const utter = new SpeechSynthesisUtterance(`${num1} plus ${num2} equals what?`);
    utter.lang = 'en-US';
    utter.rate = 0.8;
    window.speechSynthesis.speak(utter);

    setupChoices();
}

function setupChoices() {
    const choiceContainer = document.getElementById("answer-choices");
    choiceContainer.innerHTML = "";

    let choices = [correctAnswer];
    while(choices.length < 3) {
        let wrong = Math.floor(Math.random() * 10) + 1;
        if (!choices.includes(wrong)) choices.push(wrong);
    }
    choices.sort(() => Math.random() - 0.5);

    choices.forEach(val => {
        const btn = document.createElement("button");
        btn.className = "nav-btn repeat";
        btn.style.fontSize = "40px";
        btn.innerText = val;
        btn.onclick = () => checkAnswer(val);
        choiceContainer.appendChild(btn);
    });
}

function checkAnswer(val) {
    window.speechSynthesis.cancel();
    const equationElement = document.getElementById("equation-text");
    
    // Find the "? " part and replace it with the chosen number + an icon
    if (val === correctAnswer) {
        // SUCCESS STATE
        equationElement.innerHTML = `
            <div class="math-block"><div>${num1}</div><div class="dots">${"•".repeat(num1)}</div></div>
            <div class="math-operator">+</div>
            <div class="math-block"><div>${num2}</div><div class="dots">${"•".repeat(num2)}</div></div>
            <div class="math-operator">= <span class="correct-text">${val} ✅</span></div>
        `;

        addStar();
        const praise = new SpeechSynthesisUtterance(`Yes! ${num1} plus ${num2} is ${correctAnswer}!`);
        window.speechSynthesis.speak(praise);
        startCelebration();
        
        // Wait 3 seconds so she can see the finished equation before it disappears
        setTimeout(generateProblem, 3000);
    } else {
        // ERROR STATE
        // We temporarily show the wrong answer with a cross, then reset to "?"
        const originalHTML = equationElement.innerHTML;
        equationElement.innerHTML = `
            <div class="math-block"><div>${num1}</div><div class="dots">${"•".repeat(num1)}</div></div>
            <div class="math-operator">+</div>
            <div class="math-block"><div>${num2}</div><div class="dots">${"•".repeat(num2)}</div></div>
            <div class="math-operator">= <span class="wrong-text">${val} ❌</span></div>
        `;

        const tryAgain = new SpeechSynthesisUtterance("Not quite, count the dots and try again!");
        window.speechSynthesis.speak(tryAgain);

        // After 1.5 seconds, put the "?" back so she can try again
        setTimeout(() => {
            if (val !== correctAnswer) { // Only reset if she hasn't gotten it right since
                equationElement.innerHTML = originalHTML;
            }
        }, 1500);
    }
}

function addStar() {
    starsEarned++;
    const container = document.getElementById("star-container");
    const star = document.createElement("span");
    star.innerHTML = (starsEarned % 5 === 0) ? "🏆" : "⭐";
    star.className = "star-pop";
    if (starsEarned % 5 === 0) star.classList.add("trophy-animation");
    container.appendChild(star);
}

function startCelebration() {
    const colors = ["#FF5757", "#5271FF", "#00C2CB", "#FF914D", "#7ED957", "#8C52FF"];
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement("div");
        confetti.className = "confetti-piece";
        confetti.style.left = Math.random() * 100 + "%";
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 1.5 + 1.5) + "s";
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3000);
    }
}