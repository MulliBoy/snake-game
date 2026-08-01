//setup the canvas
var canvas = document.getElementById("mycanvas");
canvas.width = 400;
canvas.height = 400;
var c = canvas.getContext("2d");

// Move these two lines to the very top of your file
let gamepadIndex = null;
let buttonCooldowns = {}; 
const size = 20;
var sx = 0;
var sy = 0;
var dx = size;
var dy = 0;
var snake =[];
var parts = 5;
var appleX = 200;
var appleY = 200;
var apple = [];
var appleNum = 5;
var score = 0;
var t1X = 260;
var t1Y = 260;
var t2X = 160;
var t2Y = 160;
var poX = 100;
var poY = 100;
var lives = 0;
var invX = 340;
var invY = 340;
var preSX = 0;
var preSY = 0;
var delay = 100;
var hardmode = false;
var palette = ["#FF0055", "#FF5500", "#FFCC00", "#00FF55", "#00CCFF", "#7700FF", "#FF00FF"];
var strokePalette = ["#990033", "#993300", "#997700", "#009933", "#007799", "#440099", "#990099"];
var colorIndex = 0;
var keX = 160;
var keY = 260;
var yYMode = false;
var yYSnake = []; // Stores [{x, y}, {x, y}] segments for the shadow snake



//make board

function drawBoard(){
    c.fillStyle = "black"
    c.fillRect(0, 0, canvas.width, canvas.height);
};

//draw score
function addText(){
    c.font = "bold 25px arial";
    c.fillStyle = "white";
    c.fillText("Score: " + score, 20, 380);
    c.fillText("Lives:" + lives, 20, 340);
}


//animate snake
function drawSnake(){
    // IF HARD MODE IS ACTIVE: Cycle colors automatically every single frame!
    if (hardmode) {
        colorIndex += 1;
        if (colorIndex >= palette.length) {
            colorIndex = 0;
        }
    };
    snake.forEach(drawPart);
};

function drawPart(snakePart){
    c.fillStyle = palette[colorIndex];
    c.fillRect(snakePart.partX, snakePart.partY, size, size);
    c.fillStyle = palette[colorIndex];
    c.strokeRect(snakePart.partX, snakePart.partY, size, size);
}

function moveSnake(){
    var snakePart = {
        partX: sx,
        partY: sy,

    }
    snake.push(snakePart);
    if(snake.length > parts){
        snake.shift();
    };

    preSX = sx;
    preSY = sy;

    if(sx == -20){
        sx = 380;
    } else if(sx == 400){
        sx = 0;
    } else if(sy == 400){
        sy = 0;
    } else if(sy == -20){
        sy = 380;
    } else{
        sx += dx;
        sy += dy;
    };

};
// Run this once at game startup to fill the array
function initApples() {
    apple = []; // Reset array
    for (let i = 0; i < appleNum; i++) {
        apple.push({
            x: (Math.ceil(Math.random() * 20) - 1) * 20,
            y: (Math.ceil(Math.random() * 20) - 1) * 20
        });
    }
}


function animateSnake(){
    simulateKeyboardInputs();
    
    c.clearRect(0, 0, canvas.width, canvas.height);

    drawBoard();
    moveSnake();
    drawSnake();
    yinYangSnake();
    drawMirrorSnake();
    eatFood();
    eatTeleporter();
    eatPoison();
    eatLives();
    eatKey();
    addText();

    if(parts <= 0){
        parts = 1;
    }

    if(touchingEdge() && hardmode == true){
        lives += -1;
        if(score <= -1){
            score = 0;
        };
        if(lives <= -1){
            drawTextGameOver("You lost!");
            return
        } else {
            resetSnakePosition();
        };
    };
    if(touchingSelf() || score <= -1){
        lives += -1;
        if(score <= -1){
            score = 0;
        };
        if(lives <= -1){
            drawTextGameOver("You lost!");
            return
        } else {
            resetSnakePosition();
        };
    };

    request(animateSnake)
};

animateSnake();
initApples();

//move snake well
document.addEventListener("keydown", handleKey);

