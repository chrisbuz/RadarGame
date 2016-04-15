//buttons and text
var back_btn;
var roomName;
var yours;
var theirs;

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

var gameOver;

//In game animations
var hitAnim   = new Array();
var missAnim  = new Array();
var smokeAnim  =  new Array();

var leftTiles = new Array(); //leftside
var rightTiles = new Array(); //rightside

var clickedTiles = new Array(); //tiles already clicked
var hitTiles = new Array(); //tiles hit

var shipTiles = new Array(); //tiles the ships rest on

OverGame.GameState = function(game) {
    
};

OverGame.GameState.prototype = {
    
	create: function() {
        this.add.sprite(0, 0, 'secondarybackground');
        
        carrierSunk = false;
        battleshipSunk = false;
        submarineSunk = false;
        destroyerSunk = false;
        uboatSunk = false;
        
        gameOver = false;
        
        
		var mouse_o = new Phaser.Sound(game, 'mouse_o', .4);
		var mouse_d = new Phaser.Sound(game, 'mouse_d', .4);
        
	    back_btn = new Phaser.Button(game, 44, 44, 'back', this.onBack, this, 1, 0, 1);
        back_btn.anchor.setTo(0.5, 0.5);
		
        text = currentRoom;
        style = { font: "32px Algerian", fill: "#ffffff", align: 'center' };
        roomName = new Phaser.Text(game, game.world.centerX, 25, text, style);
        roomName.anchor.setTo(0.5, 0.5);
        
		//Add over and down sounds to the buttons
		back_btn.setSounds(mouse_o, '', mouse_d);
        
        //Apply to game
		game.add.existing(back_btn);
        
        //Make tiles
        makeLeftTiles(100, 200);
        makeRightTiles(700, 200);
        
        //add 'YOUR SHIPS' and 'OPPONENT'S SHIPS'
        style = { font: '32px Algerian', fill: '#ffffff' };
    
        yours = game.add.text(42*5+100, 80, 'Your Ships', style);
        yours.anchor.setTo(0.5, 0.5);
        
        theirs = game.add.text(42*5+700, 80, 'Opponent\'s Ships', style);
        theirs.anchor.setTo(0.5, 0.5);
        
        roomName = game.add.text(game.world.centerX, 25, currentRoom, style);
        roomName.anchor.setTo(0.5, 0.5);
        
        //add ships from previous screen
        carrier = game.add.sprite(position[0].xpos-54, position[0].ypos+68, 'carrier', 1);
        carrier.anchor.setTo(0.2,0.5);
        if(position[0].rotated) {
            carrier.angle = 90;   
        }
        
        battleship = game.add.sprite(position[1].xpos-54, position[1].ypos+68, 'battleship', 1);
        battleship.anchor.setTo(0.25,0.5);
        if(position[1].rotated) {
            battleship.angle = 90;   
        }
        
        submarine = game.add.sprite(position[2].xpos-54, position[2].ypos+68, 'submarine', 1);
        submarine.anchor.setTo(0.333,0.5);
        if(position[2].rotated) {
            submarine.angle = 90;   
        }
        
        destroyer = game.add.sprite(position[3].xpos-54, position[3].ypos+68, 'destroyer', 1);
        destroyer.anchor.setTo(0.333,0.5);
        if(position[3].rotated) {
            destroyer.angle = 90;   
        }
        
        uboat = game.add.sprite(position[4].xpos-54, position[4].ypos+68, 'uboat', 1);
        uboat.anchor.setTo(0.5,0.5);
        if(position[4].rotated) {
            uboat .angle = 90;   
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
        
        for(var i = 0; i < shipTiles.length; i++) {
            console.log(shipTiles[i]);
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
                console.log('carrier sunk');   
            }
            
            else if (i == 1 && hits == 4 && !battleshipSunk) {
                battleshipSunk = true;
                console.log('battleship sunk');
            }
            
            else if (i == 2 && hits == 3 && !submarineSunk) {
                submarineSunk = true;
                console.log('submarine sunk');
            }
            
            else if (i == 3 && hits == 3 && !destroyerSunk) {
                destroyerSunk = true;
                console.log('destroyer sunk');
            }
            
            else if (i == 4 && hits == 2 && !uboatSunk) {
                uboatSunk = true;
                console.log('uboat sunk');
            }
        }
        
        if(carrierSunk && battleshipSunk && submarineSunk && destroyerSunk && uboatSunk && !gameOver) {
            gameOver = true;   
            IO.socket.emit('game over', { room: currentRoom } );
            this.lost();
        }
	},
    
    onBack: function(){
        IO.socket.emit('leave room');
        var message = 'I have left the room';
        console.log(message);
        game.state.start('Main');
    },

    tileSend: function(data) {
        for(var i = 0; i < rightTiles.length; i++) {
            if(data.location.row == rightTiles[i].name.row && data.location.column == rightTiles[i].name.column) {
                if(data.hit) {
                    //rightTiles[i].setFrames(3,3,3,3);
					rightTiles[i].frame = 0;
					hitAnim[i].visible = true;
					hitAnim[i].animations.play('hitter');
                }
                
                else {
                    //rightTiles[i].setFrames(2,2,2,2);
					rightTiles[i].frame = 0;
					missAnim[i].visible = true;
					missAnim[i].animations.play('misser');
                }
                
                break;
            }
        }
    },
    
    tileReceive: function(data) {
        var found = false;
        for(var i = 0; i < shipTiles.length; i++) {
            for(var k = 0; k < shipTiles[i].length; k++) {
                if(data.location.row == shipTiles[i][k].row && data.location.column == shipTiles[i][k].column)
                {
                    IO.socket.emit('tile receive', { room: data.room, location: data.location, hit: true });
                    found = true;

                    for(var i = 0; i < leftTiles.length; i++) {
                        if(data.location.row == leftTiles[i].name.row && data.location.column == leftTiles[i].name.column) {
                            hitTiles.push(leftTiles[i].name);
                            leftTiles[i].frame = 0;
							smokeAnim[i].bringToTop();
							smokeAnim[i].visible = true;
							smokeAnim[i].animations.play('smoker');
                        }
                    }
                    
                    break;
                }
            }
        }
        
        if(!found) {
            IO.socket.emit('tile receive', { room: data.room, location: data.location, hit: false });
            
            /*for(var i = 0; i < leftTiles.length; i++) {
                if(data.location.row == leftTiles[i].name.row && data.location.column == leftTiles[i].name.column) {
                    leftTiles[i].frame = 2;
                }
            } */ 
        }
        
        //give input back to regular tiles
        for(var i = 0; i < rightTiles.length; i++) {
            var clicked = false;
            for(var k = 0; k < clickedTiles.length; k++) {
                if(rightTiles[i].name.row == clickedTiles[k].row && rightTiles[i].name.column == clickedTiles[k].column) {
                    clicked = true;
                } 
            }
            
            if(!clicked) {
                rightTiles[i].inputEnabled = true; 
            }
        }
    },
    
    start: function() {
        for(var i = 0; i < rightTiles.length; i++) {
            rightTiles[i].inputEnabled = true;
        }   
    },
    
    won: function() {
        
    },

    lost: function() {

    }
};

