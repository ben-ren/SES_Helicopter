"use strict";

/*	Name:	Benjamin rendell
	Number:	44655010 */

const InputClass = function() {
    const input = this;

    input.leftPressed = false;
    input.rightPressed = false;
    input.upPressed = false;
    input.downPressed = false;

	//checks for key press down
    input.onKeyDown = function(event) {
        switch (event.key) {
            case "ArrowLeft": 
                input.leftPressed = true;
                break;

            case "ArrowRight": 
                input.rightPressed = true;
                break;

            case "ArrowDown":
                input.downPressed = true;
                break;

            case "ArrowUp":
                input.upPressed = true;
                break;
        }
    }

	//checks for when key goes up
    input.onKeyUp = function(event) {
        switch (event.key) {
            case "ArrowLeft": 
                input.leftPressed = false;
                break;

            case "ArrowRight": 
                input.rightPressed = false;
                break;

            case "ArrowDown":
                input.downPressed = false;
                break;

            case "ArrowUp":
                input.upPressed = false;
                break;
        }
    }

    document.addEventListener("keydown", input.onKeyDown);
    document.addEventListener("keyup", input.onKeyUp);

}

// global inputManager variable
const Input = new InputClass();