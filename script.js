class Node{
    constructor(row, col, next = null){
        this.row = row,
            this.col=col,
            this.next = next
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


LinkedList.prototype.insertAtEnd = function(row, col){
// A newNode object is created with property data and next=null

    let newNode = new Node(row,col);
// When head = null i.e. the list is empty, then head itself will point to the newNode.
    if(!this.head){
        this.head = newNode;
        return this.head;
    }
// Else, traverse the list to find the tail (the tail node will initially be pointing at null), and update the tail's next pointer.
    let tail = this.head;
    while(tail.next !== null){
        tail = tail.next;
    }
    tail.next = newNode;
    return this.head;
}

LinkedList.prototype.deleteFirstNode = function(){
    if(!this.head){
        return;
    }
    this.head = this.head.next;
    return this.head;
}

LinkedList.prototype.deleteLastNode = function(){
    if(!this.head){
        return null;
    }
    // if only one node in the list
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





document.addEventListener("DOMContentLoaded", function(){
        // Handler when the DOM is fully loaded


        document.addEventListener('keypress', logKey);

        function logKey(e) {
            console.log(e.code);
            switch(e.code)
            {
                case "KeyI":
                    direction='up';
                    break;
                case 'KeyJ':
                    direction='left';
                    break;


            }

        }
//define your own arrow keys such as IJKL WASD

// above is the naive  implementation of a linkedlist in js to store 2d points.

        let list = new LinkedList();


        gameoverflag=false;



        var ctx = document.getElementById('grid').getContext('2d');

        emptycolor="rgb(100,45,0)"
        snakecolor="rgb(10,45,134)"
        foodcolor="rgb(0,245,100)"

        rownum=15;
        colnum=15;
        cellsize=22;
        inndercellsize=20;


        initializesnake();

        drawboard();

        randomfood();

        drawfood();
        drawsnake();

        function initializesnake()
        {
            snakerow= Math.floor(Math.random() * rownum);
            snakecol= Math.floor(Math.random() * colnum);

            list.insertAtBeginning(snakerow,snakecol);
            //list.insertAtBeginning(4,5);


        }

        function randomfood() {
            foodrow= Math.floor(Math.random() * rownum);
            foodcol= Math.floor(Math.random() * colnum);
        }

        function drawfood()
        {
            ctx.fillStyle = foodcolor;
            console.log("food:", foodrow, foodcol);

            ctx.beginPath();
            x=foodcol*cellsize;
            y=foodrow*cellsize;
            ctx.rect (x, y, inndercellsize, inndercellsize);
            ctx.fill();
            ctx.closePath();

        }

        function drawboard()
        {
            ctx.fillStyle = emptycolor;


            ctx.beginPath();

            for (var row = 0, i = 0; i < rownum; row+=cellsize, i++) {

                for (var col = 0, j=0; j < colnum; col+=cellsize, j++) {
                    ctx.rect (row, col, inndercellsize, inndercellsize);
                }
            }

            ctx.fill();
            ctx.closePath();
        }





// querySelector
//document.querySelector('#start');

        const paragraph = document.querySelector('p');

//alert("Hello! I am out!!");


        const s = document.getElementById('start')
        if(s){
            s.addEventListener('click', run, false);
            //alert("Hello! I am in  ddd ");
        }
        console.log(s, paragraph)

        function run() {
            if (s.value === 'Start') {
                s.value = 'Stop';

                setInterval (drawsnake, 500 );
                setInterval (growsnake, 1000 );

                //setTimeout(drawsnake, 3000)
                //setTimeout(growsnake, 2000)

                paragraph.textContent = 'The game has started!';
            } else {
                s.value = 'Start';
                paragraph.textContent = 'The Game is stopped.';
            }
        }

        direction='up';

        function collide(row1, col1, row2, col2)
        {
            if(row1==row2 && col1==col2)
                return true;
            else
                return false;
        }

        function hitfood(row, col)
        {

            if(collide(row, col,foodrow, foodcol))
                return true;
            else
                return false;

        }

        function hitself(newrow, newcol)
        {
            agent=list.head;
            while (agent!=null)
            {
                if (collide(newrow, newcol, agent.row, agent.col))
                    return true;

                agent=agent.next;
            }
            return false;
        }

        function growsnake() {
            if (gameoverflag==true)
                return;

//alert("interval")
            switch(direction)
            {
                case 'up':

                    newrow=list.head.row-1;
                    newcol=list.head.col;
                    break;
                case 'left':
                    newrow=list.head.row;
                    newcol=list.head.col-1;
                    //list.insertAtBeginning(newrow, newcol);
                    //list.deleteLastNode();
                    break;
            }


            if (hitself(newrow, newcol))
            {
                console.log("Game over!");
                gameoverflag=true;
            }
            list.insertAtBeginning(newrow, newcol);

            if (!hitfood(newrow, newcol))
                list.deleteLastNode();
            else
            {
                randomfood();
                drawfood();
            }

        }


        function drawsnake() {
            if (gameoverflag==true)
                return;

            drawboard();
            drawfood();

            ctx.beginPath();
            ctx.fillStyle=snakecolor;

            agent=list.head;
            while (agent!=null)
            {
                y=agent.row*cellsize;
                x=agent.col*cellsize;
                ctx.rect (x, y, inndercellsize, inndercellsize);
                agent=agent.next;
            }


            ctx.fill();
            ctx.closePath();
        }

        function drawsnake2() {


            ctx.beginPath();

            for (var i = 0; i < coords.length; i++) {
                var x = coords[i].x*cellsize;
                var y = coords[i].y*cellsize;
                ctx.fillStyle=snakecolor;
                ctx.rect (x, y, inndercellsize, inndercellsize);

            }


            ctx.fill();
            ctx.closePath();
        }



    }


);

//https://www.w3schools.com/tags/ref_canvas.asp
//

/*
function storeCoordinate(xVal, yVal, array) {
    array.push({x: xVal, y: yVal});
}

var coords = [];
storeCoordinate(1, 2, coords);
storeCoordinate(1, 3, coords);
storeCoordinate(2, 3, coords);

console.log(coords[0].x , coords[0].y)

// to loop through coordinate values
for (var i = 0; i < coords.length; i++) {
    var x = coords[i].x;
    var y = coords[i].y;
    console.log(x,y);
}
*/
