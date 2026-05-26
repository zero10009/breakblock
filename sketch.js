let gameState = 0;
let padAngle = 0;
let stageColor;
let stage = 1;
let timer = 180;
let backgroundMusic;
let score = 0;
let shakeTime = 0;
let xPos, xDir;
let yPos, yDir;
let diam;
let speed;
let retryButton;
let padX;
let padWidth; 
let padY; 


let reflectorX, reflectorY;
let reflectorWidth, reflectorHeight;
let reflectorSpeed;

let bricks = [];

function preload() {
  backgroundMusic = loadSound('moodmode-level-vii-short-258782.mp3');
  brickSound = loadSound('freesound_community-bricks-104933.mp3');
}

function setup() {
  createCanvas(600, 800);
  
  retryButton = createButton('다시하기');
  retryButton.position(width / 2 - 50, height / 2 + 50);
  retryButton.size(100, 40);
  retryButton.style('font-size', '16px');
  retryButton.mousePressed(resetgame);
  retryButton.hide();

  variableInitialization();
}

function draw() {
  checkStageClear();
  
  if (gameState === 1){
    if (shakeTime > 0){
      translate(random(-8, 8), random(-8, 8));
      shakeTime --;
    }

    if (!(backgroundMusic.isPlaying())){
        backgroundMusic.play();
    }
    retryButton.hide();
    drawGameScene();
    
    ballBouncing();
    bricksBallCollision();
    reflectorCollision();
  }
  
  else if (gameState === 0){
  backgroundMusic.stop();
    
  drawGameScene();  
  showReady();

  timer --;
  if (timer === 0){
    gameState = 1;
  }
  }
  
  else if (gameState === 2){
  backgroundMusic.stop(); 
  push();
  fill(255, 111, 97);
  textSize(50);
  textAlign(CENTER, CENTER);
  text("GAME OVER", width/2, height/2 - 80);
  pop();
  
  push();
  fill(255, 150);       
  textSize(20);         
  textAlign(CENTER, CENTER);
  textFont('sans-serif');
  noStroke();        
  text("SCORE  " + score, width/2, height/2);
  pop();
    
  retryButton.show();
  }
}


function bricksDrawing(){
  push();
  noStroke();
  fill(stageColor);

  for(let r = 0; r < bricks.length; r++){
    for(let c = 0; c < bricks[r].length; c++){
      if ( bricks[r][c] === 1) {
        rect(c * 50 + 3, r * 50 + 3, 44, 44, 4);
      }
    }
  }
  pop();
}

function bricksBallCollision(){
  let ballLeft = xPos - diam/2;
  let ballRight = xPos + diam/2;
  let ballTop = yPos - diam/2;
  let ballBottom = yPos + diam/2;

  for(let r = 0; r < bricks.length; r++){
    for(let c = 0; c < bricks[r].length; c++){
      if (bricks[r][c] === 1) {
        let brickLeft = c * 50 + 3;
        let brickRight = brickLeft + 44;
        let brickTop = r * 50 + 3;
        let brickBottom = brickTop + 44;
        if (ballRight > brickLeft && ballLeft < brickRight && ballBottom > brickTop && ballTop < brickBottom) {
          bricks[r][c] = 0; 
          score += 50;
          shakeTime = 10;
          brickSound.play();
          let overlapX = min(ballRight - brickLeft, brickRight - ballLeft);
          let overlapY = min(ballBottom - brickTop, brickBottom - ballTop);

          if (overlapX < overlapY) {
            xDir *= -1;
            if (xPos < (brickLeft + brickRight)/2) xPos -= overlapX;
            else xPos += overlapX;
          } else {
            yDir *= -1;
            if (yPos < (brickTop + brickBottom)/2) yPos -= overlapY;
            else yPos += overlapY;
          }
          return;
        }
      }
    }
  }
}

function variableInitialization(){
  stageColor = color(random(100, 255), random(100, 255), random(100, 255));
  speed = 7;
  xPos = width / 2;
  xDir = speed;
  yPos = height / 2 + 200;
  yDir = speed;
  diam = 25;
  padWidth = 100;
  padY = height - 25; 
  padX = width / 2 - padWidth / 2;
  
  retryButton.hide();
  reflectorWidth = 150;
  reflectorHeight = 15;
  reflectorX = width / 2 - reflectorWidth / 2;
  reflectorY = height / 2 + 50;
  reflectorSpeed = 4
  
  let rows = 3;   
  let cols = 12;   
  
  for (let r = 0; r < rows; r++) {
    bricks[r] = [];
    for (let c = 0; c < cols; c++) {
      // 50% 확률로 벽돌 생성
      if (random(1) > 0.5) {
        bricks[r][c] = 1;
      } else {
        bricks[r][c] = 0;
      }
    }
  }
}

