const storage = window.localStorage;

const UI = {
  field: document.querySelector('#field'),
  allUI: document.querySelector('#ui'),
  controls: document.querySelector('#controls'),
  startButton: document.querySelector('#start'),
  logoutButton: document.querySelector('#logout'),
  diffField: document.querySelector('#diff'),
  diffChecks: document.querySelector('#diff').querySelectorAll('input'),
  skirtChecks: document.querySelector('#skirts').querySelectorAll('input'),
  greets: document.querySelector('#greets h2'),
  form: document.querySelector('#login'),
  inputs: document.querySelector('#login').querySelectorAll('input'),
  loginWindow: document.querySelector('#login-form'),
  loginLogo: document.querySelector('#login-logo'),
  UIlogo: document.querySelector('#logo'),
  gameoverScreen: document.querySelector('#game-over-screen'),
  gameoverLogo: document.querySelector('#game-over-logo'),
  gameoverText: document.querySelector('#game-over-text')
}

let currentPlayer;
let temp__contAs;
let gameplay = null;
let difficulty = 'easy';
let skirt = 1;

let hall = new Hall;
hall.showTop10ForDiff(difficulty);

const constructLogo = elem => {
  elem.innerHTML = '<div class="logo-container"><div class="logo-circle"></div><div class="logo-text m1">MATCH</div><div class="logo-text m2">MATCH</div><div class="logo-text g">GAME</div></div>';
}
const destructLogo = elem => {
  elem.innerHTML = '';
}

const showUI = () => {
  UI.allUI.classList.remove('ui-hidden');
  constructLogo(UI.UIlogo);
}

const hideUI = () => {
  destructLogo(UI.UIlogo);
  UI.allUI.classList.add('ui-hidden');
}

const fillGameOverText = place => {
  const block = UI.gameoverText;

  if (place === 0) {
    block.innerHTML = '<h2>TRY HARDER, ' + currentPlayer.firstName + '!!!</h2>'
    block.innerHTML += '<h3>Your time is: ' + global__currentFinishTimeString + '.</h3>'
    block.innerHTML += '<p>We are sorry to tell you that, but your result is too slow to be recorded in the leaderboard.</p>'
    block.innerHTML += '<button type="button" class="displayed" id="backBtn">Back To Menu</button>';
    block.innerHTML += '<button type="button" class="displayed" id="restartBtn">Restart Game</button>';
  } else {
    block.innerHTML = '<h2>CONGRATULATIONS, ' + currentPlayer.firstName + '!!!</h2>'
    block.innerHTML += '<h3>Your time is: ' + global__currentFinishTimeString + '.</h3>'

    switch(place) {
      case 1:
      block.innerHTML += '<p>Powerful you are! You get the 1st place at the leaderboard!</p>';
      break;
      case 2:
      block.innerHTML += '<p>You almost got it! You get the 2nd place at the leaderboard!</p>';
      break;
      case 3:
      block.innerHTML += '<p>Nice you are! You get the 3rd place at the leaderboard!</p>';
      break;
      default:
      block.innerHTML += '<p>Not bad! You get the ' + place + 'th place at the leaderboard!</p>';
      break;
    }

    block.innerHTML += '<button type="button" class="displayed" id="backBtn">Back To Menu</button>';
    block.innerHTML += '<button type="button" class="displayed" id="restartBtn">Restart Game</button>';
  }
}

const showGameOverScreen = () => {
  UI.gameoverScreen.classList.remove('game-over--hidden');
  UI.gameoverScreen.classList.add('game-over--visible');
  fillGameOverText(global__currentPlace);
  constructLogo(UI.gameoverLogo);
  const backBtn = UI.gameoverText.querySelector('#backBtn');
  const restartBtn = UI.gameoverText.querySelector('#restartBtn');

  let delayedText = setTimeout(() => {
    return (function() {
      UI.gameoverLogo.classList.add('game-over-logo--left');
      UI.gameoverText.classList.remove('game-over-text--hidden');
      delayedText = null;
    })()
  }, 2000);

  function backToMenu() {
    backBtn.removeEventListener('click', backToMenu);
    hideGameOverScreen();
    let delayedUI = setTimeout(() => {
      showUI();
    }, 500);
  }

  backBtn.addEventListener('click', e => {
    e.preventDefault();
    backToMenu();
  });
  restartBtn.addEventListener('click', e => {
    e.preventDefault();
    hideGameOverScreen();
    startGame(difficulty);
  });
}

const hideGameOverScreen = () => {
  destructLogo(UI.gameoverLogo);
  UI.gameoverScreen.classList.remove('game-over--visible');
  UI.gameoverScreen.classList.add('game-over--hidden');
  UI.gameoverText.innerHTML = '';
  UI.gameoverLogo.classList.remove('game-over-logo--left');
  UI.gameoverText.classList.add('game-over-text--hidden');
}

