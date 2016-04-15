//buttons and text
var back_btn;
var playagain_btn;
var roomName;
var hitOrMiss;
var win;
var loss;
var notification;

//items
var nuke;
var radar;
var fiveShot;

//has the been used already?
var nukeDisabled;
var radarDisabled;
var fiveShotDisabled;

//which item is on?
var nukeOn;
var radarOn;
var fiveShotOn;

//fiveShot array
var fiveShotTiles;

//is the ship sunk?
var carrierSunk;
var battleshipSunk;
var submarineSunk;
var destroyerSunk;
var uboatSunk;

//ships
var carrier;
var battleship;
var submarine;
var destroyer;
var uboat;

//black ships
var blackcar;
var blackbattleship;
var blacksub;
var blackdestroyer;
var blackuboat;

//small ships
var smcarrier;
var smbattleship;
var smsubmarine;
var smdestroyer;
var smuboat;

//health
var carrierHealth;
var battleshipHealth;
var submarineHealth;
var destroyerHealth;
var uboatHealth;

//is the game over
var gameOver;

//In game animations
var leftSmokeAnim;
var leftHitAnim;
var leftMissAnim;
var rightSmokeAnim;
var rightHitAnim;
var rightMissAnim;

var leftTiles; //leftside
var lettersNumbers;
var rightTiles; //rightside
var lettersNumbers;

var clickedTiles; //tiles already clicked
var hitTiles; //tiles hit

var shipTiles; //tiles the ships rest on

OverGame.GameState = function(game) {
    
};

