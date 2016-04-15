OverGame.ReadyState = function(game) {
    
};

OverGame.ReadyState.prototype = {
    
	create: function() {
        
        this.add.sprite(0, 0, 'secondarybackground');
        
        var mouse_o = new Phaser.Sound(game, 'mouse_o', .4);
		var mouse_d = new Phaser.Sound(game, 'mouse_d', .4);
        
        var mute_btn = new Phaser.Button(game, 1100, 50, 'mute', function() {
            if(mute_btn.frame == 0) {
                mute_btn.frame = 1;
                muteframe = 1;
                game.menumusic.mute = true;
            }
            
            else {
                mute_btn.frame = 0;
                muteframe = 0;
                game.menumusic.mute = false;
            }
        }, this);
        
        mute_btn.frame = muteframe;
		
        var pause_btn = new Phaser.Button(game, 1150, 50, 'pause', function() {
            if(pause_btn.frame == 0) {
                pause_btn.frame = 1;
                pauseframe = 1;
                game.menumusic.resume();
            }
            
            else {
                pause_btn.frame = 0;
                pauseframe = 0;
                game.menumusic.pause();
            }
        }, this);
        
        pause_btn.frame = pauseframe;
        
        var text = "Waiting for opponent...";
        var style = { font: "32px Algerian", fill: "#ffffff", align: 'center' };
        var waiting = game.add.text(game.world.centerX, 400, text, style);
        
        text = "Lobby";
        style = { font: "40px Algerian", fill: "#ffffff", align: 'center' };
        var lobby = game.add.text(game.world.centerX, 100, text, style);
        
	    var back_btn = new Phaser.Button(game, 75, 75, 'back', this.onBack, this, 1, 0, 1);
        
        waiting.anchor.setTo(0.5, 0.5);
        mute_btn.anchor.setTo(0.5, 0.5);
        pause_btn.anchor.setTo(0.5, 0.5);
        lobby.anchor.setTo(0.5, 0.5);
        back_btn.anchor.setTo(0.5, 0.5);
        
		//Add over and down sounds to the buttons
		back_btn.setSounds(mouse_o, '', mouse_d);
		mute_btn.setSounds(mouse_o, '', mouse_d);
		pause_btn.setSounds(mouse_o, '', mouse_d);
		
		//Apply to game
        game.add.existing(waiting);
		game.add.existing(back_btn);
		game.add.existing(pause_btn);
		game.add.existing(mute_btn);
        
        IO.socket.emit('setup');
	},
	
	onBack: function() {
		IO.socket.emit('leave room', { room: currentRoom, disconnect: false, readyOn: readyOn, playOn: playOn } );
        readyOn = false;
        playOn = false;
		var message = 'I have left the room';
		console.log(message);
		game.state.start('Main');
	},
	
    update: function() {
		
	}
};