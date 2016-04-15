/******************
** SERVER CREATION
*******************/

var roomNum = 0;
var rooms = new Array();

//Import Logger
var morgan = require("morgan")

//Import Express module
var express = require('express');

//Import the 'path' module (packaged with Node.js)
var path = require('path');

//Create a new Express Application
var app = express();

//Create a simple Express application
    //Turn down logging activity
    //app.use(morgan('combined', {stream: accessLogStream}));
    
    //Serve static html, js, css, and image files from the Phaser root dir
    app.use(express.static(path.join(__dirname)));

//Create an http server with Node's HTTP module
//Pass it the Express application, and listen on port 8051
var server = require('http').createServer(app).listen(8051);

//Instantiate Socket.IO and have it listen on the Express/HTTP server
var io = require('socket.io').listen(server);

// Reduce the Logging output of Socket.IO
io.set('log level', 1);

//Listen for the Socket.IO Connections. Once connected, start the game Logic.

io.sockets.on('connection', function(client) {
    client.emit('welcome', { message: "Welcome, You are Connected" });
    
	//Pre game Events binds
	client.on('setup', function() {
    
        var priorityRoom = null;
        // Prioritize over rooms with person waiting
        for(var i = 0; i < rooms.length; i++) {
            if(rooms[i].numppl == 0) {
                priorityRoom = rooms[i];
                continue;
            }
            
            else if(rooms[i].numppl == 1) {
                priorityRoom = rooms[i];
                break;
            }
        }    
        
        if(priorityRoom != null) {
        
            //Increment number of players in the room
            priorityRoom.numppl += 1;

            //Join room
            client.join(priorityRoom.room);
            client.emit('join room', { room: priorityRoom.room } );
            var message =  client.id + ' has joined ' + priorityRoom.room;
            client.broadcast.to(priorityRoom.room).emit('message', { message: message } );

            if(priorityRoom.numppl == 2) {
                io.sockets.in(priorityRoom.room).emit('setup');
            }
            
            return;
        }    
        
        else { 
                //Initiate the creation of a new game (Room) instance if room not found
            roomNum += 1;
            var roomName = 'Room ' + roomNum;
            roomInfo = { room: roomName, numppl: 1, numready: 0};
            rooms.push(roomInfo);

            //Notify Client browser of new game instance
            client.emit('create room', { room: roomName } );

            //Join the room you created
            client.join(roomName);
        }
    });
    
    client.on('play', function(data) {
        var room;
        
        for(var i = 0; i < rooms.length; i++) {
            if(rooms[i].room == data.room) {
                room = rooms[i];  
            }
        }
        
        if(++room.numready == 2)
        {
            io.sockets.in(room.room).emit('play');
            
            sleep(500);
            
            var rand = Math.floor(Math.random()*2);
            
            if(rand == 0) {
                //this client starts
                client.emit('start');
                client.broadcast.to(room.room).emit('opponent start'); 
            }
            
            else {
                //opponent starts
                client.broadcast.to(room.room).emit('start');
                client.emit('opponent start');   
            }
        }
    });
    
    client.on('tile send', function(data) {
        client.broadcast.to(data.room).emit('tile receive', data);        
    });
    
    client.on('tile receive', function(data) {
        client.broadcast.to(data.room).emit('tile send', data);   
    });
    
    client.on('game over', function(data) {
        client.broadcast.to(data.room).emit('game over');    
    });
    
    client.on('leave room', function() {
        var soc_rooms = io.sockets.manager.roomClients[this.id];
    
        var arr = [ ];
        for(var key in soc_rooms) {
            if(soc_rooms.hasOwnProperty(key)) {
                arr.push(key);   
            }
        }
        
        var room = arr[arr.length-1];
        room = room.substring(1,room.length);
        
        for(var i = 0; i < rooms.length; i++) {
            if(rooms[i].room == room) {
                if(rooms[i].numppl > 0)
                   rooms[i].numppl -= 1;
                    
                if(rooms[i].numready > 0)   
                    rooms[i].numready -= 1;
            }
        }
        
        client.leave(room);
        
        var message = client.id + ' has left ' + room;
        io.sockets.in(room).emit('leave room');
        
    });
    
    client.on('disconnect', function() {
        var soc_rooms = io.sockets.manager.roomClients[this.id];
    
        var arr = [ ];
        for(var key in soc_rooms) {
            if(soc_rooms.hasOwnProperty(key)) {
                arr.push(key);   
            }
        }
        
        var room = arr[arr.length-1];
        room = room.substring(1,room.length);
        
        for(var i = 0; i < rooms.length; i++) {
            if(rooms[i].room == room) {
                if(rooms[i].numppl > 0)
                   rooms[i].numppl -= 1;
                    
                if(rooms[i].numready > 0)   
                    rooms[i].numready -= 1;
            }
        }

        var message = client.id + ' has left ' + room;
        io.sockets.in(room).emit('leave room');

        console.log(client.id + ' disconnected');       
    });
});

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