OverGame.GameState.prototype = {
    
	create: function() {
        this.add.sprite(0, 0, 'secondarybackground');
        game.hitsound = game.add.audio('bigbomb', .3, false);
        
        nukeOn = false;
        radarOn = false;
        fiveShotOn = false;
        
        nukeDisabled = false;
        radarDisabled = false;
        fiveShotDisabled = false;
        
        carrierSunk = false;
        battleshipSunk = false;
        submarineSunk = false;
        destroyerSunk = false;
        uboatSunk = false;
        
        gameOver = false;
        
        fiveShotTiles = new Array();
        
        leftSmokeAnim = new Array();
        leftHitAnim = new Array();
        leftMissAnim = new Array();
        rightSmokeAnim = new Array();
        rightHitAnim = new Array();
        rightMissAnim = new Array();
        
        leftTiles = new Array();
        lettersNumbers = new Array();
        rightTiles = new Array();
        lettersNumbers = new Array();
        
        clickedTiles = new Array();
        hitTiles = new Array();
        
        shipTiles = new Array();
        
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
        mute_btn.anchor.setTo(0.5, 0.5);
        
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
        pause_btn.anchor.setTo(0.5, 0.5);
        
	    back_btn = new Phaser.Button(game, 44, 44, 'back', this.onBack, this, 1, 0, 1);
        back_btn.anchor.setTo(0.5, 0.5);
		
        playagain_btn = new Phaser.Button(game, game.world.centerX, game.world.centerY + 100, 'playagain', this.onPlayAgain, this, 1, 0, 1);
        playagain_btn.anchor.setTo(0.5, 0.5);
        playagain_btn.visible = false;                           
        
		//Add over and down sounds to the buttons
		back_btn.setSounds(mouse_o, '', mouse_d);
        playagain_btn.setSounds(mouse_o, '', mouse_d);
        pause_btn.setSounds(mouse_o, '', mouse_d);
        mute_btn.setSounds(mouse_o, '', mouse_d);
        
        //Make tiles
        makeLeftTiles(100, 150);
        makeRightTiles(650, 150);
        
        //add 'YOUR SHIPS' and 'OPPONENT'S SHIPS'
        style = { font: '32px Algerian', fill: '#ffffff' };
        
        roomName = new Phaser.Text(game, game.world.centerX, 25, currentRoom, style);
        roomName.anchor.setTo(0.5, 0.5);
        
        style = { font: '48px Algerian', fill: '#ffffff' };
        win = new Phaser.Text(game, game.world.centerX, game.world.centerY - 100, 'You won!', style);
        win.anchor.setTo(0.5, 0.5);
        win.visible = false;
        
        loss = new Phaser.Text(game, game.world.centerX, game.world.centerY - 100, 'You lost!', style);
        loss.anchor.setTo(0.5, 0.5);
        loss.visible = false;
        
        //add items to screen
        nuke = new Phaser.Button(game, 1145, 150 + 44*2.5, 'nuke', this.onNuke, this, 1,1,1,1);
        nuke.anchor.setTo(0.5, 0.5);
        nuke.inputEnabled = false;
        
        radar = new Phaser.Button(game, 1145, 150 + 44*5, 'radar', this.onRadar, this, 1,1,1,1);
        radar.anchor.setTo(0.5, 0.5);
        radar.inputEnabled = false;
        
        fiveShot = new Phaser.Button(game, 1145, 150 + 44*7.5, 'fiveShot', this.onFiveShot, this, 0,0,0,0);
        fiveShot.anchor.setTo(0.5, 0.5);
        fiveShot.inputEnabled = false;
        
        style = { font: '24px Algerian', fill: '#ffffff', align: 'center' };
        notification = new Phaser.Text(game, 650 + 44*5, 650, '', style);
        notification.anchor.setTo(0.5, 0.5);
        notification.visible = false;
        
        //health and small ships
        smcarrier = game.add.sprite(170, 150 + 44*10 + 25, 'smcarrier');
        smcarrier.anchor.setTo(0.5, 0.5);
        carrierHealth = game.add.sprite(170, 150 + 44*10 + 40, '5health');
        carrierHealth.anchor.setTo(0.5, 0.5);
        
        smbattleship = game.add.sprite(130, 150 + 44*10 + 75, 'smbattleship');
        smbattleship.anchor.setTo(0.5, 0.5);
        battleshipHealth = game.add.sprite(130, 150 + 44*10 + 90, '4health');
        battleshipHealth.anchor.setTo(0.5, 0.5);
        
        smsubmarine = game.add.sprite(350, 150 + 44*10 + 25, 'smsubmarine');
        smsubmarine.anchor.setTo(0.5, 0.5);
        submarineHealth = game.add.sprite(350, 150 + 44*10 + 40, '3health');
        submarineHealth.anchor.setTo(0.5, 0.5);
        
        smdestroyer = game.add.sprite(272, 150 + 44*10 + 75, 'smdestroyer');
        smdestroyer.anchor.setTo(0.5, 0.5);
        destroyerHealth = game.add.sprite(272, 150 + 44*10 + 90, '3health');
        destroyerHealth.anchor.setTo(0.5, 0.5);
        
        smuboat = game.add.sprite(410, 150 + 44*10 + 75, 'smuboat');
        smuboat.anchor.setTo(0.5, 0.5);
        uboatHealth = game.add.sprite(410, 150 + 44*10 + 90, '2health');
        uboatHealth.anchor.setTo(0.5, 0.5);
        
        //black ships that appear on right
        blackcar = new Phaser.Sprite(game, 0, 0, 'blackcar', 0);
        blackcar.anchor.setTo(0.2, 0.5);
        blackcar.visible = false;
        
        blackbattleship = new Phaser.Sprite(game, 0, 0, 'blackbattleship', 0);
        blackbattleship.anchor.setTo(0.25, 0.5);
        blackbattleship.visible = false;
        
        blacksub = new Phaser.Sprite(game, 0, 0, 'blacksub', 0);
        blacksub.anchor.setTo(0.333, 0.5);
        blacksub.visible = false;

        blackdestroyer = new Phaser.Sprite(game, 0, 0, 'blackdestroyer', 0);
        blackdestroyer.anchor.setTo(0.333, 0.5);
        blackdestroyer.visible = false;

        blackuboat = new Phaser.Sprite(game, position[4].xpos-54+550, position[4].ypos+18, 'blackuboat', 0);
        blackuboat.anchor.setTo(0.5, 0.5);
        blackuboat.visible = false;
        
        //add ships from previous screen
        carrier = new Phaser.Sprite(game, position[0].xpos-54, position[0].ypos+18, 'carrier', 1);
        carrier.anchor.setTo(0.2,0.5);
        if(position[0].rotated) {
            carrier.angle = 90;   
        }
        
        battleship = new Phaser.Sprite(game, position[1].xpos-54, position[1].ypos+18, 'battleship', 1);
        battleship.anchor.setTo(0.25,0.5);
        if(position[1].rotated) {
            battleship.angle = 90;   
        }
        
        submarine = new Phaser.Sprite(game, position[2].xpos-54, position[2].ypos+18, 'submarine', 1);
        submarine.anchor.setTo(0.333,0.5);
        if(position[2].rotated) {
            submarine.angle = 90;   
        }
        
        destroyer = new Phaser.Sprite(game, position[3].xpos-54, position[3].ypos+18, 'destroyer', 1);
        destroyer.anchor.setTo(0.333,0.5);
        if(position[3].rotated) {
            destroyer.angle = 90;   
        }
        
        uboat = new Phaser.Sprite(game, position[4].xpos-54, position[4].ypos+18, 'uboat', 1);
        uboat.anchor.setTo(0.5,0.5);
        if(position[4].rotated) {
            uboat.angle = 90;   
        }
        
        
        //make arrays
        for(var i = 0; i < 5; i++) {
            shipTiles.push(new Array());
        }
        
        //populate the tiles to be hit array
        var tile;
        
        for(var i = 1; i <= 5; i++) {
            if(position[0].rotated) {
                tile = { row: ((position[0].ypos + 22)/44) - 5, column: ((position[0].xpos + 22)/44) - 4 };
                tile.row += i;   
            }
            
            else {
                tile = { row: (position[0].ypos/44) - 3, column: (position[0].xpos/44) - 5 };
                tile.column += i;
            }
            
            shipTiles[0].push(tile);
        }
        
        for(var i = 1; i <= 4; i++) {
            if(position[1].rotated) {
                tile = { row: ((position[1].ypos + 22)/44) - 5, column: ((position[1].xpos + 22)/44) - 4 };
                tile.row += i;   
            }
            
            else {
                tile = { row: (position[1].ypos/44) - 3, column: (position[1].xpos/44) - 5 };
                tile.column += i;
            }
            
            shipTiles[1].push(tile);
        }
        
        for(var i = 1; i <= 3; i++) {
            if(position[2].rotated) {
                tile = { row: ((position[2].ypos + 22)/44) - 5, column: ((position[2].xpos + 22)/44) - 4 };
                tile.row += i;   
            }
            
            else {
                tile = { row: (position[2].ypos/44) - 3, column: (position[2].xpos/44) - 5 };
                tile.column += i;
            }
            
            shipTiles[2].push(tile);
        }
        
        for(var i = 1; i <= 3; i++) {
            if(position[3].rotated) {
                tile = { row: ((position[3].ypos + 22)/44) - 5, column: ((position[3].xpos + 22)/44) - 4 };
                tile.row += i;   
            }
            
            else {
                tile = { row: (position[3].ypos/44) - 3, column: (position[3].xpos/44) - 5 };
                tile.column += i;
            }
            
            shipTiles[3].push(tile);
        }
        
        for(var i = 1; i <= 2; i++) {
            if(position[4].rotated) {
                tile = { row: ((position[4].ypos + 22)/44) - 5, column: ((position[4].xpos + 22)/44) - 4 };
                tile.row += i;   
            }
            
            else {
                tile = { row: (position[4].ypos/44) - 3, column: (position[4].xpos/44) - 5 };
                tile.column += i;
            }
            
            shipTiles[4].push(tile);
        }
        
        game.add.existing(back_btn);
        game.add.existing(playagain_btn);
        game.add.existing(pause_btn);
        game.add.existing(mute_btn);
        game.add.existing(nuke);
        game.add.existing(radar);
        game.add.existing(fiveShot);
        
        game.add.existing(roomName);
        game.add.existing(win);
        game.add.existing(loss);
        game.add.existing(notification);
        
        game.add.existing(blackcar);
        game.add.existing(blackbattleship);
        game.add.existing(blacksub);
        game.add.existing(blackdestroyer);
        game.add.existing(blackuboat);
        
        game.add.existing(carrier);
        game.add.existing(battleship);
        game.add.existing(submarine);
        game.add.existing(destroyer);
        game.add.existing(uboat);
        
        //attach letters and numbers
        for(var i = 0; i < lettersNumbers.length; i++) {
            game.add.existing(lettersNumbers[i]);   
        }
	},
	
    update: function() {
        for(var i = 0; i < shipTiles.length; i++) {
            var hits = 0;
            for(var k = 0; k < shipTiles[i].length; k++) {
                for(var m = 0; m < hitTiles.length; m++) {
                    if(shipTiles[i][k].row == hitTiles[m].row && shipTiles[i][k].column == hitTiles[m].column) {
                        hits++;
                    }
                }
            }
            
            if(i == 0 && hits == 5 && !carrierSunk) {
                carrierSunk = true;
                IO.socket.emit('sunk', { room: currentRoom, name: 'carrier', xpos: position[0].xpos-54+550, ypos: position[0].ypos+18, rotated: position[0].rotated });   
            }
            
            else if (i == 1 && hits == 4 && !battleshipSunk) {
                battleshipSunk = true;
                IO.socket.emit('sunk', { room: currentRoom, name: 'battleship', xpos: position[1].xpos-54+550, ypos: position[1].ypos+18, rotated: position[1].rotated });   
            }
            
            else if (i == 2 && hits == 3 && !submarineSunk) {
                submarineSunk = true;
                IO.socket.emit('sunk', { room: currentRoom, name: 'submarine', xpos: position[2].xpos-54+550, ypos: position[2].ypos+18, rotated: position[2].rotated });   
            }
            
            else if (i == 3 && hits == 3 && !destroyerSunk) {
                destroyerSunk = true;
                IO.socket.emit('sunk', { room: currentRoom, name: 'destroyer', xpos: position[3].xpos-54+550, ypos: position[3].ypos+18, rotated: position[3].rotated });   
            }
            
            else if (i == 4 && hits == 2 && !uboatSunk) {
                uboatSunk = true;
                IO.socket.emit('sunk', { room: currentRoom, name: 'uboat', xpos: position[4].xpos-54+550, ypos: position[4].ypos+18, rotated: position[4].rotated });   
            }
        }
        
        if(carrierSunk && battleshipSunk && submarineSunk && destroyerSunk && uboatSunk && !gameOver) {
            gameOver = true;   
            IO.socket.emit('game over', { room: currentRoom } );
            this.lost();
        }
	},
    
    onBack: function() {
        IO.socket.emit('leave room', { room: currentRoom, disconnect: false, readyOn: readyOn, playOn: playOn } );
        readyOn = false;
        playOn = false;
        var message = 'I have left the room';
        console.log(message);
        game.state.start('Main');
    },
    
    onPlayAgain: function() {
        IO.socket.emit('play again', { room: currentRoom, readyOn: readyOn, playOn: playOn } );
        var message = 'I have left the room';
        console.log(message);
        game.state.start('Ready');
    },
    
    onNuke: function() {
        if(nukeOn) {
            nukeOn = false;
            nuke.setFrames(1,1,1,1);
        }

        else {
            nukeOn = true;
            nuke.setFrames(0,0,0,0);
            radarOn = false;    
            radar.setFrames(1,1,1,1);
            fiveShotOn = false;
            fiveShot.setFrames(0,0,0,0);
            fiveShotTiles.splice(0, fiveShotTiles.length);
        }
    },
    
    onRadar: function() {
       if(radarOn) {
            radarOn = false;
            radar.setFrames(1,1,1,1);
        }

        else {
            nukeOn = false;
            nuke.setFrames(1,1,1,1);
            radarOn = true;
            radar.setFrames(0,0,0,0);
            fiveShotOn = false;
            fiveShot.setFrames(0,0,0,0);
            fiveShotTiles.splice(0, fiveShotTiles.length);
        } 
    },
    
    onFiveShot: function() {
        if(fiveShotOn) {
            fiveShotOn = false;
            fiveShot.setFrames(0,0,0,0);
            fiveShotTiles.splice(0, fiveShotTiles.length);
        }

        else {
            nukeOn = false;
            nuke.setFrames(1,1,1,1);
            radarOn = false;
            radar.setFrames(1,1,1,1);    
            fiveShotOn = true;
            fiveShot.setFrames(1,1,1,1);
        }    
    },

    tileSend: function(data) {
        for(var i = 0; i < rightTiles.length; i++) {
            if(data.location.row == rightTiles[i].name.row && data.location.column == rightTiles[i].name.column) {
                if(data.hit) {
                    rightTiles[i].setFrames(3,3,3,3);
                    
                    game.hitsound.play('', 0, 0.3, false);
                    
                    rightHitAnim[i].bringToTop();
					rightHitAnim[i].visible = true;
					rightHitAnim[i].animations.play('hitter', null, false, true);
                    rightSmokeAnim[i].bringToTop();
                    rightSmokeAnim[i].visible = true;
					rightSmokeAnim[i].animations.play('smoker');
                    
                }
                
                else {
                    rightTiles[i].setFrames(2,2,2,2);
					rightMissAnim[i].visible = true;
					rightMissAnim[i].animations.play('misser', null, false, true);
                }
                
                break;
            }
        }
        
        if(data.hit) {
            if(data.index == 0) {
                carrierHealth.frame += 1;
            }

            else if(data.index == 1) {
                battleshipHealth.frame += 1;
            }

            else if(data.index == 2) {
                submarineHealth.frame += 1;
            }

            else if(data.index == 3) {
                destroyerHealth.frame += 1;
            }

            else if(data.index == 4) {
                uboatHealth.frame += 1;    
            }
        }
        
        var data = { room: currentRoom, message: 'Opponent\s turn' };
        OverGame.GameState.prototype.notification(data);
        
    },
    
    tileReceive: function(data) {
        var found = false;
        for(var i = 0; i < shipTiles.length; i++) {
            for(var k = 0; k < shipTiles[i].length; k++) {
                if(data.location.row == shipTiles[i][k].row && data.location.column == shipTiles[i][k].column)
                {
                    IO.socket.emit('tile receive', { room: data.room, location: data.location, hit: true, index: i });
                    found = true;
                    for(var i = 0; i < leftTiles.length; i++) {
                        if(data.location.row == leftTiles[i].name.row && data.location.column == leftTiles[i].name.column) {
                            hitTiles.push(leftTiles[i].name);
                            game.hitsound.play('', 0, 0.3, false);
                            leftTiles[i].frame = 3;
                        	leftHitAnim[i].visible = true;
                            leftHitAnim[i].animations.play('hitter', null, false, true);
                            leftSmokeAnim[i].bringToTop();
                            leftSmokeAnim[i].visible = true;
                        	leftSmokeAnim[i].animations.play('smoker');
                        }
                    }
                    
                break;        
                }
            }
        }
        
        if(!found) {
            IO.socket.emit('tile receive', { room: data.room, location: data.location, hit: false, index: 0 });
            for(var i = 0; i < leftTiles.length; i++) {
                if(data.location.row == leftTiles[i].name.row && data.location.column == leftTiles[i].name.column) {
                    leftTiles[i].frame = 2;
					leftMissAnim[i].visible = true;
					leftMissAnim[i].animations.play('misser', null, false, true);
                }
            }
        }    
        
        //give input back to right tiles
        for(var i = 0; i < rightTiles.length; i++) {
            rightTiles[i].inputEnabled = true; 
        }
        
        //give input to items
        if(!nukeDisabled) {
            nuke.inputEnabled = true;
        }
        
        if(!radarDisabled) {
            radar.inputEnabled = true;
        }
        
        if(!fiveShotDisabled) {
            fiveShot.inputEnabled = true;
        }
        
        var data = { room: currentRoom, message: 'Your turn' };
        OverGame.GameState.prototype.notification(data);
                
    },
    
    start: function() {
        for(var i = 0; i < rightTiles.length; i++) {
            rightTiles[i].inputEnabled = true;
        }
        
        nuke.inputEnabled = true;
        radar.inputEnabled = true;
        fiveShot.inputEnabled = true;
    },
    
    won: function() {
        for(var i = 0; i < rightTiles.length; i++) {
            rightTiles[i].inputEnabled = false;
            rightTiles[i].visible = false;
        } 
        
        for(var i = 0; i < leftTiles.length; i++) {
            leftTiles[i].visible = false;
        }
        
        for(var i = 0; i < lettersNumbers.length; i++) {
            lettersNumbers[i].visible = false;
        }
        
        for(var i = 0; i < leftSmokeAnim.length; i++) {
            leftSmokeAnim[i].visible = false;    
        }
        
        for(var i = 0; i < rightSmokeAnim.length; i++) {
            rightSmokeAnim[i].visible = false;    
        }
        
        carrier.visible = false;
        battleship.visible = false;
        submarine.visible = false;
        destroyer.visible = false;
        uboat.visible = false;
        
        back_btn.visible = false;
        nuke.visible = false;
        radar.visible = false;
        fiveShot.visible = false;
        
        blackcar.visible = false;
        blackbattleship.visible = false;
        blacksub.visible = false;
        blackdestroyer.visible = false;
        blackuboat.visible = false;
        
        smcarrier.visible = false;
        smbattleship.visible = false;
        smsubmarine.visible = false;
        smdestroyer.visible = false;
        smuboat.visible = false;
        
        carrierHealth.visible = false;
        battleshipHealth.visible = false;
        submarineHealth.visible = false;
        destroyerHealth.visible = false;
        uboatHealth.visible = false;
        
        notification.visible = false;
        
        win.visible = true;
        playagain_btn.visible = true;
    },

    lost: function() {
        for(var i = 0; i < rightTiles.length; i++) {
            rightTiles[i].inputEnabled = false;
            rightTiles[i].visible = false;
        } 
        
        for(var i = 0; i < leftTiles.length; i++) {
            leftTiles[i].visible = false;
        }
        
        for(var i = 0; i < lettersNumbers.length; i++) {
            lettersNumbers[i].visible = false;
        }
        
        for(var i = 0; i < leftSmokeAnim.length; i++) {
            leftSmokeAnim[i].visible = false;    
        }
        
        for(var i = 0; i < rightSmokeAnim.length; i++) {
            rightSmokeAnim[i].visible = false;    
        }
        
        carrier.visible = false;
        battleship.visible = false;
        submarine.visible = false;
        destroyer.visible = false;
        uboat.visible = false;
        
        back_btn.visible = false;
        nuke.visible = false;
        radar.visible = false;
        fiveShot.visible = false;
        
        blackcar.visible = false;
        blackbattleship.visible = false;
        blacksub.visible = false;
        blackdestroyer.visible = false;
        blackuboat.visible = false;
        
        smcarrier.visible = false;
        smbattleship.visible = false;
        smsubmarine.visible = false;
        smdestroyer.visible = false;
        smuboat.visible = false;
        
        carrierHealth.visible = false;
        battleshipHealth.visible = false;
        submarineHealth.visible = false;
        destroyerHealth.visible = false;
        uboatHealth.visible = false;
        
        notification.visible = false;
        
        loss.visible = true;
        playagain_btn.visible = true;
    },
    
    notification: function(data) {
        notification.setText(data.message);
        notification.visible = true;
    },
    
    sunk: function(data) {
        if(data.name == 'carrier') {
            blackcar.x = data.xpos;
            blackcar.y = data.ypos;
            blackcar.visible = true;
            if(data.rotated) {
                blackcar.angle = 90;    
            }
        }
        
        else if(data.name == 'battleship') {
            blackbattleship.x = data.xpos;
            blackbattleship.y = data.ypos;
            blackbattleship.visible = true;
            if(data.rotated) {
                blackbattleship.angle = 90;    
            }
        }
        
        else if(data.name == 'submarine') {
            blacksub.x = data.xpos;
            blacksub.y = data.ypos;
            blacksub.visible = true;
            if(data.rotated) {
                blacksub.angle = 90;    
            }
        }

        else if(data.name == 'destroyer') {
            blackdestroyer.x = data.xpos;
            blackdestroyer.y = data.ypos;
            blackdestroyer.visible = true;
            if(data.rotated) {
                blackdestroyer.angle = 90;    
            }
        }
        
        else if(data.name == 'uboat') {
            blackuboat.x = data.xpos;
            blackuboat.y = data.ypos;
            blackuboat.visible = true;
            if(data.rotated) {
                blackuboat.angle = 90;    
            }
        }
    }
};

