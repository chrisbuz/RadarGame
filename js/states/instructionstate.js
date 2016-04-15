OverGame.InstructionState = function(game) {
    
};


OverGame.InstructionState.prototype = {
       
	create: function() {
		
		this.add.sprite(0, 0, 'instructionbackground');
		
		var mouse_o = new Phaser.Sound(game, 'mouse_o', .4);
		var mouse_d = new Phaser.Sound(game, 'mouse_d', .4);
		
		var back_btn = new Phaser.Button(game, 75, 75, 'back', function(){
			this.game.state.start('Main');
		}, this, 1, 0, 1);
		
		back_btn.anchor.setTo(0.5, 0.5);
		back_btn.setSounds(mouse_o, '', mouse_d);
		this.game.add.existing(back_btn);
		
	},
	
	update: function() {
		
	}
};

