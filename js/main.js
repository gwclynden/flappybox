// Object to store properties of the stage/canvas
var stage = {
  width: 600,
  height: 480
};

// Object to store properties of the main sprite
var mainSprite = {
  width: 20,
  height: 20,
  x: 100,
  y: 100,
  maxGravity: 5,
  currentGravity: 0,
  gravityRate: 0.1,
  flapStrength: 3,
  horizontalSpeed: 0,
  horizontalSlowRate: 0.1
};

// gameProc is the parent function that wraps all activity for the canvas
function gameProc(p) {

  // Initialize the game
  var init = function () {
    p.width = stage.width;
    p.height = stage.height;
  };
  init();

  // Processing.js calls this automatically 60 times per second
  // It contains all logic to draw screen contents
  p.draw = function () {
    drawBackground();

    handleMainSpriteGravity();  // makes the main sprite fall in a natural way
    handleMainSpriteHorizontalMotion();  // makes the main sprite move left/right in a natural way
    drawMainSprite();  // draws the main sprite at the calculated x/y
  };

  // Processing.js calls this automatically whenever a key is pressed
  p.keyPressed = function () {
    handleKeyPress();
  };

  // Handle the effects of gravity on the main sprite
  var handleMainSpriteGravity = function () {
    // Increase the effects of gravity (the "fall" rate) by a small amount
    // This causes things to fall slowly at first, then accelerate over time.
    mainSprite.currentGravity += mainSprite.gravityRate;
    // ... but we only allow the sprite to fall at a speed <= mainSprite.maxGravity (i.e. terminal velocity)
    if (mainSprite.currentGravity > mainSprite.maxGravity) {
      mainSprite.currentGravity = mainSprite.maxGravity;
    }
    // Now, increase the sprite's y by the calculated amount
    mainSprite.y += mainSprite.currentGravity;

    // Don't allow the sprite to move past the bottom of the stage
    if (mainSprite.y > stage.height - mainSprite.height) {
      mainSprite.y = stage.height - mainSprite.height;
    }
  };

  // Makes the main sprite glide left/right and slow to a stop
  // If mainSprite.horizontalSpeed > 0, the sprite moves to the right.
  // If mainSprite.horizontalSpeed < 0, the sprite moves to the left.
  var handleMainSpriteHorizontalMotion = function () {
    // If we're moving to the right ...
    if (mainSprite.horizontalSpeed > 0) {
      // ... slow the rate of movement just a little bit
      mainSprite.horizontalSpeed -= mainSprite.horizontalSlowRate;
    }
    // If we're moving to the left ...
    if (mainSprite.horizontalSpeed < 0) {
      // ... slow the rate of movement just a little bit
      mainSprite.horizontalSpeed += mainSprite.horizontalSlowRate;
    }
    // If we're barely creeping, just go ahead and stop.
    // This is because of the way JavaScript rounds numbers.
    if (Math.abs(mainSprite.horizontalSpeed) < 0.1) {
      mainSprite.horizontalSpeed = 0;
    }

    // Move the sprite left or right by horizontalSpeed
    mainSprite.x += mainSprite.horizontalSpeed;

    // Don't allow us to move off the right edge
    if (mainSprite.x > stage.width - mainSprite.width) {
      mainSprite.x = stage.width - mainSprite.width;
    }
    // Don't allow us to move off the left edge
    if (mainSprite.x < 0) {
      mainSprite.x = 0;
    }
  };

  // handles all keyPress logic
  var handleKeyPress = function () {
    if (p.keyPressed) {
      switch (p.keyCode) {
        case p.RIGHT:
          mainSprite.horizontalSpeed = 3;
          break;
        case p.LEFT:
          mainSprite.horizontalSpeed = -3;
          break;
        case p.DOWN:
          mainSprite.currentGravity = mainSprite.maxGravity;
          break;
        case p.UP:
          mainSprite.currentGravity = 0 - mainSprite.flapStrength;
          break;
        default:
          // otherwise, do nothing
      }
    }
  };

  // Refreshes/redraws the background
  var drawBackground = function () {
    p.background(255, 255, 255);
  };

  // Draws the main sprite at the currently calculated x/y
  var drawMainSprite = function () {
    p.noStroke();
    p.fill(79, 255, 94);
    p.rect(mainSprite.x, mainSprite.y, mainSprite.width, mainSprite.height);
  };
}

// This line gets us a reference to the physical canvas object on the HTML page.
// Everything is drawn on the canvas.
var canvas = document.getElementById("mainCanvas");
// Attaches the gameProc function to the canvas.
// This lets processing.js do its magic on our canvas
var mainInstance = new Processing(canvas, gameProc);
