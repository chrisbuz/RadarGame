//text and buttons
var back_btn;
var ready_btn;
var waiting;
var instructions;
var roomName;

//is it on grid?
var carrierOn;
var battleshipOn;
var submarineOn;
var destroyerOn;
var uboatOn;

//is it being dragged?
var carrierDrag;
var battleshipDrag;
var submarineDrag;
var destroyerDrag;
var uboatDrag;

//is it rotated?
var carrierRotated;
var battleshipRotated;
var submarineRotated;
var destroyerRotated;
var uboatRotated;

//ship sprites
var carrier;
var battleship;
var submarine;
var destroyer;
var uboat;

//array that holds the positions to transition for gamestate
var position = new Array();

OverGame.SetupState = function(game) {
    
};

OverGame.SetupState.prototype = {
    
	create: function() {
        carrierOn = false;
        battleshipOn = false;
        submarineOn = false;
        destroyerOn = false;
        uboatOn = false;
        
        carrierDrag = false;
        battleshipDrag = false;
        submarineDrag = false;
        destroyerDrag = false;
        uboatDrag = false;
           
        carrierRotated = false;
        battleshipRotated = false;
        submarineRotated = false;
        destroyerRotated = false;
        uboatRotated = false;
        
        this.add.sprite(0, 0, 'secondarybackground');
        
		var mouse_o = new Phaser.Sound(game, 'mouse_o', .4);
		var mouse_d = new Phaser.Sound(game, 'mouse_d', .4);
        
	    back_btn = new Phaser.Button(game, 44, 44, 'back', this.onBack, this, 1, 0, 1);
        back_btn.anchor.setTo(0.5, 0.5);
    
        ready_btn = new Phaser.Button(game, 850, 500, 'ready', this.onReady, this, 1, 0, 1);
        ready_btn.anchor.setTo(0.5, 0.5);
        ready_btn.visible = false;
        
        text = "Waiting for opponent...";
        style = { font: "32px Algerian", fill: "#ffffff", align: 'center' };
        waiting = new Phaser.Text(game, 850, game.world.centerY, text, style);
        waiting.anchor.setTo(0.5,0.5);
        waiting.visible = false;
        
        text = "Place your ships on the grid\nTo rotate press the spacebar\n\nOnce all ships are placed, press 'Ready'\n(Note: 'Ready' won't show up \nuntil all ships are placed.)";
        style = { font: "32px Calibri", fill: "#ffffff", align: 'center' };
        instructions = new Phaser.Text(game, 850, 100, text, style);
        instructions.anchor.setTo(0.5, 0);
        
        text = currentRoom;
        style = { font: "32px Algerian", fill: "#ffffff", align: 'center' };
        roomName = new Phaser.Text(game, game.world.centerX, 25, text, style);
        roomName.anchor.setTo(0.5, 0.5);
        
        //Add over and down sounds to the buttons
		back_btn.setSounds(mouse_o, '', mouse_d);
        ready_btn.setSounds(mouse_o, '', mouse_d);
    
		//Apply to game
		game.add.existing(back_btn);
        game.add.existing(ready_btn);
        game.add.existing(instructions);
        game.add.existing(waiting);
        game.add.existing(roomName);
        
        this.makeTiles(44*3+22, 44*3);
        
        carrier = game.add.sprite(100, 600, 'carrier', 1);
        updateCarrierBounds();
        carrier.anchor.setTo(0.2, 0.5);
        carrier.inputEnabled = true;
        carrier.input.enableDrag();
        carrier.input.enableSnap(44, 44, false, true);
        carrier.events.onDragStop.add(this.carrierDragStop);
        carrier.events.onDragStart.add(this.carrierDragStart);
        
        battleship = game.add.sprite(100, 650, 'battleship', 1);
        updateBattleshipBounds();
        battleship.anchor.setTo(0.25, 0.5);
        battleship.inputEnabled = true;
        battleship.input.enableDrag();
        battleship.input.enableSnap(44, 44, false, true);
        battleship.events.onDragStop.add(this.battleshipDragStop);
        battleship.events.onDragStart.add(this.battleshipDragStart);
        
        submarine = game.add.sprite(325, 600, 'submarine', 1);
        updateSubmarineBounds();
        submarine.anchor.setTo(0.333, 0.5);
        submarine.inputEnabled = true;
        submarine.input.enableDrag();
        submarine.input.enableSnap(44, 44, false, true);
        submarine.events.onDragStop.add(this.submarineDragStop);
        submarine.events.onDragStart.add(this.submarineDragStart);
        
        destroyer = game.add.sprite(280, 650, 'destroyer', 1);
        updateDestroyerBounds();
        destroyer.anchor.setTo(0.333, 0.5);
        destroyer.inputEnabled = true;
        destroyer.input.enableDrag();
        destroyer.input.enableSnap(44, 44, false, true);
        destroyer.events.onDragStop.add(this.destroyerDragStop);
        destroyer.events.onDragStart.add(this.destroyerDragStart);
        
        uboat = game.add.sprite(415, 650, 'uboat', 1);
        updateUboatBounds();
        uboat.anchor.setTo(0.5, 0.5);
        uboat.inputEnabled = true;
        uboat.input.enableDrag();
        uboat.input.enableSnap(44, 44, false, true);
        uboat.events.onDragStop.add(this.uboatDragStop);
        uboat.events.onDragStart.add(this.uboatDragStart);
    },
	
    update: function() {
        if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            if(carrierDrag) {
                this.rotateCarrier();
            }
        
            else if(battleshipDrag) {
                this.rotateBattleship();
            }
            
            else if(submarineDrag) {
                this.rotateSubmarine();
            }
        
            else if(destroyerDrag) {
                this.rotateDestroyer();
            }
            
            else if(uboatDrag) {
                this.rotateUboat();
            }   
        }
    },
    
    onBack: function() {
        IO.socket.emit('leave room');
        var message = 'I have left the room';
        console.log(message);
        game.state.start('Main');
    },
    
    onReady: function() {
        IO.socket.emit('play', { room: currentRoom } );
        ready_btn.visible = false;
        instructions.visible = false;
        waiting.visible = true;

        var pos;

        carrier.inputEnabled = false;
        pos = { xpos: carrier.x, ypos: carrier.y, rotated: carrierRotated };
        position.push(pos);

        battleship.inputEnabled = false;
        pos = { xpos: battleship.x, ypos: battleship.y, rotated: battleshipRotated };
        position.push(pos);

        submarine.inputEnabled = false;
        pos = { xpos: submarine.x, ypos: submarine.y, rotated: submarineRotated };
        position.push(pos);

        destroyer.inputEnabled = false;
        pos = { xpos: destroyer.x, ypos: destroyer.y, rotated: destroyerRotated };
        position.push(pos);

        uboat.inputEnabled = false;
        pos = { xpos: uboat.x, ypos: uboat.y, rotated: uboatRotated };
        position.push(pos);  
    },
    
    //DragStop functions FOR SHIPS

    carrierDragStop: function(item) {
        //fix positions
        if(carrierRotated) {
            item.x -= 22;
            item.y -= 22;
        }
        
        //Move the items when it is already dropped.
            carrierOn = true;
            carrierDrag = false;

            updateCarrierBounds();
        
        if(item.name.top < 44*3-22 || item.name.bottom > 44*13-22 ||
           item.name.left < 44*3 || item.name.right > 44*13 ||
           checkOverlap(carrier, battleship, false) || checkOverlap(carrier, submarine, false) || checkOverlap(carrier, destroyer, false) || checkOverlap(carrier, uboat, false)) {
            item.x = 100;
            item.y = 600;
            item.angle = 0;
            carrierOn = false;
            carrierRotated = false;
        }
        
        updateCarrierBounds();

        if(carrierOn && battleshipOn && submarineOn && destroyerOn && uboatOn) {
            ready_btn.visible = true;
            return;
        }

        ready_btn.visible = false;
    },

    battleshipDragStop: function(item) {
        //fix positions
        if(battleshipRotated) {
            item.x -= 22;
            item.y -= 22;
        }
        
        //Move the items when it is already dropped.
            battleshipOn = true;
            battleshipDrag = false;

            updateBattleshipBounds();
        
        if(item.name.top < 44*3-22 || item.name.bottom > 44*13-22 ||
           item.name.left < 44*3 || item.name.right > 44*13 || 
           checkOverlap(battleship, carrier, false) || checkOverlap(battleship, submarine, false) || checkOverlap(battleship, destroyer, false) || checkOverlap(battleship, uboat, false)) {
            item.x = 100;
            item.y = 650;
            item.angle = 0;
            battleshipOn = false;
            battleshipRotated = false;
        }
        
        updateBattleshipBounds();

        if(carrierOn && battleshipOn && submarineOn && destroyerOn && uboatOn) {
            ready_btn.visible = true;
            return;
        }

        ready_btn.visible = false;
    },

    submarineDragStop: function(item) {
        //fix positions
        if(submarineRotated) {
            item.x -= 22;
            item.y -= 22;
        }
        
        //Move the items when it is already dropped.
            submarineOn = true;
            submarineDrag = false;

            updateSubmarineBounds();

        if(item.name.top < 44*3-22 || item.name.bottom > 44*13-22 ||
           item.name.left < 44*3 || item.name.right > 44*13 ||
           checkOverlap(submarine, carrier, false) || checkOverlap(submarine, battleship, false) || checkOverlap(submarine, destroyer, false) || checkOverlap(submarine, uboat, false)) {
            item.x = 325;
            item.y = 600;
            item.angle = 0;
            submarineOn = false;
            submarineRotated = false;
        }
        
        updateSubmarineBounds();

        if(carrierOn && battleshipOn && submarineOn && destroyerOn && uboatOn) {
            ready_btn.visible = true;
            return;
        }

        ready_btn.visible = false;
    },

    destroyerDragStop: function(item) {
        //fix positions
        if(destroyerRotated) {
            item.x -= 22;
            item.y -= 22;
        }
        
        //Move the items when it is already dropped.
            destroyerOn = true;
            destroyerDrag = false;
        
            updateDestroyerBounds();

        if(item.name.top < 44*3-22 || item.name.bottom > 44*13-22 ||
           item.name.left < 44*3 || item.name.right > 44*13 ||
            checkOverlap(destroyer, carrier, false) || checkOverlap(destroyer, battleship, false) || checkOverlap(destroyer, submarine, false) || checkOverlap(destroyer, uboat, false)) {
            item.x = 280;
            item.y = 650;
            item.angle = 0;
            destroyerOn = false;
            destroyerRotated = false;
        }

        updateDestroyerBounds();
        
        if(carrierOn && battleshipOn && submarineOn && destroyerOn && uboatOn) {
            ready_btn.visible = true;
            return;
        }

        ready_btn.visible = false;
    },

    uboatDragStop: function(item) {
        //fix positions
        if(uboatRotated) {
            item.x -= 22;
            item.y -= 22;
        }
        
        //Move the items when it is already dropped.
            uboatOn = true;
            uboatDrag = false;
        
        updateUboatBounds();

        if(item.name.top < 44*3-22 || item.name.bottom > 44*13-22 ||
           item.name.left < 44*3 || item.name.right > 44*13 ||
           checkOverlap(uboat, carrier, false) || checkOverlap(uboat, battleship, false) || checkOverlap(uboat, submarine, false) || checkOverlap(uboat, destroyer, false)) {
            item.x = 415;
            item.y = 650;
            item.angle = 0;
            uboatOn = false;
            uboatRotated = false;
        }

        updateUboatBounds();
        
        if(carrierOn && battleshipOn && submarineOn && destroyerOn && uboatOn) {
            ready_btn.visible = true;
            return;
        }

        ready_btn.visible = false;
    },

    //DragStart for ships

    carrierDragStart: function(item) {
        carrierDrag = true;
    },

    battleshipDragStart: function(item) {
        battleshipDrag = true;
    },

    submarineDragStart: function(item) {
        submarineDrag = true;
    },

    destroyerDragStart: function(item) {
        destroyerDrag = true;
    },

    uboatDragStart: function(item) {
        uboatDrag = true;
    },
    
    rotateCarrier: function() {
        if(carrierRotated) {
            carrier.angle -= 90;
            carrierRotated = false;
            sleep(250);
        }
        
        else {
            carrier.angle += 90;
            carrierRotated = true;
            sleep(250);
        }
    },
        
    rotateBattleship: function() {
        if(battleshipRotated) {
            battleship.angle -= 90;
            battleshipRotated = false;
            sleep(250);
        }
        
        else {
            battleship.angle += 90;
            battleshipRotated = true;
            sleep(250);
        }
    },

    rotateSubmarine: function() {
        if(submarineRotated) {
            submarine.angle -= 90;
            submarineRotated = false;
            sleep(250);
        }
        
        else {
            submarine.angle += 90;
            submarineRotated = true;
            sleep(250);
        }
    },

    rotateDestroyer: function() {
        if(destroyerRotated) {
            destroyer.angle -= 90;
            destroyerRotated = false;
            sleep(250);
        }
        
        else {
            destroyer.angle += 90;
            destroyerRotated = true;
            sleep(250);
        }
    },

    rotateUboat: function() {
        if(uboatRotated) {
            uboat.angle -= 90;
            uboatRotated = false;
            sleep(250);
        }
        
        else {
            uboat.angle += 90;
            uboatRotated = true;
            sleep(250);
        }
    },
            
    makeTiles: function(x, y) {
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
                var tile = game.add.sprite(44*i + x, 44*k + y, 'tile');
                tile.frame = 1;
                tile.anchor.setTo(0.5, 0.5);
            }
        }    
    }
};

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function updateCarrierBounds() {
    if(carrierRotated) {
        carrier.name = { top: carrier.y - (201 * 0.2), bottom: carrier.y + (201 * 0.8), left: carrier.x - (36 * 0.5), right: carrier.x + (36 * 0.5) };
    }

    else {
        carrier.name = { top: carrier.y - (36 * 0.5), bottom: carrier.y + (36 * 0.5), left: carrier.x - (201 * 0.2), right: carrier.x + (201 * 0.8) };
    }
}

