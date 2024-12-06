import { SimonButton } from './SimonButton';
import './style.css';

const grid = document.querySelector<HTMLDivElement>('.grid')!;
const start = document.querySelector<HTMLButtonElement>('.start')!;
const restart = document.querySelector<HTMLButtonElement>('.restart')!;
const colors = ['green', 'red', 'yellow', 'blue'];
const randomSequence: { [key: number]: string } = {};

let currentAnswerNumericKey = 0;
let level = 0;

colors.forEach((color) =>
  grid.insertAdjacentHTML('beforeend', SimonButton(color))
);

colors.forEach((color) => {
  document
    .querySelector<HTMLButtonElement>(`button.${color}`)!
    .addEventListener('click', chooseAnswer);
});

start.addEventListener('click', () => {
  toggleDisabledSimonButton();
  toggleComponentVisibility('button.start');
  generateRandomSequence();
});

restart.addEventListener('click', () => {
  level = 0;
  updateLevel();
  toggleDisabledSimonButton();
  toggleComponentVisibility('button.restart');
  generateRandomSequence();
});

function generateRandomSequence() {
  updateLevel();

  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  randomSequence[Object.keys(randomSequence).length + 1] = randomColor;

  animateSimonButtonOfColor(randomColor);
}

function chooseAnswer(e: MouseEvent) {
  if (!isAbleToChooseAnswer()) return;

  let isCorrect = true;

  if (e.target instanceof HTMLButtonElement) {
    const answer = e.target.dataset.id;
    animateSimonButtonOfColor(answer!);

    if (randomSequence[currentAnswerNumericKey + 1] !== answer)
      isCorrect = false;

    currentAnswerNumericKey++;
  }

  if (!isCorrect) return gameOver();

  if (!isAbleToChooseAnswer()) {
    currentAnswerNumericKey = 0;
    level++;
    setTimeout(() => {
      generateRandomSequence();
    }, 1000);
  }
}

function animateSimonButtonOfColor(color: string) {
  const button = document.querySelector<HTMLButtonElement>(`button.${color}`);
  if (!button) return;

  const sound = generateSoundForButtonColor(color);

  button.classList.add('active');
  sound.play();
  setTimeout(() => {
    button.classList.remove('active');
  }, 100);
}

function generateSoundForButtonColor(color: string) {
  const sound = new Audio(`sounds/${color}.mp3`);
  return sound;
}

function generateWrongAnswerSound() {
  const sound = new Audio('sounds/wrong.mp3');
  return sound;
}

function updateLevel() {
  document.querySelector<HTMLHeadingElement>(
    '.level'
  )!.textContent = `Level ${level}`;
}

function isAbleToChooseAnswer() {
  return currentAnswerNumericKey < Object.keys(randomSequence).length;
}

function toggleComponentVisibility(selector: string) {
  const component = document.querySelector<HTMLElement>(selector);
  component && component.classList.toggle('none');
}

function toggleDisabledSimonButton() {
  document
    .querySelectorAll<HTMLButtonElement>('.simon-button')
    .forEach((button) => (button.disabled = !button.disabled));
}

function reset() {
  currentAnswerNumericKey = 0;
  Object.entries(randomSequence).forEach(([k]) => {
    delete randomSequence[+k];
  });
}

function gameOver() {
  reset();
  toggleDisabledSimonButton();

  const sound = generateWrongAnswerSound();

  sound.play();
  document.body.classList.add('game-over');

  setTimeout(() => {
    toggleComponentVisibility('button.restart');
    document.body.classList.remove('game-over');
  }, 100);
}