// Draws all apples currently stored in the array
function drawFood() {
    c.fillStyle = "#b32d00"; // Fixed typo: changed ##b32d00 to #b32d00
    for (let i = 0; i < apple.length; i++) {
        c.fillRect(apple[i].x, apple[i].y, 20, 20);
    }
}

// Checks if snake head hits any apple in the array
function eatFood() {
    let foodEaten = false;

    for (let i = 0; i < apple.length; i++) {
        // Check collision with the i-th apple
        if (sx == apple[i].x && sy == apple[i].y) {
            score += 1;
            parts += 1;
            
            // Respawn only the eaten apple to a new random position
            apple[i].x = (Math.ceil(Math.random() * 20) - 1) * 20;
            apple[i].y = (Math.ceil(Math.random() * 20) - 1) * 20;
            
            foodEaten = true;
            break; // Stop loop since head can only eat one apple at a time
        }
    }

    // Always draw the apples every frame
    drawFood();
}


//draw food
function drawTeleporter(){
    t1X = (Math.ceil(Math.random() * 20) - 1) * 20;
    t1Y = (Math.ceil(Math.random() * 20) - 1) * 20;
    t2X = (Math.ceil(Math.random() * 20) - 1) * 20;
    t2Y = (Math.ceil(Math.random() * 20) - 1) * 20;
    c.fillStyle = "purple";
    c.fillRect(t1X, t1Y, 20, 20);
    c.fillRect(t2X, t2Y, 20, 20);
}

//keep food
function keepTeleporter(){
    c.fillStyle = "purple";
    c.fillRect(t1X, t1Y, 20, 20);
    c.fillRect(t2X, t2Y, 20, 20);
}

//check if apple is touching snake
function eatTeleporter(){
    if(sx == t1X && sy == t1Y){
        sx = t2X;
        sy = t2Y;
        parts += 4;
        score += 4;

        // --- Keep Mirror Snake Synced ---
        if (yYMode && yYSnake.length > 0) {
            yYSnake[0].x = 400 - t2X - size;
            yYSnake[0].y = 400 - t2Y - size;
        }

        drawTeleporter();
    } else if(sx == t2X && sy == t2Y){
        sx = t1X;
        sy = t1Y;
        parts += 4;
        score += 4;

        // --- Keep Mirror Snake Synced ---
        if (yYMode && yYSnake.length > 0) {
            yYSnake[0].x = 400 - t1X - size;
            yYSnake[0].y = 400 - t1Y - size;
        }

        drawTeleporter();
    } else{
        keepTeleporter();
    }
}


//draw food
function drawPoison(){
    poX = (Math.ceil(Math.random() * 20) - 1) * 20;
    poY = (Math.ceil(Math.random() * 20) - 1) * 20;
    c.fillStyle = "Darkgreen";
    c.fillRect(poX, poY, 20, 20);
}

//keep food
function keepPoison(){
    c.fillStyle = "Darkgreen";
    c.fillRect(poX, poY, 20, 20);
}

//check if apple is touching snake
function eatPoison(){
    if(sx == poX && sy == poY){
        drawPoison();
        snake.shift();
        snake.shift();
        parts += -2;
        score += -2;
    } else{
        keepPoison();
    }
}

//draw food
function drawLives(){
    invX = (Math.ceil(Math.random() * 20) - 1) * 20;
    invY = (Math.ceil(Math.random() * 20) - 1) * 20;
    c.fillStyle = "pink";
    c.fillRect(invX, invY, 20, 20);
}

//keep food
function keepLives(){
    c.fillStyle = "pink";
    c.fillRect(invX, invY, 20, 20);
}

//check if apple is touching snake
function eatLives(){
    if(sx == invX && sy == invY){
        drawLives();
        lives += 1;
        parts += 2;
        score += 2;
    } else{
        keepLives();
    }
}

function resetSnakePosition(){
    sx = 0;
    sy = 0;

    parts += -2;

    dx = 0;
    dy = 20;
};

//draw food
function drawKey(){
    keX = (Math.ceil(Math.random() * 20) - 1) * 20;
    keY = (Math.ceil(Math.random() * 20) - 1) * 20;
    c.fillStyle = "yellow";
    c.fillRect(keX, keY, 20, 20);
}

