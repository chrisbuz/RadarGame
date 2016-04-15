OverGame.MainState = function(game) {
    
};

OverGame.MainState.prototype = {
    
    create: function() {
        this.add.sprite(0, 0, 'primarybackground');
		
		var mouse_o = new Phaser.Sound(game, 'mouse_o', .4);
		var mouse_d = new Phaser.Sound(game, 'mouse_d', .4);
	
		//Apply Events for the buttons
		var start_btn = new Phaser.Button(game, game.world.centerX, game.world.centerY-100, 'start', function(){
			game.state.start('Ready');
		}, this, 1, 0, 1);
			
		var inst_btn = new Phaser.Button(game, game.world.centerX, game.world.centerY+100, 'instruct', function(){
			game.state.start('Instructions');			
		}, this, 1, 0, 1);

		//Set button achors
		start_btn.anchor.setTo(0.5, 0.5);
		inst_btn.anchor.setTo(0.5, 0.5);
		
		//Add over and down sounds to the buttons
		start_btn.setSounds(mouse_o, '', mouse_d);
		inst_btn.setSounds(mouse_o, '', mouse_d);
		
		//Apply to game
		game.add.existing(start_btn);
		game.add.existing(inst_btn);
		
    },
	
    update: function() {
		
    }   
};