function updateBattleshipBounds() {
    if(battleshipRotated) {
        battleship.name = { top: battleship.y - (156 * 0.25), bottom: battleship.y + (156 * 0.75), left: battleship.x - (36 * 0.5), right: battleship.x + (36 * 0.5) };
    }

    else {
        battleship.name = { top: battleship.y - (36 * 0.5), bottom: battleship.y + (36 * 0.5), left: battleship.x - (156 * 0.25), right: battleship.x + (156 * 0.75) };
    }
}

function updateSubmarineBounds() {
    if(submarineRotated) {
        submarine.name = { top: submarine.y - (111 * 0.333), bottom: submarine.y + (111 * 0.667), left: submarine.x - (36 * 0.5), right: submarine.x + (36 * 0.5) };
    }

    else {
        submarine.name = { top: submarine.y - (36 * 0.5), bottom: submarine.y + (36 * 0.5), left: submarine.x - (111 * 0.333), right: submarine.x + (111 * 0.667) };
    }
}

function updateDestroyerBounds() {
    if(destroyerRotated) {
        destroyer.name = { top: destroyer.y - (111 * 0.333), bottom: destroyer.y + (111 * 0.667), left: destroyer.x - (36 * 0.5), right: destroyer.x + (36 * 0.5) };
    }

    else {
        destroyer.name = { top: destroyer.y - (36 * 0.5), bottom: destroyer.y + (36 * 0.5), left: destroyer.x - (111 * 0.333), right: destroyer.x + (111 * 0.667) };
    }
}