function makeLeftTiles(x, y) {
    var style = { font: '24px Algerian', fill: '#ffffff' };
        
    var number;
    //add 1 - 10
    number = game.add.text(49+x-100, 44*0+y, '1', style);
    number.anchor.setTo(0.5, 0.5);
    number = game.add.text(49+x-100, 44*1+y, '2', style);
    number.anchor.setTo(0.5, 0.5);
    number = game.add.text(49+x-100, 44*2+y, '3', style);
    number.anchor.setTo(0.5, 0.5);
    number = game.add.text(49+x-100, 44*3+y, '4', style);
    number.anchor.setTo(0.5, 0.5);
    number = game.add.text(49+x-100, 44*4+y, '5', style);
    number.anchor.setTo(0.5, 0.5);
    number = game.add.text(49+x-100, 44*5+y, '6', style);
    number.anchor.setTo(0.5, 0.5);
    number = game.add.text(49+x-100, 44*6+y, '7', style);
    number.anchor.setTo(0.5, 0.5);
    number = game.add.text(49+x-100, 44*7+y, '8', style);
    number.anchor.setTo(0.5, 0.5);
    number = game.add.text(49+x-100, 44*8+y, '9', style);
    number.anchor.setTo(0.5, 0.5);
    number = game.add.text(49+x-100, 44*9+y, '10', style);
    number.anchor.setTo(0.5, 0.5);

    var letter;
    //add A - J
    letter = game.add.text(44*0+x, 49+y-100, 'A', style);
    letter.anchor.setTo(0.5, 0.5);
    letter = game.add.text(44*1+x, 49+y-100, 'B', style);
    letter.anchor.setTo(0.5, 0.5);
    letter = game.add.text(44*2+x, 49+y-100, 'C', style);
    letter.anchor.setTo(0.5, 0.5);
    letter = game.add.text(44*3+x, 49+y-100, 'D', style);
    letter.anchor.setTo(0.5, 0.5);
    letter = game.add.text(44*4+x, 49+y-100, 'E', style);
    letter.anchor.setTo(0.5, 0.5);
    letter = game.add.text(44*5+x, 49+y-100, 'F', style);
    letter.anchor.setTo(0.5, 0.5);
    letter = game.add.text(44*6+x, 49+y-100, 'G', style);
    letter.anchor.setTo(0.5, 0.5);
    letter = game.add.text(44*7+x, 49+y-100, 'H', style);
    letter.anchor.setTo(0.5, 0.5);
    letter = game.add.text(44*8+x, 49+y-100, 'I', style);
    letter.anchor.setTo(0.5, 0.5);
    letter = game.add.text(44*9+x, 49+y-100, 'J', style);
    letter.anchor.setTo(0.5, 0.5);

    //add set up tiles
    for(var i = 0; i < 10; i++) {
        for(var k = 0; k < 10; k++) {
            var tile = game.add.sprite(44*k + x, 44*i + y, 'tile');
            tile.anchor.setTo(0.5, 0.5);
            tile.name = { row: i, column: k };
            leftTiles.push(tile);
        }
    }
	
	//Add smoke animation
	for(var i = 0; i < 10; i++) {
        for(var k = 0; k < 10; k++) {
            var tile = game.add.sprite(44*k + x, 44*i + y, 'smoke');
            tile.anchor.setTo(0.5, 0.5);
            tile.name = { row: i, column: k};
			tile.animations.add('smoker', [0, 1, 2, 3, 4, 5, 6,7,8,9,
										   10,11,12,13,14,15,16,17,18,19,
										   20,21,22,23,24,25,26,27,28,29,
										   30,31,32,33,34,35,36,37,38,39], 15, true);
			tile.visible = false;
			game.add.existing(tile);
			smokeAnim.push(tile);
        }
    }
	
}

