var muteframe = 0;
var pauseframe = 1;

OverGame.MainState = function(game) {
    
};

OverGame.MainState.prototype = {
    
    create: function() {
        this.add.sprite(0, 0, 'primarybackground');
        
		var mouse_o = new Phaser.Sound(game, 'mouse_o', .4);
		var mouse_d = new Phaser.Sound(game, 'mouse_d', .4);
	
		//Apply Events for the buttons
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
        
        var start_btn = new Phaser.Button(game, game.world.centerX, game.world.centerY-100, 'start', function(){
			game.state.start('Ready');
		}, this, 1, 0, 1);
			
		var inst_btn = new Phaser.Button(game, game.world.centerX, game.world.centerY+100, 'instruct', function(){
			game.state.start('Instruct1');			
		}, this, 1, 0, 1);

		//Set button achors
		mute_btn.anchor.setTo(0.5, 0.5);
        pause_btn.anchor.setTo(0.5, 0.5);
        start_btn.anchor.setTo(0.5, 0.5);
		inst_btn.anchor.setTo(0.5, 0.5);
        
		
		//Add over and down sounds to the buttons
		mute_btn.setSounds(mouse_o, '', mouse_d);
		pause_btn.setSounds(mouse_o, '', mouse_d);
		start_btn.setSounds(mouse_o, '', mouse_d);
		inst_btn.setSounds(mouse_o, '', mouse_d);
		
		//Apply to game
		game.add.existing(mute_btn);
		game.add.existing(pause_btn);
		game.add.existing(start_btn);
		game.add.existing(inst_btn);
    },
	
    update: function() {
		
    }   
};