var OverGame = {};
var IO = {};
var currentRoom = '';

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
                IO.socket.emit('leave room');
                game.state.start('Ready');
                console.log('Opponent has left game...');
            },
            
            setup : function() {
                console.log('Game starting...')
                game.state.start('Setup');  
            },
            
            play : function() {
                game.state.start('Game');  
            },
            
            start : function() {
                console.log('You will start the game');
                OverGame.GameState.prototype.start();
            },
            
            opponentStart : function() {
                console.log('Opponent will start the game');
            },
            
            tileSend : function(data) {
                OverGame.GameState.prototype.tileSend(data);
            },
            
            tileReceive : function(data) {
                OverGame.GameState.prototype.tileReceive(data);
            },
            
            gameOver : function(data) {
                OverGame.GameState.prototype.won();    
            },
            
            disconnect : function(data) {
                IO.socket.emit('leave room');
                game.state.start('Ready');
                console.log('Opponent has left game...');
            }
        };
            
        IO.init();
        
        game.state.start('Loader');
    }
};