"use strict"

window.onload = function(){
    letsGo();
}

class Node{
    constructor(row, column, next = null){
            this.row = row;
            this.column = column;
            this.next = next;
    }
}

class LinkedList{
    constructor(){
        this.head = null;
    }
}

LinkedList.prototype.insertAtBeginning = function(row, column){
    let newNode = new Node(row, column);
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
                if (foodRow === agent.row && foodColumn === agent.column) {
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

                for (let column  = 0, j = 0; j < columnNumber; column += cellSize, j++) {
                    ctx.rect(row, column , innerCellSize, innerCellSize);
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
                paragraph.textContent = 'The Game is stopped! Click Reset to start a new Game!';
                gameOverFlag = true;
            }
        }

        let direction = 'up';

        function collide(row1, column1, row2, column2) {
            return row1 === row2 && column1 === column2;
        }

        function hitFood(row, col) {

            return !!collide(row, col, foodRow, foodColumn);
        }

        function hitSelfOrWall(newRow, newColumn) {
            let agent;
            agent = list.head;
            while (agent != null) {
                if (collide(newRow, newColumn, agent.row, agent.column)) {
                    alert("You hit yourself game over!");
                    startButton.value = 'Start';
                    paragraph.textContent = 'The Game is stopped! Click Reset to start a new Game!';
                    return true;
                }
                if (agent.row >= rowNumber || agent.column >= columnNumber || agent.row < 0 || agent.column < 0) {
                    alert("You went off the board!");
                    startButton.value = 'Start';
                    paragraph.textContent = 'The Game is stopped! Click Reset to start a new Game!';
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
                    newColumn = list.head.column;
                    break;
                case 'left':
                    newRow = list.head.row;
                    newColumn = list.head.column - 1;

                    break;
                case 'down':
                    newRow = list.head.row + 1;
                    newColumn = list.head.column;
                    break;
                case 'right':
                    newRow = list.head.row;
                    newColumn = list.head.column + 1;
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
                x = agent.column * cellSize;
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
            x = agent.column * cellSize;
            ctx.rect(x, y, innerCellSize, innerCellSize);
            ctx.fill();
            ctx.closePath();

            //Draw Head
            ctx.beginPath();
            ctx.fillStyle = headColor;
            agent = list.head;
            y = agent.row * cellSize;
            x = agent.column * cellSize;
            ctx.rect(x, y, innerCellSize, innerCellSize);
            ctx.fill();
            ctx.closePath();
        }


    }