if (storage.getItem('player') !== null) {
  currentPlayer = JSON.parse(storage.getItem('player'));
  let continueAs = UI.loginWindow.appendChild(document.createElement('button'));
  continueAs.innerText = "Continue as " + currentPlayer.firstName;
  continueAs.classList.add('displayed');
  temp__contAs = continueAs;

  continueAs.addEventListener('click', () => {
    let buttons = UI.form.querySelectorAll('button');
    buttons.forEach(button => button.classList.remove('displayed'));

    UI.loginWindow.classList.remove('login-form--pseudo');
    UI.loginWindow.classList.remove('login-form--visible');
    UI.loginLogo.classList.add('login-logo--hidden');
    UI.greets.innerText = 'Hello ' + currentPlayer.firstName + '!';
    continueAs.remove();
    showUI();
  });
}  

const login = () => {

  let name = UI.inputs[0].value,
      surname = UI.inputs[1].value,
      email = UI.inputs[2].value;

  currentPlayer = new Player(name, surname, email);
  storage.setItem('player', JSON.stringify(currentPlayer));
  UI.greets.innerText = 'Hello ' + currentPlayer.firstName + '!';
  
  let buttons = UI.form.querySelectorAll('button');
  buttons.forEach(button => button.classList.remove('displayed'));
  if (temp__contAs !== undefined) {
    temp__contAs.remove();
  }
  
  UI.loginWindow.classList.remove('login-form--pseudo');
  UI.loginWindow.classList.remove('login-form--visible');
  UI.loginLogo.classList.add('login-logo--hidden');
  showUI();
}

const logOut = () => {
  hideUI();

  UI.inputs.forEach(input => input.value = '');
  currentPlayer = undefined;
  storage.removeItem('player');

  UI.loginWindow.classList.add('login-form--pseudo');
  UI.loginWindow.classList.add('login-form--visible');
  UI.loginLogo.classList.remove('login-logo--hidden');
  let buttons = UI.form.querySelectorAll('button');
  buttons.forEach(button => button.classList.add('displayed'));
}

let global__count = 0;
let global__previousCard;
let global__previousCardID = 0;
let global__match = false;
let global__notFirstGame = false;
let global__gameOver = false;
let global__currentDiff = 8;
let global__currentCardsMatched = 0;
let global__currentGameSeconds = 0;
let global__currentFinishTimeString = '';
let global__currentPlace = 0;

const setDifficulty = () => { 
  let index = 0;

  UI.diffChecks.forEach((check, i) => {
    if (check.checked) {
      index = i;
      return index;
    }
  });

  switch(index) {
    case 0:
      difficulty = 'easy';
      global__currentDiff = 8;
      break;
    case 1:
      difficulty = 'medium';
      global__currentDiff = 16;
      break;
    case 2:
      difficulty = 'hard';
      global__currentDiff = 24;
      break;
  }

  hall.showTop10ForDiff(difficulty);
}

const skirtSelect = () => {
  UI.skirtChecks.forEach((check, i) => {
    if (check.checked) {
      skirt = i + 1;
      return skirt;
    }
  });
}

const clearField = nodelist => nodelist.forEach(node => node.remove());

const clearFieldGameLayout = () => {
  if (field.classList.contains('field-easy')) field.classList.remove('field-easy');
  if (field.classList.contains('field-medium')) field.classList.remove('field-medium');
  if (field.classList.contains('field-hard')) field.classList.remove('field-hard');
}

function startGame(difficulty) {
  if (global__notFirstGame) {
    clearField(UI.field.querySelectorAll('.card'));
  }

  gameplay = gameplay !== null ? null : new Gameplay('#field', difficulty);

  if (gameplay !== null) {
    let go = setTimeout(() => {
      gameplay.init();
      let timer = new Timer;
      timer.process();
      global__gameOver = false;
      let query = document.querySelectorAll('.card');
      let highlight = new Highlight(query);
    }, 300);    
  }
  global__notFirstGame = true;
  hideUI()
}

UI.startButton.addEventListener('click', e => {
  e.preventDefault;
  startGame(difficulty);
});

UI.logoutButton.addEventListener('click', e => {
  e.preventDefault();
  logOut();
})

const global__matchWatch = () => {
  global__currentCardsMatched++;
  if (global__currentCardsMatched === global__currentDiff) {
    let finishTime = document.querySelector('#timer').innerText;
    global__currentFinishTimeString = finishTime;
    
    global__gameOver = true;
    global__currentCardsMatched = 0;
    hall.getResult();
    hall.showTop10ForDiff(difficulty);
    let clear = setTimeout(() => {
      clearFieldGameLayout()
      gameplay.el.classList.remove('field-visible');
      gameplay = null;
      showGameOverScreen();
    }, 1500);
  }
}

const disablePointerEvents = () => {
  let cards = UI.field.querySelectorAll('.card');
  cards.forEach(c => c.classList.add('disable-pointer-events'));
}

const enablePointerEvents = () => {
  let cards = UI.field.querySelectorAll('.card');
  cards.forEach(c => c.classList.remove('disable-pointer-events'));
}

UI.diffChecks.forEach(check => {
  check.addEventListener('change', setDifficulty);
});

UI.skirtChecks.forEach(check => {
  check.addEventListener('change', skirtSelect);
});
