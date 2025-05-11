/* Navigation Functions */
function Lesson1() { window.location.href = "Lesson-1.html"; }
function Lesson2() { window.location.href = "Lesson-2.html"; }
function Lesson3() { window.location.href = "Lesson-3.html"; }
function back1() { window.location.href = "First-Page.html"; }
function back2() { window.location.href = "First-Page.html"; }
function back3() { window.location.href = "First-Page.html"; }
function QUIZ1() { window.location.href = "Quizes-1.html"; }
function Reference1() { window.location.href = "First-Page.html"; }

/* Quiz Variables */
let currentQuestion = 0;
let errorCount = 0;
let score = 0;
const maxErrors = 3;

const gifElements = {
  default: "default-lesson.gif",
  correct: "correct-answer.gif",
  incorrect: "wrong-answer.gif"
};

const questions = [
  { id: 1, text: "Question 1: This number has a base of 2.", type: "mcq", options: ["A. Binary", "B. Decimal", "C. Hexadecimal", "D. Octal"], correct: "Binary" },
  { id: 2, text: "Question 2: What is the binary equivalent of the decimal number 1?", type: "mcq", options: ["A. 0", "B. 2", "C. 1", "D. 10"], correct: "1" },
  { id: 3, text: "Question 3: This number has a base of (0-9, A-F) with sixteen symbols.", type: "mcq", options: ["A. Binary", "B. Decimal", "C. Hexadecimal", "D. Octal"], correct: "Hexadecimal" },
  { id: 4, text: "Question 4: What is the decimal equivalent of the binary number 1011?", type: "mcq", options: ["A. 13", "B. 10", "C. 11", "D. 9"], correct: "11" },
  { id: 5, text: "Question 5: What is 100000 + 010010  in Binary", type: "mcq", options: ["A. 10101000", "B. 101010", "C. 11101010", "D. 10001010"], correct: "101010" },
  { id: 6, text: "Question 6: What is 10011111 + 10001100 in Binary", type: "input", placeholder: "Answer", correct: "100101011" },
  { id: 7, text: "Question 7:  What is 10110 in decimal, hexadecimal, and octal", type: "input", placeholder: "Answer in format:(e.g., 1 ,1 ,1)", correct: "26, 22, 16" },
  { id: 8, text: "Question 8: What is 110110 in decimal, hexadecimal, and octal?", type: "input", placeholder: "Answer in format:(e.g., 1 ,1 ,1)", correct: "66, 54, 36" },
  { id: 9, text: "Question 9: What is the binary number 1011011 in decimal, hexadecimal, and octal", type: "input", placeholder: "Answer in format:(e.g., 1 ,1 ,1)", correct: "133, 91, 5B" },
  { id: 10, text: "Question 10: What is the binary number 11101001 in decimal, hexadecimal, and octal?", type: "input", placeholder: "Answer in format:(e.g., 1 ,1 ,1)", correct: "351 ,233 ,E9" }
];

/* Initialization */
window.onload = initQuiz;

function initQuiz() {
  const savedState = localStorage.getItem('quizState');
  if (savedState) {
    const state = JSON.parse(savedState);
    currentQuestion = state.currentQuestion;
    score = state.score;
    errorCount = state.errorCount;
    localStorage.removeItem('quizState');
    updateScoreBoard();
    restoreErrorSlots();
  }
  preloadGifs();
  showQuestion(currentQuestion);
}

function preloadGifs() {
  Object.values(gifElements).forEach(src => new Image().src = src);
}

function restoreErrorSlots() {
  document.querySelectorAll('.error-slot').forEach((slot, index) => {
    if (index < errorCount) slot.classList.add('filled');
  });
}

/* Question Handling */
function showQuestion(index) {
  const container = document.getElementById('question-container');
  const q = questions[index];

  if (q.type === "mcq") {
    container.innerHTML = `
      <div class="quiz-step" id="step${q.id}">
        <div class="mc-question">
          <h3>${q.text}</h3>
          <div class="mc-options-container">
            ${q.options.map(opt => `
              <button class="mc-option" onclick="handleAnswer(${q.id}, '${opt.split('. ')[1]}')">
                ${opt}
              </button>
            `).join('')}
          </div>
          <div id="feedback${q.id}" class="feedback-message"></div>
        </div>
      </div>`;
  } else {
    container.innerHTML = `
      <div class="quiz-step" id="step${q.id}">
        <div class="open-question">
          <h3>${q.text}</h3>
          <input type="text" id="answer${q.id}" placeholder="${q.placeholder}">
          <button onclick="handleInputAnswer(${q.id})">Submit</button>
          <div id="feedback${q.id}" class="feedback-message"></div>
        </div>
      </div>`;
  }
}