function makeLeftTiles(x, y) {
    var style = { font: '24px Algerian', fill: '#ffffff' };
    
    var letter;
    //add A - J
    letter = new Phaser.Text(game, 44*0+x, 49+y-100, 'A', style);
    letter.anchor.setTo(0.5, 0.5);
    lettersNumbers.push(letter);
    letter = new Phaser.Text(game, 44*1+x, 49+y-100, 'B', style);
    letter.anchor.setTo(0.5, 0.5);
    lettersNumbers.push(letter);
    letter = new Phaser.Text(game, 44*2+x, 49+y-100, 'C', style);
    letter.anchor.setTo(0.5, 0.5);
    lettersNumbers.push(letter);
    letter = new Phaser.Text(game, 44*3+x, 49+y-100, 'D', style);
    letter.anchor.setTo(0.5, 0.5);
    lettersNumbers.push(letter);
    letter = new Phaser.Text(game, 44*4+x, 49+y-100, 'E', style);
    letter.anchor.setTo(0.5, 0.5);
    lettersNumbers.push(letter);
    letter = new Phaser.Text(game, 44*5+x, 49+y-100, 'F', style);
    letter.anchor.setTo(0.5, 0.5);
    lettersNumbers.push(letter);
    letter = new Phaser.Text(game, 44*6+x, 49+y-100, 'G', style);
    letter.anchor.setTo(0.5, 0.5);
    lettersNumbers.push(letter);
    letter = new Phaser.Text(game, 44*7+x, 49+y-100, 'H', style);
    letter.anchor.setTo(0.5, 0.5);
    lettersNumbers.push(letter);
    letter = new Phaser.Text(game, 44*8+x, 49+y-100, 'I', style);
    letter.anchor.setTo(0.5, 0.5);
    lettersNumbers.push(letter);
    letter = new Phaser.Text(game, 44*9+x, 49+y-100, 'J', style);
    letter.anchor.setTo(0.5, 0.5);
    lettersNumbers.push(letter);

    //add 1 - 10
    for(var i = 1; i <= 10; i++) {
        var number;
        number = new Phaser.Text(game, 49+x-100, 44*(i-1)+y, i, style);
        number.anchor.setTo(0.5, 0.5);
        lettersNumbers.push(number);
    }
    
    //add set up tiles
    for(var i = 0; i < 10; i++) {
        for(var k = 0; k < 10; k++) {
            var tile = new Phaser.Sprite(game, 44*k + x, 44*i + y, 'tile');
            tile.anchor.setTo(0.5, 0.5);
            tile.name = { row: i, column: k };
            game.add.existing(tile);
            leftTiles.push(tile);
        }
    }
    
    //Add smoke animation
	for(var i = 0; i < 10; i++) {
        for(var k = 0; k < 10; k++) {
            var tile = new Phaser.Sprite(game, 44*k + x, 44*i + y, 'smoke');
            tile.anchor.setTo(0.5, 0.5);
            tile.name = { row: i, column: k};
			tile.animations.add('smoker', [0, 1, 2, 3, 4, 5, 6,7,8,9,
										   10,11,12,13,14,15,16,17,18,19,
										   20,21,22,23,24,25,26,27,28,29,
										   30,31,32,33,34,35,36,37,38,39], 30, true);
			tile.visible = false;
			game.add.existing(tile);
			leftSmokeAnim.push(tile);
        }
    }
    
    //Add hit animation
	for(var i = 0; i < 10; i++) {
        for(var k = 0; k < 10; k++) {
            var tile = new Phaser.Sprite(game, 44*k + x, 44*i + y, 'hit');
            tile.anchor.setTo(0.5, 0.5);
            tile.name = { row: i, column: k, used: 'n'};			
			tile.animations.add('hitter', [0, 1, 2, 3, 4, 5, 6, 7,8,9,10, 
											  11, 12, 13, 14, 15], 8, false);
			tile.visible = false;
			game.add.existing(tile);
			leftHitAnim.push(tile);
        }
    }
	
	//Add miss animation
	for(var i = 0; i < 10; i++) {
        for(var k = 0; k < 10; k++) {
            var tile = new Phaser.Sprite(game, 44*k + x, 44*i + y, 'miss');
            tile.anchor.setTo(0.5, 0.5);
            tile.name = { row: i, column: k, used: 'n'};
			tile.animations.add('misser', [0, 1, 2, 3], 4, false);
			tile.visible = false;
			game.add.existing(tile);
			leftMissAnim.push(tile);
        }
    }
}

