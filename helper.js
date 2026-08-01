
// Helper functions


// request() function: 
// waits (delay) milliseconds before 
//calling requestAnimationFrame() 
//with myFunction() 

function request(myFunction){
    setTimeout(requestAnimationFrame, delay, myFunction);
  }
  
  // event handler for key down event 
  function handleKey(e){
    if (e.key == "ArrowLeft") {          
      dx = -size; 
      dy = 0;
    } else if (e.key == "ArrowUp") {       
      dx = 0; 
      dy = -size;
    } else if (e.key == "ArrowRight") {    
      dx = size; 
      dy = 0;
    } else if (e.key == "ArrowDown") {   
      dx = 0; 
      dy = size;
    } else if (e.key == "1"){
      if(delay <= 250){
        delay += 50;
      } else if(delay == 300){
        delay = 50;
      }
    } else if (e.key == "2"){
      hardmode = !hardmode;
    } else if (e.key == "3"){
      // 1. Move to the next color first
      colorIndex += 1;
      
      // 2. Wrap back around if we run out of colors in the array
      if (colorIndex >= palette.length) {
          colorIndex = 0;
      }; 
    } else if (e.key == "4"){
      if(appleNum <= 9){
        appleNum += 1;
        apple.push({
            x: (Math.ceil(Math.random() * 20) - 1) * 20,
            y: (Math.ceil(Math.random() * 20) - 1) * 20
        });
      };
    } else if (e.key == "5"){
      if(appleNum >= 1){
        appleNum += -1;
        apple.pop();
      };
    } else if (e.key == "6"){
      yYMode = !yYMode;
    
    if (yYMode) {
      // Calculate the exact horizontal reflection opposite of your head position
      let mirrorStartX = 400 - sx - size;

      yYSnake = [
            { x: mirrorStartX, y: sy },
            { x: mirrorStartX, y: sy }
      ];
      } else {
        yYSnake = []; 
      }
    }; 
  };
  

  // returns random number between 0 and max (multiple of tile size) 
  function randomNum(max){
    return Math.floor(Math.random()*max/size)*size; 
  }
  
  // returns true if the snake is touching itself 
  function touchingSelf(){
    var front = snake.length - 1; 
    
    // 1. Existing check: If main snake head touches its own body
    for (var i=0; i<front; i++){
      if (snake[i].partX == snake[front].partX && snake[i].partY == snake[front].partY) return true;
    }

    // 2. New check: If main snake head touches ANY part of the mirror snake
    if (yYMode) {
      for (var j=0; j<yYSnake.length; j++) {
        if (yYSnake[j].x == snake[front].partX && yYSnake[j].y == snake[front].partY) {
          return true;
        }
      }
    }
  };

  
  // returns true if snake is touching edge 
  function touchingEdge(){
    // Check if the snake head's coordinates go completely outside the 400x400 board boundaries
    return (sx < 0 || sy < 0 || sx >= canvas.width || sy >= canvas.height);
  }
  // draws large text centered on the screen 
  function drawTextGameOver(text){
   c.fillStyle = "red";
   c.font = "bold 50px Arial";
   c.textAlign = "center";
   c.fillText(text, canvas.width/2, canvas.height/2); 
  }
  
  // draws text (score) on the bottom left corner
  function drawScore(text){
   c.fillStyle = "white";
   c.font = "bold 20px Arial";
   c.textAlign = "left";
   c.fillText(text, 20, canvas.height-20); 
  }
  
  // updates snake array 
  function updateSnakeArray(){
    // create new object to hold x & y position of head
    var head = {x: snakeX, y: snakeY};
    // add new part to snake array (head)
    snake.push(head); 
    // remove first item in snake array
    while (snake.length > length) snake.shift(); 
  }
  
  ////////////////////////////////// 
  /*      ADD YOUR OWN IMAGE!       */
  //////////////////////////////////
  
  
  
  // draws an image for the snake head
  function drawSnakeHead(){
    var snakehead = new Image();
    snakehead.src = "snakehead.png";
    c.drawImage(snakehead, snakeX, snakeY, size, size);
  }
  