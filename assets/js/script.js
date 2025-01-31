document.addEventListener('DOMContentLoaded', (event) => {
    // DOM elements
    // Buttons
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const retryBtn = document.getElementById('retry-btn');
    // Difficulty select
    const difficultySelect = document.getElementById('difficulty');
    // Words content
    const testWordsElement = document.getElementById('test-words-content');
    // Results
    const timeElement = document.getElementById('accuracy');
    const wpmElement = document.getElementById('wpm');
    const levelElement = document.getElementById('level');
    const typingArea = document.getElementById('typing-area');

    let timer;
    let isRunning = false;
    let startTime;
    let endTime;

    // Sample texts
    const texts = {
        easy: [
            "The cat sat on the mat.",
            "A quick brown fox jumps over the lazy dog.",
            "Hello world!"
        ],
        medium: [
            "Typing is a skill that requires practice.",
            "JavaScript is a versatile programming language.",
            "The quick brown fox jumps over the lazy dog."
        ],
        hard: [
            "To be or not to be, that is the question.",
            "In the beginning, there was nothing but darkness.",
            "The quick brown fox jumps over the lazy dog multiple times."
        ]
    };
    // Difficulty levels
    function getRandomText(difficulty) {
        const options = texts[difficulty];
        return options[Math.floor(Math.random() * options.length)];
    }
    // Game logic
    function startGame() {
        console.log('Game started');
        const selectedDifficulty = difficultySelect.value;
        const randomText = getRandomText(selectedDifficulty);
        testWordsElement.textContent = randomText;
        startTime = new Date();
        startBtn.disabled = true;
        stopBtn.disabled = false;
        isRunning = true;
        typingArea.value = '';
        typingArea.focus();
        timer = setInterval(() => {
            // Game logic to be executed at intervals
        }, 1000);
    }

    function stopGame() {
        console.log('Game stopped');
        endTime = new Date();
        const timeTaken = (endTime - startTime) / 1000;
        timeElement.textContent = `${timeTaken.toFixed(2)}s`;
        clearInterval(timer);
        startBtn.disabled = false;
        stopBtn.disabled = true;
        isRunning = false;

        const typedText = typingArea.value.trim();
        const sampleText = testWordsElement.textContent.trim();
        const wpm = calculateWPM(typedText, sampleText, timeTaken);
        wpmElement.textContent = wpm;
        levelElement.textContent = difficultySelect.options[difficultySelect.selectedIndex].text;

        // Clear the text area
        typingArea.value = '';
    }
    function retryGame() {
        console.log('Game retried');
        clearInterval(timer);
        startBtn.disabled = false;
        stopBtn.disabled = true;
        isRunning = false;
        typingArea.value = '';
        // Reset game state
        startGame();
    }

    // Results function
    function calculateWPM(typedText, sampleText, timeTaken) {
        const typedWords = typedText.split(/\s+/);
        const sampleWords = sampleText.split(/\s+/);
        let correctWords = 0;

        typedWords.forEach((word, index) => {
            if (word === sampleWords[index]) {
                correctWords++;
            }
        });

        const minutes = timeTaken / 60;
        const wpm = correctWords / minutes;
        return Math.round(wpm);
    }

    function updateTypingFeedback() {
        const typedText = typingArea.value.trim();
        const sampleText = testWordsElement.textContent.trim();
        const typedWords = typedText.split(/\s+/);
        const sampleWords = sampleText.split(/\s+/);

        let feedbackHTML = '';

        sampleWords.forEach((word, index) => {
            if (typedWords[index] === undefined) {
                feedbackHTML += `<span>${word}</span> `;
            } else if (typedWords[index] === word) {
                feedbackHTML += `<span style="color: green;">${word}</span> `;
            } else {
                feedbackHTML += `<span style="color: red;">${word}</span> `;
            }
        });

        testWordsElement.innerHTML = feedbackHTML.trim();
    }

    // Event listeners
    startBtn.addEventListener('click', () => {
        if (!isRunning) {
            startGame();
        }
    });

    stopBtn.addEventListener('click', () => {
        if (isRunning) {
            stopGame();
        }
    });

    retryBtn.addEventListener('click', () => {
        retryGame();
    });

    typingArea.addEventListener('input', () => {
        if (isRunning) {
            updateTypingFeedback();
        }
    });

    typingArea.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            if (!isRunning) {
                startGame();
            } else {
                stopGame();
            }
        }
    });
    
    difficultySelect.addEventListener('change', () => {
        levelElement.textContent = difficultySelect.options[difficultySelect.selectedIndex].text;
    });
});