import {boardXSize, boardYSize, UpdateLights} from "../BoardManager";

let started = false
const currentPosition = [{x:0, y:0}];

export function ProcessDataSnake(data){
    if(!started){
        startGame();
        started = true;
    }else{
        // Move
    }
}

function startGame(){
    runApp = true;
    currentPosition[0].x = boardXSize/2;
    currentPosition[0].y = boardYSize/2;
    // Starts game Clock
    GameClock();
}
let runApp = false;
export function Stop(){
    runApp = false;
}

// Called once per frame
const MillisecondsPerFrame = 500;
let snakeDirection = 0;
let snakeLength = 1;
function GameClock(){
    // Stop game
    if(!runApp){
        return;
    }
    // Game logic
    // Move snake body
    for (let i = 0; i < snakeLength; i++) {
        currentPosition[i].x = currentPosition[i-1].x;
        currentPosition[i].y = currentPosition[i-1].y;
    }
    let xOffset = 0;
    let yOffset = 0;
    if(snakeDirection === 0){
        xOffset = 1;
    }else if(snakeDirection === 90){
        yOffset = 1;
    }else if(snakeDirection === 180){
        xOffset = -1;
    }else if(snakeDirection === 270){
        yOffset = -1;
    }
    currentPosition[0].x = currentPosition[1].x + xOffset;
    currentPosition[0].y = currentPosition[1].y + yOffset;
    updateLights();
    //
    setTimeout(GameClock, MillisecondsPerFrame);
}
function updateLights(){
    UpdateLights(1);

}