OverGame.Instruction1State = function(game) {
    
};


OverGame.Instruction1State.prototype = {
       
	create: function() {
		
		this.add.sprite(0, 0, 'instruction1');
		
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
        
		var mouse_o = new Phaser.Sound(game, 'mouse_o', .4);
		var mouse_d = new Phaser.Sound(game, 'mouse_d', .4);
		
		var back_btn = new Phaser.Button(game, 75, 75, 'back', function(){
			game.state.start('Main');
		}, this, 1, 0, 1);
        
        var forward_btn = new Phaser.Button(game, 1145, 650, 'forward', function(){
			game.state.start('Instruct2');
        }, this, 1, 0, 1);
        
		back_btn.anchor.setTo(0.5, 0.5);
		forward_btn.anchor.setTo(0.5, 0.5);
		pause_btn.anchor.setTo(0.5, 0.5);
		mute_btn.anchor.setTo(0.5, 0.5);
        
		back_btn.setSounds(mouse_o, '', mouse_d);
		forward_btn.setSounds(mouse_o, '', mouse_d);
		pause_btn.setSounds(mouse_o, '', mouse_d);
		mute_btn.setSounds(mouse_o, '', mouse_d);
		
        game.add.existing(back_btn);
        game.add.existing(forward_btn);
        game.add.existing(pause_btn);
        game.add.existing(mute_btn);
		
	},
	
	update: function() {
		
	}
};