function makeRightTiles(x, y) {
    var style = { font: '24px Algerian', fill: '#ffffff' };
        
    var letter;
    //add A - J
    letter = new Phaser.Text(game, 44*0+x, 49+y-100, 'A', style);
    letter.anchor.setTo(0.5, 0.5);
    lettersNumbers.push(letter);
    letter = new Phaser.Text(game, 44*1+x, 49+y-100, 'B', style);
    letter.anchor.setTo(0.5, 0.5);
    lettersNumbers.push(letter);
    letter = new Phaser.Text(game, 44*2+x, 49+y-100, 'C', style);
    letter.anchor.setTo(0.5, 0.5);
    lettersNumbers.push(letter);
    letter = new Phaser.Text(game, 44*3+x, 49+y-100, 'D', style);
    letter.anchor.setTo(0.5, 0.5);
    lettersNumbers.push(letter);
    letter = new Phaser.Text(game, 44*4+x, 49+y-100, 'E', style);
    letter.anchor.setTo(0.5, 0.5);
    lettersNumbers.push(letter);
    letter = new Phaser.Text(game, 44*5+x, 49+y-100, 'F', style);
    letter.anchor.setTo(0.5, 0.5);
    lettersNumbers.push(letter);
    letter = new Phaser.Text(game, 44*6+x, 49+y-100, 'G', style);
    letter.anchor.setTo(0.5, 0.5);
    lettersNumbers.push(letter);
    letter = new Phaser.Text(game, 44*7+x, 49+y-100, 'H', style);
    letter.anchor.setTo(0.5, 0.5);
    lettersNumbers.push(letter);
    letter = new Phaser.Text(game, 44*8+x, 49+y-100, 'I', style);
    letter.anchor.setTo(0.5, 0.5);
    lettersNumbers.push(letter);
    letter = new Phaser.Text(game, 44*9+x, 49+y-100, 'J', style);
    letter.anchor.setTo(0.5, 0.5);
    lettersNumbers.push(letter);

    //add 1 - 10
    for(var i = 1; i <= 10; i++) {
        var number;
        number = new Phaser.Text(game, 49+x-100, 44*(i-1)+y, i, style);
        number.anchor.setTo(0.5, 0.5);
        lettersNumbers.push(number);
    }
    
    //add set up tiles
    for(var i = 0; i < 10; i++) {
        for(var k = 0; k < 10; k++) {
            var tile = new Phaser.Button(game, 44*k + x, 44*i + y, 'tile', onClick, this, 1, 0);
            tile.anchor.setTo(0.5, 0.5);
            tile.name = { row: i, column: k };
            tile.events.onInputOver.add(onOver);
            tile.inputEnabled = false;
            game.add.existing(tile);
            rightTiles.push(tile);
        }
    }
    
    //Add smoke animation
	for(var i = 0; i < 10; i++) {
        for(var k = 0; k < 10; k++) {
            var tile = new Phaser.Sprite(game, 44*k + x, 44*i + y, 'smoke');
            tile.anchor.setTo(0.5, 0.5);
            tile.name = { row: i, column: k};
			tile.animations.add('smoker', [0, 1, 2, 3, 4, 5, 6,7,8,9,
										   10,11,12,13,14,15,16,17,18,19,
										   20,21,22,23,24,25,26,27,28,29,
										   30,31,32,33,34,35,36,37,38,39], 30, true);
			tile.visible = false;
			game.add.existing(tile);
			rightSmokeAnim.push(tile);
        }
    }
    
    //Add hit animation
	for(var i = 0; i < 10; i++) {
        for(var k = 0; k < 10; k++) {
            var tile = new Phaser.Sprite(game, 44*k + x, 44*i + y, 'hit');
            tile.anchor.setTo(0.5, 0.5);
            tile.name = { row: i, column: k, used: 'n'};			
			tile.animations.add('hitter', [0, 1, 2, 3, 4, 5, 6, 7,8,9,10, 
											  11, 12, 13, 14, 15], 8, false);
			tile.visible = false;
			game.add.existing(tile);
			rightHitAnim.push(tile);
        }
    }
	
	//Add miss animation
	for(var i = 0; i < 10; i++) {
        for(var k = 0; k < 10; k++) {
            var tile = new Phaser.Sprite(game, 44*k + x, 44*i + y, 'miss');
            tile.anchor.setTo(0.5, 0.5);
            tile.name = { row: i, column: k, used: 'n'};
			tile.animations.add('misser', [0, 1, 2, 3], 4, false);
			tile.visible = false;
			game.add.existing(tile);
			rightMissAnim.push(tile);
        }
    }
}

