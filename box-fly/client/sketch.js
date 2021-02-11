var wid = 800;
var hei = 400;

var rad = 70;
var posX = wid/2;
var posY = hei-(rad/2);
var allRain = [];
var life = 3;
var lifeScore = 0;
var score = 0;

// var box1 = newBox(100);
// var box2 = newBox(-200);

var allBoxes = [];
var allBoxX = [];
var amma;
var gameOver = false;
var createdRstBtn = false;

var playGame = false;
var onMobile = false;


function preload(){
    // amma = loadFont("/client/AmmaGrotesk-Regular.woff");
    // textFont(amma);
}

function setup(){
    if(window.innerWidth < 600){
        onMobile = true;
    }
    console.log("setting up sketch");
// window.alert(window.innerWidth);
    if(onMobile){
        var cnv = createCanvas(window.innerWidth, window.innerHeight);
        var gameContainer = document.getElementById("game-container");
        cnv.parent(gameContainer);
        background(8,10,255);
        angleMode(DEGREES);
        // rotate(-90)
        rotate(90)
        textSize(26);
        fill(255);
        text("Use your phone to steer!",width/2, -height/2);
        window.addEventListener('deviceorientation', handleOrientation);
        // noLoop();
    } else {
        var cnv = createCanvas(wid, hei , WEBGL);
        var gameContainer = document.getElementById("game-container");
        cnv.parent(gameContainer);
// alert(window.innerWidth);

        background(120);
        wid = width;
        hei = height;
    }
    amma = loadFont("/client/AmmaGrotesk-Regular.woff");
    textFont(amma);


    // window.setTimeout(() => {beginGame = true}, 3000);

}

function startTheGame(){
    playGame = true;
}


function draw(){
    // console.log(playGame)
    if(!playGame){
        return;
    }
    // translate(0,0);
    if(onMobile){
        // console.log("on moblie")
        if(!gameOver){
            background(8,10,255);
            angleMode(DEGREES);
            // rotate(90)
            textSize(26);
            fill(255);
            text("Use your phone to steer!",width/2, -height/2);
        } else {
            // displayGameOverMobile();
        }

    } else {

        background(120);
        displayInfo();
        translate(posX, 0);
        // pop();
        if(!gameOver){
            drawBoxes();
        } else {
            // background(33)]'
            displayGameOver();
            gameOver = true;
            if(!gameOverSent){
                socket.emit("send game over",{gameOver:true});
                gameOverSent = true;
            }
        }
    }
}

socket.on("receive game over", (data) => {
    if(data.gameOver && onMobile){
        displayGameOverMobile();
    }
});

socket.on("receive restart game", (data) => {
    console.log("receive restart")
    if(data.restartGame){
        restartGame();
    }
});

var gameOverSent = false;

function restartGame(){
    console.log("restating game")
    gameOver = false;
    life = 3;
    score = 0;
    lifeScore = 0;
    createdRstBtn = false;
    allBoxes = [];
    gameOverSent = false
    // var rstBtn = document.getElementById("rest")
}

function displayInfo(){
    textSize(32);
    fill(0);
    text("Score: "+ score, wid/2 - 200, -hei/2 + 30);
    text("Lives " + life, wid/2 -200, -hei/2 + 60);
    textSize(16);
    fill(40,50,200)
}


function displayGameOverMobile(){

    gameOver = true;

    background(120);
    fill(255);
    // rect(0,0, 50, -height/2);
    rotate(90);
    text("touch anywhere to restart game", 10, -height/2);
    redraw();
}

var restartGameSent = false

function touchStarted(){
    // window.alert("touch")
    if(gameOver && onMobile){
        gameOver = false;
        socket.emit("send restart game", {restartGame:true});
    }
}

function displayGameOver(){
    push()
    translate(-width/2,0);
    fill(255, 0, 0);
    textSize(54);
    text("GAME OVER", 0,0);
    textSize(32);
    fill(0);
    text("Score: "+ score, width/2 - 200, -height/2 + 30);
    text("Lives " + life, width/2 -200, -height/2 + 60);
    // text("LifeScore " + lifeScore, width/2 -200, -height/2 + 90);
    textSize(16);
    // text("try to get the balls", wid - 250, 50);
    fill(40,50,200)
    // while(true){
    // }
    pop();

    if(!createdRstBtn){
        var rstBtn = document.createElement("button");
        rstBtn.id = "restart-button";
        var mblCon = document.getElementById("mobile-container");
        mblCon.appendChild(rstBtn);
        rstBtn.addEventListener("click", restartGame);
        // window.setTimeout(5000);
        createdRstBtn = true;
        // rstBtn = None;
    }
}



