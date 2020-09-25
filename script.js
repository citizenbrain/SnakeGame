"use strict"

window.onload = function(){
    letsgo();
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
// A newNode object is created with property data and next = null
    let newNode = new Node(row, col);
// The pointer next is assigned head pointer so that both pointers now point at the same node.
    newNode.next = this.head;
// As we are inserting at the beginning the head pointer needs to now point at the newNode.

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

function letsgo(){
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

        let gameoverflag = false;
        let ctx = document.getElementById('grid').getContext('2d');

        let emptycolor = "rgb(100,45,0)";
        let snakecolor = "rgb(10,45,134)";
        let foodcolor = "rgb(0,245,100)";
        let headcolor = "rgb(0,100,100)";
        let tailcolor = "rgb(0,100,0)";
        let foodrow;
        let foodcol;
        let rownum = 19;
        let colnum = 19;
        let cellsize = 21;
        let inndercellsize = 20;


        initializesnake();
        drawboard();
        randomfood();
        drawfood();
        drawsnake();

        function initializesnake() {
            let snakerow;
            snakerow = Math.floor(Math.random() * rownum);
            let snakecol;
            snakecol = Math.floor(Math.random() * colnum);

            list.insertAtBeginning(snakerow, snakecol);
        }

        function randomfood() {
            let agent = list.head;
            foodrow = Math.floor(Math.random() * rownum);
            foodcol = Math.floor(Math.random() * colnum);
            while (agent != null) {
                if (foodrow === agent.row && foodcol === agent.col) {
                    randomfood();
                }
                agent = agent.next;
            }
        }

        function drawfood() {
            ctx.fillStyle = foodcolor;
            ctx.beginPath();
            let x = foodcol * cellsize;
            let y = foodrow * cellsize;
            ctx.rect(x, y, inndercellsize, inndercellsize);
            ctx.fill();
            ctx.closePath();
        }

        function drawboard() {
            ctx.fillStyle = emptycolor;
            ctx.beginPath();

            for (let row = 0, i = 0; i < rownum; row += cellsize, i++) {

                for (let col = 0, j = 0; j < colnum; col += cellsize, j++) {
                    ctx.rect(row, col, inndercellsize, inndercellsize);
                }
            }
            ctx.fill();
            ctx.closePath();
        }

        let paragraph = document.querySelector('p');
        let s = document.getElementById('start')

        if (s) {
            s.addEventListener('click', run, false);
        }
        console.log(s, paragraph)

        function run() {
            if (s.value === 'Start') {
                s.value = 'Stop';

                setInterval(drawsnake, 300);
                setInterval(growsnake, 300);

                paragraph.textContent = 'The game has started!';
            } else {
                s.value = 'Start';
                paragraph.textContent = 'The Game is stopped.';
            }
        }

        let direction = 'up';

        function collide(row1, col1, row2, col2) {
            return row1 === row2 && col1 === col2;
        }

        function hitfood(row, col) {

            return !!collide(row, col, foodrow, foodcol);
        }

        function hitSelfOrWall(newrow, newcol) {
            let agent;
            agent = list.head;
            while (agent != null) {
                if (collide(newrow, newcol, agent.row, agent.col)) {
                    alert("You hit yourself game over!");
                    s.value = 'Start';
                    paragraph.textContent = 'The Game is stopped.';
                    return true;
                }
                if (agent.row >= rownum || agent.col >= colnum || agent.row < 0 || agent.col < 0) {
                    alert("You went off the board!");
                    s.value = 'Start';
                    paragraph.textContent = 'The Game is stopped.';
                    return true;
                }

                agent = agent.next;
            }
            return false;
        }

        function growsnake() {
            if (gameoverflag === true) {
                list.head = null;
                return;
            }
            let newcol;
            let newrow;
            switch (direction) {
                case 'up':
                    newrow = list.head.row - 1;
                    newcol = list.head.col;
                    break;
                case 'left':
                    newrow = list.head.row;
                    newcol = list.head.col - 1;

                    break;
                case 'down':
                    newrow = list.head.row + 1;
                    newcol = list.head.col;
                    break;
                case 'right':
                    newrow = list.head.row;
                    newcol = list.head.col + 1;
            }

            if (hitSelfOrWall(newrow, newcol)) {
                gameoverflag = true;
            }


            list.insertAtBeginning(newrow, newcol);


            if (!hitfood(newrow, newcol))
                list.deleteLastNode();
            else {
                randomfood();
                drawfood();
            }
        }

        function drawsnake() {
            if (gameoverflag === true) {
                list.head = null;
                return;
            }

            drawboard();
            drawfood();
            let x, y;
            //Draw Body
            ctx.beginPath();
            ctx.fillStyle = snakecolor;
            let agent = list.head;
            while (agent != null) {
                y = agent.row * cellsize;
                x = agent.col * cellsize;
                ctx.rect(x, y, inndercellsize, inndercellsize);
                agent = agent.next;
            }
            ctx.fill();
            ctx.closePath();

            //Draw Tail
            ctx.beginPath();
            ctx.fillStyle = tailcolor;
            agent = list.head;
            while (agent.next != null) {
                agent = agent.next;
            }
            y = agent.row * cellsize;
            x = agent.col * cellsize;
            ctx.rect(x, y, inndercellsize, inndercellsize);
            ctx.fill();
            ctx.closePath();

            //Draw Head
            ctx.beginPath();
            ctx.fillStyle = headcolor;
            agent = list.head;
            y = agent.row * cellsize;
            x = agent.col * cellsize;
            ctx.rect(x, y, inndercellsize, inndercellsize);
            ctx.fill();
            ctx.closePath();
        }


    }