function onClick(item) {
    if(nukeOn) {
        for(var i = 0; i < rightTiles.length; i++) {
            if((rightTiles[i].name.row == item.name.row || rightTiles[i].name.column == item.name.column) && !isClicked(rightTiles[i])) {
                IO.socket.emit('tile send', { location: rightTiles[i].name, room: currentRoom } );
                clickedTiles.push(rightTiles[i].name);
            }
        }
    
        nukeDisabled = true;
    }
    
    else if(radarOn) {
        for(var i = 0; i < rightTiles.length; i++) {
            var loc = rightTiles[i].name; //location of right tile
            if((loc.row == item.name.row - 1 || loc.row == item.name.row || loc.row == item.name.row + 1) && 
               (loc.column == item.name.column - 1 || loc.column == item.name.column || loc.column == item.name.column + 1) && !isClicked(rightTiles[i])) {
                
                IO.socket.emit('tile send', { location: rightTiles[i].name, room: currentRoom } );
                clickedTiles.push(rightTiles[i].name);
            }
        }
        
        radarDisabled = true;
    }
    
    else if(fiveShotOn) {        
        for(var i = 0; i < clickedTiles.length; i++) {
            if(item.name.row == clickedTiles[i].row && item.name.column == clickedTiles[i].column) {
                return;
            }
        }
        
        for(var i = 0; i < fiveShotTiles.length; i++) {
            if(item.name.row == fiveShotTiles[i].row && item.name.column == fiveShotTiles[i].column) {
                item.setFrames(1, 0);
                fiveShotTiles.splice(i,1);
                return;
            }
        }
        
        fiveShotTiles.push(item.name);
        
        if(fiveShotTiles.length == 5) {
            for(var i = 0; i < fiveShotTiles.length; i++) {
                IO.socket.emit('tile send', { location: fiveShotTiles[i], room: currentRoom } );
                clickedTiles.push(fiveShotTiles[i]);
            }
            fiveShotTiles.splice(0, fiveShotTiles.length);
        }
        
        else {
            item.setFrames(1, 1);
            return;
        }
        
        fiveShotDisabled = true;
    }
    
    else {
        for(var i = 0; i < clickedTiles.length; i++) {
            if(item.name.row == clickedTiles[i].row && item.name.column == clickedTiles[i].column) {
                return;
            }
        }
        
        IO.socket.emit('tile send', { location: item.name, room: currentRoom } );
        clickedTiles.push(item.name);
    }
    
    for(var i = 0; i < leftTiles.length; i++) {
         rightTiles[i].inputEnabled = false;
    }
    
    //take away input from items
    nuke.inputEnabled = false;
    nuke.setFrames(1,1,1,1);
    nukeOn = false;

    radar.inputEnabled = false;
    radar.setFrames(1,1,1,1);
    radarOn = false;

    fiveShot.inputEnabled = false;
    fiveShot.setFrames(0,0,0,0);
    fiveShotOn = false;
}