function checkStageClear() {
  let brickCount = 0;
  for (let r = 0; r < bricks.length; r++) {
    for (let c = 0; c < bricks[r].length; c++) {
      if (bricks[r][c] === 1) {
        brickCount++;
      }
    }
  }
  
  //if (brickCount === 0){
  if (brickCount === 0 && gameState === 1){
    stage ++;
    timer = 180;
    gameState = 0;
    
    variableInitialization();
  }
}

function ballDrawingMovement(){
  push();
  noStroke();
  fill(255, 111, 97);
  ellipse(xPos, yPos, diam, diam);
  if(gameState === 1){
    xPos = xPos + xDir;
    yPos = yPos + yDir;
  }
  pop();
}

function padDrawingMovement(){
  push();
  noStroke();
  if(gameState === 1){
  padX = mouseX - padWidth/2;
  padX = constrain(padX, 0, width - padWidth);
  }
  fill(255);
  rect(padX, padY, padWidth, 12, 6);
  pop();
}





function ballBouncing(){
  if ( xPos - diam/2 < 0) {
    xPos = diam/2;
    xDir = xDir * -1; 
  }
  if ( xPos + diam/2 > width) {
    xPos = width - diam/2;
    xDir *= -1;
  }

  if ( yPos - diam/2 < 0) {
    yPos = diam/2;
    yDir *= -1; 
  }
  if ( yPos + diam/2 > height) {
    gameState = 2;
  }

  let ballLeft = xPos - diam/2;
  let ballRight = xPos + diam/2;
  let ballTop = yPos - diam/2;
  let ballBottom = yPos + diam/2;

  let padLeft = padX;
  let padRight = padX + padWidth;
  let padTop = padY;
  let padBottom = padY + 12;

  if (ballRight > padLeft && ballLeft < padRight &&
      ballBottom > padTop && ballTop < padBottom) {
    
    if (yDir > 0) {
      yPos = padY - diam/2; 
      yDir *= -1;
    }
  }
}

function showReady(){
  push();
  fill(255, 150);       
  textSize(30);         
  textFont('sans-serif');
  noStroke();        
  textAlign(CENTER, CENTER);
  text('READY?', width / 2, height / 2);
  pop();
}

function drawGameScene() {
  background(30);

  bricksDrawing();
  ballDrawingMovement();
  padDrawingMovement();
  reflectorDrawingMovement();
  
  push();
  fill(255, 150);       
  textSize(20);         
  textFont('sans-serif');
  noStroke();        
  textAlign(LEFT, TOP);
  text("SCORE  " + score, 25, 25);
  textAlign(RIGHT, TOP);
  text("STAGE  " + (stage), width - 25, 25);
  pop();
}

function mouseWheel(event) {
  if (gameState === 1) {
    if (event.delta > 0) {
      padWidth += 15;
      speed += 0.5; 
    } else {
      padWidth -= 15;
      speed -= 0.5;
    }
    
    speed = constrain(speed, 3, 15);
    padWidth = constrain(padWidth, 50, 250);
  
  
  if (xDir > 0) {
      xDir = speed;       
    } else {
      xDir = -speed;      
    }

    if (yDir > 0) {
      yDir = speed;       
    } else {
      yDir = -speed;      
    }
  }
  
  return false;
} 


function resetgame() {
  score = 0;
  stage = 1;
  timer = 180; 
  variableInitialization();
  
  retryButton.hide();
  gameState = 0; 
}

function reflectorDrawingMovement() {
  push();
  noStroke();
  fill(255, 204, 0); 
  rect(reflectorX, reflectorY, reflectorWidth, reflectorHeight, 6);
  
  if (gameState === 1) {
    reflectorX += reflectorSpeed;
    if (reflectorX <= 0 || reflectorX + reflectorWidth >= width) {
      reflectorSpeed *= -1;
    }
  }
  pop();
}

function reflectorCollision() {
  let ballLeft = xPos - diam/2;
  let ballRight = xPos + diam/2;
  let ballTop = yPos - diam/2;
  let ballBottom = yPos + diam/2;

  let rLeft = reflectorX;
  let rRight = reflectorX + reflectorWidth;
  let rTop = reflectorY;
  let rBottom = reflectorY + reflectorHeight;

  if (ballRight > rLeft && ballLeft < rRight && ballBottom > rTop && ballTop < rBottom) {
    let overlapX = min(ballRight - rLeft, rRight - ballLeft);
    let overlapY = min(ballBottom - rTop, rBottom - ballTop);

    if (overlapX < overlapY) {
      xDir *= -1;
      if (xPos < (rLeft + rRight)/2) xPos -= overlapX;
      else xPos += overlapX;
    } else {
      yDir *= -1;
      if (yPos < (rTop + rBottom)/2) yPos -= overlapY;
      else yPos += overlapY;
    }
  }
}
