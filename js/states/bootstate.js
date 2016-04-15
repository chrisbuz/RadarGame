var OverGame = {};
var IO = {};
var currentRoom;
var readyOn;
var playOn;

OverGame.BootState = function(game) {
    
};

OverGame.BootState.prototype = {
  
    preload: function()
    {
		for(var i=0; i < OverGame.assets.BootState.spritesheets.length; i++)
		{
			var obj = OverGame.assets.BootState.spritesheets[i];
			game.load.spritesheet(obj.name, obj.path, obj.width, obj.height);
		}
    },
    
    create: function()
    {
		//Scale the game to fit screen before loading
		game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
		game.stage.scale.pageAlignHorizontally = true;
		game.stage.scale.minWidth = 1200;
		game.stage.scale.minHeight = 720;
		this.stage.scale.setScreenSize(true);
		
        currentRoom = '';
        readyOn = false;
        playOn = false;
        
        IO = {
            
            init: function() {
                IO.socket = io.connect();
                IO.bindEvents();
            },

            bindEvents: function() {
                //Game Binds
                IO.socket.on('welcome', IO.welcome);
                IO.socket.on('message', IO.message);
                IO.socket.on('create room', IO.createRoom);
                IO.socket.on('join room', IO.joinRoom);
                IO.socket.on('leave room', IO.leaveRoom);
                IO.socket.on('setup', IO.setup);
                IO.socket.on('play', IO.play);
                IO.socket.on('start', IO.start);
                IO.socket.on('opponent start', IO.opponentStart);
                IO.socket.on('tile send', IO.tileSend);
                IO.socket.on('tile receive', IO.tileReceive);
                IO.socket.on('game over', IO.gameOver);
                IO.socket.on('sunk', IO.sunk);
                IO.socket.on('disconnect', IO.disconnect);
            },

            /** Pre-Game Event Handlers **/

            welcome : function(data) {
                console.log(data.message);
            },

            message : function(data) {
                console.log(data.message);  
            },
            
            createRoom : function(data) {
                var message = 'I have created ' + data.room;
                currentRoom = data.room;
                console.log(message);   
            },
            
            joinRoom : function(data) {
                var message = 'I have joined ' + data.room;
                currentRoom = data.room;
                console.log(message);
            },
            
            leaveRoom : function() {
                IO.socket.emit('leave room', { room: currentRoom, disconnect: false, readyOn: readyOn, playOn: playOn } );
                readyOn = false;
                playOn = false;
                game.state.start('Ready');
                console.log('Opponent has left game...');
            },
            
            setup : function() {
                console.log('Game starting...')
                game.state.start('Setup');  
            },
            
            play : function() {
                playOn = true;
                game.state.start('Game');  
            },
            
            start : function() {
                var data = { room: currentRoom, message: 'Your turn' };
                OverGame.GameState.prototype.notification(data);
                OverGame.GameState.prototype.start();
            },
            
            opponentStart : function() {
                var data = { room: currentRoom, message: 'Opponent\'s turn' };
                OverGame.GameState.prototype.notification(data);
            },
            
            tileSend : function(data) {
                OverGame.GameState.prototype.tileSend(data);
            },
            
            tileReceive : function(data) {
                OverGame.GameState.prototype.tileReceive(data);
            },
            
            gameOver : function() {
                OverGame.GameState.prototype.won();
            },
            
            sunk : function(data) {
                OverGame.GameState.prototype.sunk(data);
            },
            
            disconnect : function() {
                readyOn = false;
                playOn = false;
                IO.socket.emit('leave room', { room: currentRoom, disconnect: true, readyOn: readyOn, playOn: playOn } );
                game.state.start('Ready');
            }
            
            
        };
            
        IO.init();
        
        game.state.start('Loader');
    }
};