function isClicked(item) {
    for(var i = 0; i < clickedTiles.length; i++) {
        if(item.name.row == clickedTiles[i].row && item.name.column == clickedTiles[i].column) {
            return true;    
        }
    }
    
    return false;
}

function onOver(item) {
    if(nukeOn) {
        for(var i = 0; i < rightTiles.length; i++) {
            if((rightTiles[i].name.row == item.name.row || rightTiles[i].name.column == item.name.column) && !isClicked(rightTiles[i])) {
                rightTiles[i].setFrames(1, 1);
            }
            else if(!isClicked(rightTiles[i])) {
                rightTiles[i].setFrames(1, 0);    
            }
        }
    }
    
    else if(radarOn) {
        for(var i = 0; i < rightTiles.length; i++) {
            var loc = rightTiles[i].name; //location of right tile
            if((loc.row == item.name.row - 1 || loc.row == item.name.row || loc.row == item.name.row + 1) && 
               (loc.column == item.name.column - 1 || loc.column == item.name.column || loc.column == item.name.column + 1) && !isClicked(rightTiles[i])) {
                rightTiles[i].setFrames(1, 1);
            }
            else if(!isClicked(rightTiles[i])) {
                rightTiles[i].setFrames(1, 0);
            }
        }
    }
    
    else if(fiveShotOn) {
        if(fiveShotTiles.length == 0) {
            for(var i = 0; i < rightTiles.length; i++) {
                if(rightTiles[i].name.row != item.name.row && rightTiles[i].name.column != item.name.row && !isClicked(rightTiles[i])) {
                    rightTiles[i].setFrames(1, 0);
                }
            }        
        }
        
        return;    
    }
    
    else {
        for(var i = 0; i < rightTiles.length; i++) {
            if(rightTiles[i].name.row != item.name.row && rightTiles[i].name.column != item.name.row && !isClicked(rightTiles[i])) {
                rightTiles[i].setFrames(1, 0);
            }
        }    
    }
}