function handleOrientation(event) {
  var x = event.beta;  // In degree in the range [-180,180]
  var y = event.gamma; // In degree in the range [-90,90]

  var output  = "beta : " + x + "\n";
  output += "gamma: " + y + "\n";

  console.log("putput " + output)

  // Because we don't want to have the device upside down
  // We constrain the x value to the range [-90,90]
  if (x >  90) { x =  90};
  if (x < -90) { x = -90};

  // To make computation easier we shift the range of
  // x and y to [0,180]
  x += 90;
  y += 90;
  console.log("x "+x);
  console.log("y "+ y)

  // 10 is half the size of the ball
  // It center the positioning point to the center of the ball
  console.log("send data")
  socket.emit("send data", {output:output, x:x, y:y});
}

window.addEventListener('deviceorientation', handleOrientation);

socket.on("receive data", (data) => {
    if(data.x > 93 && data.x < 105 && posX > -wid - 100){
        posX -= (data.x-93);
    } else if(data.x < 87 && data.x > 80 && posX < wid + 100){
        posX += (87 - data.x);
    } else if(data.x >= 105 && posX > -wid - 100){
        posX -= 12;
    } else if(data.x <= 80 && posX < wid + 100){
        posX += 12;
    }
});


function drawBoxes(){
    if(parseInt(millis()) % 5 === 0){
        var money = false;
        if(random(0,10) < 1){
            money = true;
        }
        var myBox = newBox(random(-wid,wid), money);
        allBoxes.push(myBox);
    }

    for(var i=0; i<allBoxes.length; i++){
        allBoxes[i].draw();
        var cposX = -posX;
        var offSet = 40
        allBoxes[i].update();
        if(allBoxes[i].z > 330){
            allBoxes.splice(i,1);
        } else if( ((allBoxes[i].x > cposX - offSet && cposX > allBoxes[i].x) || (allBoxes[i].x > cposX && allBoxes[i].x < cposX + offSet)) && allBoxes[i].z > 300){
            console.log("collision");
            if(allBoxes[i].isMoney){
                console.log("money")
                score += 1;
                lifeScore += 1;
                if(lifeScore === 3){
                    life+=1;
                    lifeScore = 0;
                }
            } else {
                life -= 1;

                if(life === 0){
                    gameOver = true;
                }
                allBoxes = [];
                break;

            }
            allBoxes.splice(i,1);
            i-=1;
        }
    }
}


function newBox(x, isMoney){
    var myBox = {
        x:x,
        z:-1500,
        // z:0,
        y:0,
        rad:50,
        depth:10,
        acc: 20,
        isMoney:isMoney,
        draw: function(){
            push();
            fill(200, 10, 10);
            if(this.isMoney){
                fill(255, 255,0);
            }
            translate(this.x, 0, this.z);
            box(50, 50, 10);
            pop();
            // console.log(this.z);
        },
        update: function(){
            this.z += this.acc;

        },
        shouldBeDeleted:function(){
            // console.log(this)
            return (this.z > 100);
        }
    }
    return myBox;
}

function drawRoad(){
    translate(-wid/2,-hei/2);
    fill(10);
    beginShape();
    vertex(0, hei);
    vertex(wid, hei);
    vertex(wid-150, 0);
    vertex(150, 0);
    endShape();
}

function drawRain(){
    fill(255)
    if(parseInt(millis()) % 18=== 0){
        var newD = newDrop(random(0,wid), 0);
        allRain.push(newD);
    }

    for(var i=0;i<allRain.length; i++){
        allRain[i].draw();
        allRain[i].update();
        console.log(allRain[i])
        if(allRain[i].y > hei +10){
            console.log("splice")
            allRain.splice(i,1);
            score -= 1;
        }
        if(posX   < allRain[i].x && posX + (rad) > allRain[i].x && allRain[i].y >= posY - (rad/2)){
            score += 1;
            allRain.splice(i, 1);
        }
    }
}

function newDrop(x, y){
    var rain = {
        x: x,
        y: y,
        draw : function(){
            ellipse(this.x,this.y, 10, 10)
        },
        update : function(){
            this.y += 3;
        }
    }
    return rain;
}
