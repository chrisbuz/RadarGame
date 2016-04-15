OverGame.ReadyState = function(game) {
    
};

OverGame.ReadyState.prototype = {
    
	create: function() {
        
        this.add.sprite(0, 0, 'secondarybackground');
        
        var mouse_o = new Phaser.Sound(game, 'mouse_o', .4);
		var mouse_d = new Phaser.Sound(game, 'mouse_d', .4);
        
        var text = "Waiting for opponent...";
        var style = { font: "32px Algerian", fill: "#ffffff", align: 'center' };
        var waiting = new Phaser.Text(game, game.world.centerX, 400, text, style);
        
	    var back_btn = new Phaser.Button(game, 75, 75, 'back', this.onBack, this, 1, 0, 1);
        
        waiting.anchor.setTo(0.5, 0.5);
        back_btn.anchor.setTo(0.5, 0.5);
        
		//Add over and down sounds to the buttons
		back_btn.setSounds(mouse_o, '', mouse_d);
		
		//Apply to game
        game.add.existing(waiting);
		game.add.existing(back_btn);
        
        IO.socket.emit('setup');
	},
	
	onBack: function() {
		IO.socket.emit('leave room');
		var message = 'I have left the room';
		console.log(message);
		game.state.start('Main');
	},
	
    update: function() {
		
	}
};