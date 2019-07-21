var timeToAnswer = -1,
  timerValue,
  gameTimerID,
  calcNum = 0,
  nbCalcBons = 0,
  nbCalcMax = 20,
  colNum = 0,
  nbCalcMaxCol = 5,
  nb1Calc,
  nb2Calc,
  answers = new Array(nbCalcMax);
var menuContainer,
  gameContainer,
  calcContainer,
  gameTimer,
  calcCounter,
  resultContainer,
  resultCounter,
  colContainer;

/*function delay(ms) {
         ms += new Date().getTime();
         while (new Date() < ms){}
      }*/

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function init() {
  menuContainer = document.getElementById("menu_container");
  gameContainer = document.getElementById("game_container");
  calcContainer = document.getElementById("calc_container");
  gameTimer = document.getElementById("game_timer");
  calcCounter = document.getElementById("calc_counter");
  resultContainer = document.getElementById("result_container");
  resultCounter = document.getElementById("result_counter");
  colContainer = document.getElementById("col_container");
}

function getDifficulty(radioField) {
  var pos = 0;

  for (var i = 0; i < radioField.length; i++)
    pos += radioField[i].checked ? i : 0;

  timeToAnswer = radioField[pos].value;
}

function displayGameContainer() {
  //menuContainer.style.height = "0px";
  gameContainer.style.height = "121px";
  //menuContainer.style.opacity = "0.0";
  gameContainer.style.opacity = "1.0";
  menuContainer.style.display = "none";
}

function displayResultContainer() {
  resultContainer.style.height = "250px";
  resultContainer.style.opacity = "1.0";
  gameContainer.style.display = "none";
}

function displayTimerValue(message) {
  gameTimer.innerHTML = message;
}

function displayCounterValue() {
  calcCounter.innerHTML = "n°" + calcNum + "/" + nbCalcMax;
}

function generateHtmlCalc(nb1, nb2, type) {
  return (
    '<p class="calc" id="calc' +
    calcNum +
    '">' +
    nb1 +
    " " +
    type +
    " " +
    nb2 +
    ' = <input type="text" class="answer" id="answer' +
    calcNum +
    '" value="?" onKeyDown="if (this.value == \'?\') this.value = \'\';" maxlength="2" /><img class="check" src="empty.png"/></p>'
  );
}

function generateHtmlCalcCol(nb1, nb2, type, res) {
  return (
    '<p class="calcCol" id="calc' +
    calcNum +
    '_col">' +
    nb1 +
    " " +
    type +
    " " +
    nb2 +
    " = " +
    res +
    '<img class="check" src="empty.png"/></p>'
  );
}

function addCalcImage(ok) {
  document
    .getElementById("calc" + calcNum + "_col")
    .getElementsByTagName("img")[0].src = ok
    ? "dialog-apply.png"
    : "dialog-cancel.png";
}

function addResult(calc) {
  if (!((calcNum - 1) % nbCalcMaxCol)) {
    colNum++;
    colContainer.innerHTML +=
      '<div class="calcCol" id="col' + colNum + '"></div>';
  }

  document.getElementById("col" + colNum).innerHTML += calc;
}

function handlePreviousCalc() {
  if (calcNum) {
    answers[calcNum] = document.getElementById("answer" + calcNum).value;
    var ok = answers[calcNum] == nb1Calc * nb2Calc;
    addResult(generateHtmlCalcCol(nb1Calc, nb2Calc, "x", answers[calcNum]));
    addCalcImage(ok);
    nbCalcBons += ok;
    document.getElementById("calc" + calcNum).style.display = "none";
  }
}

function generateNextCalc() {
  calcNum++;
  displayCounterValue();
  nb1Calc = randomInt(1, 9);
  nb2Calc = randomInt(5, 9);
  calcContainer.innerHTML += generateHtmlCalc(nb1Calc, nb2Calc, "x");
  window.setTimeout(function() {
    document.getElementById("calc" + calcNum).style.opacity = "1.0";
  }, 0);
  document.getElementById("answer" + calcNum).focus();
}

function decrementTimer() {
  if (--timerValue < 0) {
    timerValue = timeToAnswer;
    handlePreviousCalc();
    generateNextCalc();
  }

  if (calcNum > nbCalcMax) stopGame();
  else displayTimerValue(timerValue);
}

function startTimer() {
  timerValue = 0;
  gameTimerID = window.setInterval(decrementTimer, 1000);
}

function startGame() {
  var ms = 500;
  displayGameContainer();
  window.setTimeout(function() {
    displayTimerValue("Ready?");
  }, (ms += 800));
  window.setTimeout(function() {
    displayTimerValue("Go!");
  }, (ms += 1500));
  window.setTimeout(function() {
    startTimer();
  }, ms);
  window.setTimeout(function() {
    document.getElementById("restart").style.display = "initial";
  }, (ms += 1000));
}

function stopGame() {
  window.clearInterval(gameTimerID);
  displayResultContainer();
  resultCounter.innerHTML = "Good answers: " + nbCalcBons + "/" + nbCalcMax;
}
