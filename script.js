"use strict"

window.onload = function(){
    letsGo();
}

class Node{
    constructor(row, col, next = null){
            this.row = row;
            this.col = col;
            this.next = next;
    }
}

class LinkedList{
    constructor(){
        this.head = null;
    }
}

LinkedList.prototype.insertAtBeginning = function(row, col){
    let newNode = new Node(row, col);
    newNode.next = this.head;
    this.head = newNode;
    return this.head;
}

LinkedList.prototype.deleteLastNode = function(){

    if(!this.head){
        return null;
    }

    if(!this.head.next){
        this.head = null;
        return;
    }

    let previous = this.head;
    let tail = this.head.next;

    while(tail.next !== null){
        previous = tail;
        tail = tail.next;
    }

    previous.next = null;
    return this.head;
}

//Main Function
function letsGo(){
        document.addEventListener('keypress', logKey);

        function logKey(e) {
            console.log(e.code);
            switch (e.code) {
                case "KeyI":
                    direction = 'up';
                    break;
                case 'KeyJ':
                    direction = 'left';
                    break;
                case 'KeyK':
                    direction = 'down';
                    break;
                case 'KeyL':
                    direction = 'right';
                    break;
            }
        }

        let list = new LinkedList();
        let gameOverFlag = false;
        let ctx = document.getElementById('grid').getContext('2d');
        let emptyColor = "rgb(100,45,0)";
        let snakeColor = "rgb(10,45,134)";
        let foodColor = "rgb(0,245,100)";
        let headColor = "rgb(0,100,100)";
        let tailColor = "rgb(0,100,0)";
        let foodRow;
        let foodColumn;
        let rowNumber = 19;
        let columnNumber = 19;
        let cellSize = 21;
        let innerCellSize = 20;

        initializeSnake();
        drawBoard();
        randomFood();
        drawFood();
        drawSnake();

        function initializeSnake() {
            let snakeRow = Math.floor(Math.random() * rowNumber);
            let snakeColumn = Math.floor(Math.random() * columnNumber);

            list.insertAtBeginning(snakeRow, snakeColumn);
        }

        function randomFood() {
            let agent = list.head;
            foodRow = Math.floor(Math.random() * rowNumber);
            foodColumn = Math.floor(Math.random() * columnNumber);
            while (agent != null) {
                if (foodRow === agent.row && foodColumn === agent.col) {
                    randomFood();
                }
                agent = agent.next;
            }
        }

        function drawFood() {
            ctx.fillStyle = foodColor;
            ctx.beginPath();
            let x = foodColumn * cellSize;
            let y = foodRow * cellSize;
            ctx.rect(x, y, innerCellSize, innerCellSize);
            ctx.fill();
            ctx.closePath();
        }

        function drawBoard() {
            ctx.fillStyle = emptyColor;
            ctx.beginPath();

            for (let row = 0, i = 0; i < rowNumber; row += cellSize, i++) {

                for (let col = 0, j = 0; j < columnNumber; col += cellSize, j++) {
                    ctx.rect(row, col, innerCellSize, innerCellSize);
                }
            }
            ctx.fill();
            ctx.closePath();
        }

        let paragraph = document.querySelector('p');
        let startButton = document.getElementById('start')

        if (startButton) {
            startButton.addEventListener('click', run, false);
        }
        console.log(startButton, paragraph)

        function run() {
            if (startButton.value === 'Start') {
                startButton.value = 'Stop';

                setInterval(drawSnake, 400);
                setInterval(growSnake, 400);

                paragraph.textContent = 'The Game has started!';
            } else {
                startButton.value = 'Start';
                paragraph.textContent = 'The Game is stopped! Click Reset to start a new game!';
                gameOverFlag = true;
            }
        }

        let direction = 'up';

        function collide(row1, col1, row2, col2) {
            return row1 === row2 && col1 === col2;
        }

        function hitFood(row, col) {

            return !!collide(row, col, foodRow, foodColumn);
        }

        function hitSelfOrWall(newrow, newcol) {
            let agent;
            agent = list.head;
            while (agent != null) {
                if (collide(newrow, newcol, agent.row, agent.col)) {
                    alert("You hit yourself game over!");
                    startButton.value = 'Start';
                    paragraph.textContent = 'The Game is stopped! Click Reset to start a new game!';
                    return true;
                }
                if (agent.row >= rowNumber || agent.col >= columnNumber || agent.row < 0 || agent.col < 0) {
                    alert("You went off the board!");
                    startButton.value = 'Start';
                    paragraph.textContent = 'The Game is stopped! Click Reset to start a new game!';
                    return true;
                }

                agent = agent.next;
            }
            return false;
        }

        function growSnake() {
            if (gameOverFlag === true) {
                startButton.removeEventListener('click', run, false);
                return;
            }
            let newColumn;
            let newRow;
            switch (direction) {
                case 'up':
                    newRow = list.head.row - 1;
                    newColumn = list.head.col;
                    break;
                case 'left':
                    newRow = list.head.row;
                    newColumn = list.head.col - 1;

                    break;
                case 'down':
                    newRow = list.head.row + 1;
                    newColumn = list.head.col;
                    break;
                case 'right':
                    newRow = list.head.row;
                    newColumn = list.head.col + 1;
            }

            if (hitSelfOrWall(newRow, newColumn)) {
                gameOverFlag = true;
            }

            list.insertAtBeginning(newRow, newColumn);

            if (!hitFood(newRow, newColumn))
                list.deleteLastNode();
            else {
                randomFood();
                drawFood();
            }
        }

        function drawSnake() {
            if (gameOverFlag === true) {
                startButton.removeEventListener('click', run, false);
                return;
            }

            drawBoard();
            drawFood();
            let x, y;

            //Draw Body
            ctx.beginPath();
            ctx.fillStyle = snakeColor;
            let agent = list.head;
            while (agent != null) {
                y = agent.row * cellSize;
                x = agent.col * cellSize;
                ctx.rect(x, y, innerCellSize, innerCellSize);
                agent = agent.next;
            }
            ctx.fill();
            ctx.closePath();

            //Draw Tail
            ctx.beginPath();
            ctx.fillStyle = tailColor;
            agent = list.head;
            while (agent.next != null) {
                agent = agent.next;
            }
            y = agent.row * cellSize;
            x = agent.col * cellSize;
            ctx.rect(x, y, innerCellSize, innerCellSize);
            ctx.fill();
            ctx.closePath();

            //Draw Head
            ctx.beginPath();
            ctx.fillStyle = headColor;
            agent = list.head;
            y = agent.row * cellSize;
            x = agent.col * cellSize;
            ctx.rect(x, y, innerCellSize, innerCellSize);
            ctx.fill();
            ctx.closePath();
        }


    }