function makeRightTiles(x, y) {
    var style = { font: '24px Algerian', fill: '#ffffff' };
        
    var number;
    //add 1 - 10
    number = game.add.text(49+x-100, 44*0+y, '1', style);
    number.anchor.setTo(0.5, 0.5);
    number = game.add.text(49+x-100, 44*1+y, '2', style);
    number.anchor.setTo(0.5, 0.5);
    number = game.add.text(49+x-100, 44*2+y, '3', style);
    number.anchor.setTo(0.5, 0.5);
    number = game.add.text(49+x-100, 44*3+y, '4', style);
    number.anchor.setTo(0.5, 0.5);
    number = game.add.text(49+x-100, 44*4+y, '5', style);
    number.anchor.setTo(0.5, 0.5);
    number = game.add.text(49+x-100, 44*5+y, '6', style);
    number.anchor.setTo(0.5, 0.5);
    number = game.add.text(49+x-100, 44*6+y, '7', style);
    number.anchor.setTo(0.5, 0.5);
    number = game.add.text(49+x-100, 44*7+y, '8', style);
    number.anchor.setTo(0.5, 0.5);
    number = game.add.text(49+x-100, 44*8+y, '9', style);
    number.anchor.setTo(0.5, 0.5);
    number = game.add.text(49+x-100, 44*9+y, '10', style);
    number.anchor.setTo(0.5, 0.5);

    var letter;
    //add A - J
    letter = game.add.text(44*0+x, 49+y-100, 'A', style);
    letter.anchor.setTo(0.5, 0.5);
    letter = game.add.text(44*1+x, 49+y-100, 'B', style);
    letter.anchor.setTo(0.5, 0.5);
    letter = game.add.text(44*2+x, 49+y-100, 'C', style);
    letter.anchor.setTo(0.5, 0.5);
    letter = game.add.text(44*3+x, 49+y-100, 'D', style);
    letter.anchor.setTo(0.5, 0.5);
    letter = game.add.text(44*4+x, 49+y-100, 'E', style);
    letter.anchor.setTo(0.5, 0.5);
    letter = game.add.text(44*5+x, 49+y-100, 'F', style);
    letter.anchor.setTo(0.5, 0.5);
    letter = game.add.text(44*6+x, 49+y-100, 'G', style);
    letter.anchor.setTo(0.5, 0.5);
    letter = game.add.text(44*7+x, 49+y-100, 'H', style);
    letter.anchor.setTo(0.5, 0.5);
    letter = game.add.text(44*8+x, 49+y-100, 'I', style);
    letter.anchor.setTo(0.5, 0.5);
    letter = game.add.text(44*9+x, 49+y-100, 'J', style);
    letter.anchor.setTo(0.5, 0.5);

    //add set up tiles
    for(var i = 0; i < 10; i++) {
        for(var k = 0; k < 10; k++) {
            var tile = new Phaser.Button(game, 44*k + x, 44*i + y, 'tile', onClick, this, 1, 0);
            tile.anchor.setTo(0.5, 0.5);
            tile.name = { row: i, column: k };
            tile.inputEnabled = false;
            game.add.existing(tile);
            rightTiles.push(tile);
            
        }
    }
	
	//Add hit animation
	for(var i = 0; i < 10; i++) {
        for(var k = 0; k < 10; k++) {
            var tile = game.add.sprite(44*k + x, 44*i + y, 'hit');
            tile.anchor.setTo(0.5, 0.5);
            tile.name = { row: i, column: k, used: 'n'};			
			tile.animations.add('hitter', [0, 1, 2, 3, 4, 5, 6, 7,8,9,10, 
											  11, 12, 13, 14, 15, 8], 8, true);
			tile.visible = false;
			game.add.existing(tile);
			hitAnim.push(tile);
        }
    }
	
	//Add miss animation
	for(var i = 0; i < 10; i++) {
        for(var k = 0; k < 10; k++) {
            var tile = game.add.sprite(44*k + x, 44*i + y, 'miss');
            tile.anchor.setTo(0.5, 0.5);
            tile.name = { row: i, column: k, used: 'n'};
			tile.animations.add('misser', [0, 1, 2, 3], 8, true);
			tile.visible = false;
			game.add.existing(tile);
			missAnim.push(tile);
        }
    }
}

function onClick(item) {
    IO.socket.emit('tile send', { location: item.name, room: currentRoom } );
           
    clickedTiles.push(item.name);
    
    for(var i = 0; i < leftTiles.length; i++) {
        rightTiles[i].inputEnabled = false;
    }
}