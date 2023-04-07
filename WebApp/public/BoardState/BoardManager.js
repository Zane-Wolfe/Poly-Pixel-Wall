export const boardXSize = 8;
export const boardYSize = 8;
//Constructor
function BoardManager(){

}

/**
 * The current state of the board
 *
 * States:
 * 0 = Main Menu
 * 1 = Playing Game
 * 2 = Playing animation
 * 3 = Displaying Image
 * 4 = Playing Videos
 *
 */
let currentBoardState = 0;

/**
 * The current application current open on the board
 *
 * Applications:
 * ~~~~~~~~~~~~~
 *  Games
 * 1-1 = Snake
 * 1-2 = TicTacToe
 * 1-3 = PacMan
 *
 * ~~~~~~~~~~~~~
 *  Animations
 * 2-1 = (insert here)
 * 2-2 = (insert here)
 * 2-3 = (insert here)
 * ~~~~~~~~~~~~~
 *  Images
 * 3-1 = Poly Logo
 * 3-2 = (insert here)
 * 3-3 = (insert here)
 * ~~~~~~~~~~~~~
 *  Videos
 * 4-1 = (insert here)
 * 4-2 = (insert here)
 * 4-3 = (insert here)
 */
let currentApp = 0;

/**
 * Main function for receiving board input data
 * @param data
 * @param boardState
 * @param selectedApp
 * @constructor
 */

export function ProcessData(data, boardState, selectedApp){
    // If input is received and application has not been changed, have that application process the input.
    if(boardState === currentBoardState && selectedApp === currentApp){
        ProcessInput(data)
    }else{
        // Change board to a new mode.
    }
}

// Import ProcessData(Application) to add a new application
// Call ProcessData(Application) to have that app process the new input
import { ProcessDataSnake, Stop } from "./Games/Snake";

function ProcessInput(data){
    if(CurrentAppFile === null) return;
    if(currentBoardState === 0){

    }else if(currentBoardState === 1){
        if(currentApp === 1){
            ProcessDataSnake(data)
        }
    }else if(currentBoardState === 2){

    }else if(currentBoardState === 3){

    }else if(currentBoardState === 4){

    }else{
        // Something went wrong
    }
}

export function UpdateLights(data){

}

