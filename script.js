(function () {
  var secretNumber = 0;
  var guessesLeft = 7;
  var roundNumber = 1;
  var guesses = [];
  var finished = false;
  var bestScore = null;

  var form = document.getElementById("guessForm");
  var input = document.getElementById("guessInput");
  var message = document.getElementById("message");
  var leftDisplay = document.getElementById("left");
  var bestDisplay = document.getElementById("best");
  var roundDisplay = document.getElementById("round");
  var historyDisplay = document.getElementById("history");
  var guessButton = document.getElementById("guessButton");

  function showMessage(text, type) {
    message.textContent = text;
    message.className = "message" + (type ? " " + type : "");
  }

  function updateHistory() {
    historyDisplay.textContent = "";
    if (guesses.length === 0) {
      var empty = document.createElement("span");
      empty.className = "chip";
      empty.textContent = "No guesses yet";
      historyDisplay.appendChild(empty);
      return;
    }
    guesses.forEach(function (number) {
      var chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = number;
      historyDisplay.appendChild(chip);
    });
  }

  function endRound() {
    finished = true;
    input.disabled = true;
    guessButton.disabled = true;
  }

  function startRound() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    guessesLeft = 7;
    guesses = [];
    finished = false;
    leftDisplay.textContent = guessesLeft;
    roundDisplay.textContent = roundNumber;
    input.value = "";
    input.disabled = false;
    guessButton.disabled = false;
    showMessage("Enter a number and press Guess it.");
    updateHistory();
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (finished) return;

    var guess = Number(input.value);
    if (input.value.trim() === "" || !Number.isInteger(guess) || guess < 1 || guess > 100) {
      showMessage("Please enter a whole number from 1 to 100.", "hint");
      return;
    }
    if (guesses.indexOf(guess) !== -1) {
      showMessage("You already guessed " + guess + ". Try a different number.", "hint");
      return;
    }

    guesses.push(guess);
    guessesLeft -= 1;
    leftDisplay.textContent = guessesLeft;
    updateHistory();

    if (guess === secretNumber) {
      showMessage("Correct! The secret number was " + secretNumber + ". You won in " + guesses.length + (guesses.length === 1 ? " guess!" : " guesses!"), "good");
      if (bestScore === null || guesses.length < bestScore) {
        bestScore = guesses.length;
        bestDisplay.textContent = bestScore;
      }
      endRound();
    } else if (guessesLeft === 0) {
      showMessage("No guesses left! The secret number was " + secretNumber + ". Start a new round to try again.", "hint");
      endRound();
    } else {
      var difference = Math.abs(secretNumber - guess);
      var clue = guess < secretNumber ? "Too low — try a higher number." : "Too high — try a lower number.";
      if (difference <= 5) clue += " You're very close!";
      showMessage(clue);
      input.value = "";
      input.focus();
    }
  });

  document.getElementById("newButton").addEventListener("click", function () {
    roundNumber += 1;
    startRound();
  });

  document.getElementById("hintButton").addEventListener("click", function () {
    if (finished) {
      showMessage("Start a new round to get another hint.", "hint");
      return;
    }
    var lower = 1;
    var upper = 100;
    guesses.forEach(function (guess) {
      if (guess < secretNumber && guess >= lower) lower = guess + 1;
      if (guess > secretNumber && guess <= upper) upper = guess - 1;
    });
    showMessage("Hint: the secret number is between " + lower + " and " + upper + ".", "hint");
  });

  startRound();
}());
