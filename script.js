let boardWidth = 360; 
let boardHeight = 640; 
let backgroundImg = new Image(); 
let audio = new Audio();
backgroundImg.src = "./Images/flappybirdbg.png"; 
let inputLocked = false; 
let jose =["./Jose/1.png","./Jose/2.png","./Jose/3.png","./Jose/4.png"]
let sound =["./Audio/aiva.mp3","./Audio/nice.mp3","./Audio/goated.mp3","./Audio/moonji.mp3","./Audio/vattada.mp3","./Audio/adhyayitta immathiri.mp3",]
document.addEventListener("keydown", handleKeyDown); 
document.addEventListener("click", handleClick);
document.addEventListener("touchstart", handleClick);
let lastTime = 0;


let GAME_STATE = {
    MENU: "menu",
    PLAYING: "playing", 
    GAME_OVER: "gameOver"
}; 
let currentState = GAME_STATE.MENU;

let playButton = {
    x: boardWidth / 2 - 115.5 / 2,
    y: boardHeight / 2 - 64 / 2,
    width: 115,
    height: 64
};

let logo = {
    x: boardWidth / 2 - 300 / 2,
    y: boardHeight / 4,
    width: 300,
    height: 100
}; 

let flappyBirdTextImg = new Image();
flappyBirdTextImg.src = "./Images/pojologo.png";

let gameOverImg = new Image(); 
gameOverImg.src = "./Images/flappy-gameover.png";

let bird = {
    x: 50,
    y: boardHeight / 2,
    width: 100,
    height: 100
}

let velocityY = 0;
let velocityX = -6;
let gravity = 0.5; 
let birdY = boardHeight / 2; 
let pipeWidth = 60; 
let pipeGap = 280; 
let pipeArray = []; 
let pipeIntervalId = 1; 

function placePipes() {
    createPipes();
}

function createPipes() {
    let maxTopPipeHeight = boardHeight - pipeGap - 50;
    let topPipeHeight = Math.floor(Math.random() * maxTopPipeHeight); 
    let bottomPipeHeight = boardHeight - topPipeHeight - pipeGap;

    let topPipe = {
        x: boardWidth,
        y: 0,
        width: pipeWidth, 
        height: topPipeHeight,
        img: topPipeImg,
        passed: false
    };

    let bottomPipe = {
        x: boardWidth, 
        y: topPipeHeight + pipeGap, 
        width: pipeWidth, 
        height: bottomPipeHeight,
        img: bottomPipeImg,
        passed: false
    };
    pipeArray.push(topPipe, bottomPipe); 
        ; 
    
}

window.onload = function() {
    board = document.getElementById("board"); 
    board.height = boardHeight; 
    board.width = boardWidth;
    context = board.getContext("2d"); 

    birdImg = new Image(); 
    birdImg.src = jose[0]; 

    topPipeImg = new Image();
    topPipeImg.src = "./Images/toppipe.png"; 

    bottomPipeImg = new Image(); 
    bottomPipeImg.src = "./Images/bottompipe.png"; 

    playButtonImg = new Image(); 
    playButtonImg.src = "./Images/playbutton.png"; 
    playButton.height ="200"
    playButton.width ="200"
    playButton.x = "90"
    playButton.y = "230"

    requestAnimationFrame(update); 
}

function update(timestamp) {
    requestAnimationFrame(update);

    let deltaTime = (timestamp - lastTime) / 1000; // in seconds
    lastTime = timestamp;

    if (!deltaTime) return;

    context.clearRect(0, 0, board.width, board.height);

    if (currentState === GAME_STATE.MENU) {
        renderMenu();
    } else if (currentState === GAME_STATE.PLAYING) {
        renderGame(deltaTime);
    } else if (currentState === GAME_STATE.GAME_OVER) {
        renderGameOver();
    }
}


function renderMenu() {
    if(backgroundImg.complete) {
        context.drawImage(backgroundImg, 0, 0, boardWidth, boardHeight); 
    }

    if(playButtonImg.complete) {
        context.drawImage(playButtonImg, playButton.x, playButton.y, playButton.width, playButton.height); 
    }

    if(flappyBirdTextImg.complete) {
        let scaledWidth = logo.width; 
        let scaledHeight = (flappyBirdTextImg.height / flappyBirdTextImg.width) * scaledWidth; 
        context.drawImage(flappyBirdTextImg, logo.x, logo.y, scaledWidth, scaledHeight); 
    }
}

function renderGame(deltaTime) {
    velocityY += gravity * deltaTime * 60;
    bird.y = Math.max(bird.y + velocityY * deltaTime * 60, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        currentState = GAME_STATE.GAME_OVER;
    }

    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX * deltaTime * 60;

        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            if (Number.isInteger(score)) {
                birdImg.src = jose[Math.floor(Math.random() * 4)];
                audio.src = sound[Math.floor(Math.random() * 4)];
                audio.play();
            }
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            currentState = GAME_STATE.GAME_OVER;
        }
    }

    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.textAlign = "left";
    context.fillText(score, 5, 45);
}


function renderGameOver() {
    if(gameOverImg.complete) {
        let imgWidth = 400; 
        let imgHeight = 80; 
        let x = (boardWidth - imgWidth) / 2; 
        let y = boardHeight / 3;

        context.drawImage(gameOverImg, x, y, imgWidth, imgHeight); 

        let scoreText = `Your score: ${Math.floor(score)}`; 
        context.fillStyle = "white"; 
        context.font = "45px sans-serif"; 
        context.textAlign = "center"; 
        context.fillText(scoreText, boardWidth / 2, y + imgHeight + 50); 

        inputLocked = true; 
        setTimeout(() => {
            inputLocked = false;
        }, 1000);
    }
}

function handleKeyDown(e) {
    if(inputLocked) return; 

    if(e.code === "Space" ||e.code === "click" ) {
        if(currentState === GAME_STATE.MENU) {
            startGame(); 
        } else if(currentState === GAME_STATE.GAME_OVER) {
            resetGame();
            currentState = GAME_STATE.MENU;
        } else if(currentState === GAME_STATE.PLAYING) {
            velocityY = -10;
        }
    }
}
function handleClick() {
    if (inputLocked) return;

    if (currentState === GAME_STATE.MENU) {
        startGame();
    } else if (currentState === GAME_STATE.GAME_OVER) {
        resetGame();
        currentState = GAME_STATE.MENU;
    } else if (currentState === GAME_STATE.PLAYING) {
        velocityY = -7;
    }
}

function startGame() {
    currentState = GAME_STATE.PLAYING; 
    audio.src = sound[5];
    audio.play();
    bird.y = birdY; 
    velocityY = 0; 
    pipeArray = []; 
    score = 0;

    if(pipeIntervalId) {
        clearInterval(pipeIntervalId);
    }

    pipeIntervalId = setInterval(placePipes, 1500); 
}

function resetGame() {
    bird.y = birdY;
    pipeArray = []; 
    score = 0;
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x && 
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}