function handleAnswer(questionId, selectedAnswer) {
  const q = questions.find(item => item.id === questionId);
  const feedbackElement = document.getElementById(`feedback${questionId}`);

  if (selectedAnswer === q.correct) {
    // Increment score only for correct answers
    score++;
    updateScoreBoard();                
    showFeedback(feedbackElement, true);
    showFeedbackGif(true);
    setTimeout(() => nextQuestion(), 1500);
  } else {
    // Incorrect answer: don't reset or change the score, just log the error attempt
    showFeedback(feedbackElement, false);
    showFeedbackGif(false);
    recordError();
  }
}



function handleInputAnswer(questionId) {
  const q = questions.find(item => item.id === questionId);
  const userAnswer = document.getElementById(`answer${questionId}`).value.trim();
  const feedbackElement = document.getElementById(`feedback${questionId}`);

  if (userAnswer === q.correct) {
    // Increment score only for correct answers
    score++;               
    updateScoreBoard();               
    showFeedback(feedbackElement, true);
    showFeedbackGif(true);
    setTimeout(() => nextQuestion(), 1500);
  } else {
    // Incorrect answer: don't reset or change the score, just log the error attempt
    showFeedback(feedbackElement, false);
    showFeedbackGif(false);
    recordError();
  }
}

function updateScoreBoard() {
  const scoreDisplay = document.getElementById('scoreValue');
  scoreDisplay.textContent = score;
  scoreDisplay.classList.remove('pop-animation');
  void scoreDisplay.offsetWidth;
  scoreDisplay.classList.add('pop-animation');
}

function showFeedback(element, isCorrect) {
  element.textContent = isCorrect ? "Correct! Well done!" : "Incorrect";
  element.className = `feedback-message ${isCorrect ? 'correct' : 'incorrect'}-feedback`;
  element.style.display = "block";
}

function showFeedbackGif(isCorrect) {
  const gif = document.getElementById('lessonGif');
  const container = document.querySelector('.gif-container');
  gif.src = isCorrect ? gifElements.correct : gifElements.incorrect;
  container.classList.add(isCorrect ? 'gif-correct' : 'gif-incorrect');
  setTimeout(() => {
    gif.src = gifElements.default;
    container.classList.remove('gif-correct', 'gif-incorrect');
  }, 3000);
} 

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion(currentQuestion);
  } else {
    document.getElementById('question-container').innerHTML = `
      <div class="quiz-complete">
        <h2>Quiz Completed!</h2>
        <p>Your Score: ${score} / ${questions.length}</p>
        <p>You made ${errorCount} errors</p>
        <p>Returning to home in 5 seconds...</p>
      </div>`;
    setTimeout(() => window.location.href = "First-Page.html", 5000);
  }
}

function recordError() {
  errorCount++;
  const errorSlot = document.getElementById(`error${errorCount}`);
  if (errorSlot) {
    errorSlot.classList.add('filled');
    errorSlot.style.transform = 'scale(1.2)';
    setTimeout(() => errorSlot.style.transform = 'scale(1)', 300);
  }

  if (errorCount >= maxErrors) {
    alert("Maximum attempts reached. Please try again.");
    resetQuiz();
  }
}

function resetQuiz() {
  currentQuestion = 0;
  errorCount = 0;
  score = 0;
  localStorage.removeItem('quizState');
  document.querySelectorAll('.error-slot').forEach(slot => slot.classList.remove('filled'));
  updateScoreBoard();
  showQuestion(currentQuestion);
}
document.addEventListener('DOMContentLoaded', function() {
  updateLessonButtons();
});

function updateLessonButtons() {
  const lesson1Completed = localStorage.getItem('lesson1Completed') === 'true';
  const lesson2Completed = localStorage.getItem('lesson2Completed') === 'true';

  if (lesson1Completed) {
    const lesson2Btn = document.getElementById('lesson2');
    lesson2Btn.classList.remove('locked');
    lesson2Btn.onclick = function () { Lesson2(); };
    lesson2Btn.textContent = 'Lesson 2';

    document.getElementById('lesson1').classList.add('completed');
  }

  if (lesson2Completed) {
    const lesson3Btn = document.getElementById('lesson3');
    lesson3Btn.classList.remove('locked');
    lesson3Btn.onclick = function () { Lesson3(); };
    lesson3Btn.textContent = 'Lesson 3';

    document.getElementById('lesson2').classList.add('completed');
  }
}

function checkLessonProgress(requiredLesson) {
  if (requiredLesson === 1 && localStorage.getItem('lesson1Completed') !== 'true') {
    alert("Please complete Lesson 1 first!");
  } else if (requiredLesson === 2 && localStorage.getItem('lesson2Completed') !== 'true') {
    alert("Please complete Lesson 2 first!");
  }
}

function Lesson1() {
  window.location.href = "Lesson-1.html";
}

function Lesson2() {
  window.location.href = "Lesson-2.html";
}

function Lesson3() {
  window.location.href = "Lesson-3.html";
}
