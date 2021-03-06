/******************
** SERVER CREATION
*******************/

var roomNum = 0;
var rooms = new Array();

//Import Express module
var express = require('express');

//Import the 'path' module (packaged with Node.js)
var path = require('path');

//Create a new Express Application
var app = express();

var morgan = require('morgan');

//Create a simple Express application
    //Turn down logging activity
    morgan('combined',{
        skip: function (req, res){return res.statusCode < 400}
    });
    
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

            if(priorityRoom.numppl == 2 && priorityRoom.numplay == 0) {
                io.sockets.in(priorityRoom.room).emit('setup');
            }
            
            console.log('room: ' + priorityRoom.room);
            console.log('numppl: ' + priorityRoom.numppl);
            console.log('numready: ' + priorityRoom.numready);
            console.log('numplay: ' + priorityRoom.numplay);
            
            return;
        }    
        
        else { 
                //Initiate the creation of a new game (Room) instance if room not found
            roomNum += 1;
            var roomName = 'Room ' + roomNum;
            roomInfo = { room: roomName, numppl: 0, numready: 0, numplay: 0 };
            roomInfo.numppl += 1;
            rooms.push(roomInfo);

            console.log('room: ' + roomInfo.room);
            console.log('numppl: ' + roomInfo.numppl);
            console.log('numready: ' + roomInfo.numready);
            console.log('numplay: ' + roomInfo.numplay);
            
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
            room.numplay = 2;
            
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
            
            console.log('room: ' + room.room);
            console.log('numppl: ' + room.numppl);
            console.log('numready: ' + room.numready);
            console.log('numplay: ' + room.numplay);
        }
    });
    
    client.on('tile send', function(data) {
        client.broadcast.to(data.room).emit('tile receive', data);
    });
    
    client.on('tile receive', function(data) {
        client.broadcast.to(data.room).emit('tile send', data);
    });
    
    client.on('play again', function(data) {
        for(var i = 0; i < rooms.length; i++) {
            if(rooms[i].room == data.room) {
                   rooms[i].numppl -= 1;
                     
                if(data.readyOn) {   
                    rooms[i].numready -= 1;
                }
                
                if(data.playOn) {
                    rooms[i].numplay -= 1;    
                }
                
                console.log('room: ' + rooms[i].room);
                console.log('numppl: ' + rooms[i].numppl);
                console.log('numready: ' + rooms[i].numready);
                console.log('numplay: ' + rooms[i].numplay);
            }    
        }
        
        client.leave(data.room);
    });
    
    client.on('game over', function(data) {
        client.broadcast.to(data.room).emit('game over');    
    });
    
    client.on('sunk', function(data) {
        client.broadcast.to(data.room).emit('sunk', data); 
    });
    
    client.on('leave room', function(data) {
        for(var i = 0; i < rooms.length; i++) {
            if(rooms[i].room == data.room) {
                if(!data.disconnect) {   
                    rooms[i].numppl -= 1;
                }
                
                if(data.readyOn) {   
                    rooms[i].numready -= 1;
                }
                
                if(data.playOn) {
                    rooms[i].numplay -= 1;    
                }
                
                console.log('room: ' + rooms[i].room);
                console.log('numppl: ' + rooms[i].numppl);
                console.log('numready: ' + rooms[i].numready);
                console.log('numplay: ' + rooms[i].numplay);
        
            }
        }
        if(data.room != '') {
            client.leave(data.room);
            io.sockets.in(data.room).emit('leave room');
        }
        
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
                rooms[i].numppl = 0;
                rooms[i].numready = 0;
                rooms[i].numplay = 0;    
                
                console.log('room: ' + rooms[i].room);
                console.log('numppl: ' + rooms[i].numppl);
                console.log('numready: ' + rooms[i].numready);
                console.log('numplay: ' + rooms[i].numplay);
            }
        }
        
        if(room != '') {
            io.sockets.in(room).emit('disconnect');
        }
        
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