//keep food
function keepKey(){
    c.fillStyle = "yellow";
    c.fillRect(keX, keY, 20, 20);
}

//check if apple is touching snake
function eatKey(){
    if(sx == keX && sy == keY){
        drawKey();
        drawTeleporter();
        score += 1;
        parts += 1;
    } else{
        keepKey();
    }
}

function yinYangSnake() {
    if (!yYMode || yYSnake.length === 0) return;

    // 1. FIXED: Grab coordinates from index 0 (the actual head block)
    let mx = yYSnake[0].x - dx; 
    let my = yYSnake[0].y - dy;

    // 2. Handle wrap-around rules for your 400x400 canvas
    if (mx < 0) mx = 400 - size;
    if (mx >= 400) mx = 0;
    if (my < 0) my = 400 - size;
    if (my >= 400) my = 0;

    // 3. Add the new inverse head to the front of the array
    yYSnake.unshift({ x: mx, y: my });
    
    // 4. Maintain the correct tail length matching your parts variable
    while (yYSnake.length > parts) {
        yYSnake.pop();
    }
}



function drawMirrorSnake() {
    // 1. Only draw if the mode is toggled on
    if (!yYMode) return;
    
    // 2. Pick a cool color for the mirror snake (e.g., silver/light gray)
    c.fillStyle = "#e0e0e0"; 
    
    // 3. Loop through your mirror snake array and draw every segment
    for (let i = 0; i < yYSnake.length; i++) {
        c.fillRect(yYSnake[i].x, yYSnake[i].y, size, size); 
    }
};

// ============================================================================
// KEEP THIS CODE AT THE END OF YOUR FILE (Do not make it blank!)
// ============================================================================

window.addEventListener("gamepadconnected", (e) => {
  console.log("Switch Controller Connected:", e.gamepad.id);
  gamepadIndex = e.gamepad.index; // Sets the index when controller wakes up
});

window.addEventListener("gamepaddisconnected", () => {
  gamepadIndex = null; // Resets if controller disconnects
});

function triggerKeyPress(keyName) {
  const event = new KeyboardEvent("keydown", {
    key: keyName,
    bubbles: true,
    cancelable: true
  });
  window.dispatchEvent(event); 
}

function handleSingleButtonPress(buttonIndex, simulatedKey) {
  if (gamepadIndex === null) return;
  const gamepads = navigator.getGamepads();
  const gp = gamepads[gamepadIndex];
  if (!gp || !gp.buttons[buttonIndex]) return;

  if (gp.buttons[buttonIndex].pressed) {
    if (!buttonCooldowns[buttonIndex]) {
      triggerKeyPress(simulatedKey);
      buttonCooldowns[buttonIndex] = true;
      setTimeout(() => { buttonCooldowns[buttonIndex] = false; }, 300); 
    }
  }
}

function simulateKeyboardInputs() {
  if (gamepadIndex === null) return;
  const gamepads = navigator.getGamepads();
  const gp = gamepads[gamepadIndex];
  
  if (!gp || !gp.buttons) return;

  // 1. D-Pad Mapping (Directions)
  if (gp.buttons[14] && gp.buttons[14].pressed) triggerKeyPress("ArrowLeft");
  if (gp.buttons[12] && gp.buttons[12].pressed) triggerKeyPress("ArrowUp");
  if (gp.buttons[15] && gp.buttons[15].pressed) triggerKeyPress("ArrowRight");
  if (gp.buttons[13] && gp.buttons[13].pressed) triggerKeyPress("ArrowDown");

  // 2. Button Mapping (1, 2, 3, 4, 5, 6 Keys)
  handleSingleButtonPress(0, "1"); // Switch 'B' Button
  handleSingleButtonPress(1, "2"); // Switch 'A' Button
  handleSingleButtonPress(2, "3"); // Switch 'Y' Button
  handleSingleButtonPress(3, "4"); // Switch 'X' Button
  handleSingleButtonPress(4, "5"); // Left Bumper (L)
  handleSingleButtonPress(5, "6"); // Right Bumper (R)
}
