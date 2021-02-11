

// or with import syntax

// console.log("yo");
var socket = io();


socket.on('updaterooms', (current_room) => {

})



// var input2 = document.getElementById("text2");

// input2.addEventListener("input", () => {
//     var msg = input2.value;
//     console.log(msg);
//     socket.emit('chat msg', msg);
//
//     return false;
// });

// var messages = document.getElementById("messages");
// socket.on('chat msg', (msg) => {
//     console.log(msg)
//     messages.innerHTML = msg;
// });


function sendRoomNum(e){
    var roomNum = document.getElementById("room-num");
    var newRoom = roomNum.value;
    var currRoom = document.getElementById('curr-room-num');
    console.log(currRoom)
    currRoom.innerHTML = "Current Room is " + newRoom + ", please connect to this room on your other device.";
    socket.emit('switchRoom', newRoom);

}

socket.on('updatedRoom', (data) => {
    console.log(data);
    if(data.ready){
        beginGame();
    }
});

// window.setTimeout(beginGame, 3000);
// beginGame()

function beginGame(){
    console.log("game beginning");
    var connInfo = document.getElementById("connection-info");
    connInfo.style.display = "none";
    var gameContainer = document.getElementById("game-container");
    gameContainer.style.visibility = "visible";
    // var gameScript = document.createElement("script");
    // gameScript.src = "/client/sketch.js";
    // gameContainer.appendChild(gameScript);
    // connInfo.appendChild(gameScript);
    startTheGame();
}