function updateUboatBounds() {
    if(uboatRotated) {
        uboat.name = { top: uboat.y - (66 * 0.5), bottom: uboat.y + (66 * 0.5), left: uboat.x - (36 * 0.5), right: uboat.x + (36 * 0.5) };
    }

    else {
        uboat.name = { top: uboat.y - (36 * 0.5), bottom: uboat.y + (36 * 0.5), left: uboat.x - (66 * 0.5), right: uboat.x + (66 * 0.5) };
    }
}

 function checkOverlap(sprite1, sprite2, checked) {
    if(sprite1.name.left < sprite2.name.left && sprite1.name.right > sprite2.name.left && 
            sprite1.name.top < sprite2.name.top && sprite1.name.bottom > sprite2.name.top || //1

       sprite1.name.left < sprite2.name.left && sprite1.name.right > sprite2.name.left && 
            sprite1.name.top < sprite2.name.bottom && sprite1.name.bottom > sprite2.name.bottom || //2

       sprite1.name.left < sprite2.name.right && sprite1.name.right > sprite2.name.right && 
            sprite1.name.top < sprite2.name.top && sprite1.name.bottom > sprite2.name.top || //3

       sprite1.name.left < sprite2.name.right && sprite1.name.right > sprite2.name.right && 
            sprite1.name.top < sprite2.name.bottom && sprite1.name.bottom > sprite2.name.bottom || //4

       sprite1.name.left < sprite2.name.left && sprite1.name.right > sprite2.name.left && 
            sprite1.name.top >= sprite2.name.top && sprite1.name.bottom <= sprite2.name.bottom || //5

       sprite1.name.left < sprite2.name.right && sprite1.name.right > sprite2.name.right && 
            sprite1.name.top >= sprite2.name.top && sprite1.name.bottom <= sprite2.name.bottom || //6

       sprite1.name.left >= sprite2.name.left && sprite1.name.right <= sprite2.name.right && 
            sprite1.name.top < sprite2.name.top && sprite1.name.bottom > sprite2.name.top || //7

       sprite1.name.left >= sprite2.name.left && sprite1.name.right <= sprite2.name.right && 
            sprite1.name.top < sprite2.name.bottom && sprite1.name.bottom > sprite2.name.bottom || //8

       sprite1.name.left >= sprite2.name.left && sprite1.name.right <= sprite2.name.right && 
            sprite1.name.top >= sprite2.name.top && sprite1.name.bottom <= sprite2.name.bottom //9
      ) {
            return true;
    }

   else if(!checked) {
        return checkOverlap(sprite2, sprite1, true);
    }

    return false;
}
