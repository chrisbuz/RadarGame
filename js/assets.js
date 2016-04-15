OverGame.assets = {}

OverGame.assets.BootState = {
    spritesheets: [
        {name: 'spinner', path: 'assets/sprites/spinnersprite.png', width: 128, height: 128 }   
    ]
};

OverGame.assets.LoaderState = {
    
    images: [
        {name: 'primarybackground', path: 'assets/images/primarybackground.png'},
        {name: 'secondarybackground', path: 'assets/images/secondarybackground.png'},
        {name: 'instructionbackground', path: 'assets/images/instructionbackground.png'}
    ],
    
    spritesheets: [
        {name: 'start', path: 'assets/sprites/start.png', width: 303.5, height: 97},
		{name: 'instruct', path: 'assets/sprites/instructions.png', width: 304, height: 97},
		{name: 'playagain', path: 'assets/sprites/playagain.png', width: 303, height: 96},
		{name: 'quit', path: 'assets/sprites/quit.png', width: 304, height: 97},
		{name: 'back', path: 'assets/sprites/back.png', width: 41, height: 40},
        {name: 'ready', path: 'assets/sprites/ready.png', width: 303.5, height: 97},
        {name: 'tile', path: 'assets/sprites/tile.png', width: 48, height: 48},
        {name: 'uboat', path: 'assets/sprites/uboat.png', width: 66, height: 36},
        {name: 'destroyer', path: 'assets/sprites/destroyer.png', width: 111, height: 36},
        {name: 'submarine', path: 'assets/sprites/submarine.png', width: 111, height: 36},
        {name: 'battleship', path: 'assets/sprites/battleship.png', width: 156, height: 36},
        {name: 'carrier', path: 'assets/sprites/carrier.png', width: 201, height: 36},
		{name: 'hit', path: 'assets/sprites/hit.png', width: 48, height: 48},
		{name: 'miss', path: 'assets/sprites/miss2.png', width: 46, height: 29},
		{name: 'smoke', path: 'assets/sprites/smoke.png', width: 48, height: 48}
    ],
    
    audio: [
        {name: 'mouse_d', path: 'assets/audio/buttons/mdown.mp3'},
        {name: 'mouse_o', path: 'assets/audio/buttons/mover.mp3'},
        {name: '1000ships', path: 'assets/audio/music/1000_ships.mp3'}//,
        //{name: 'breath', path: 'assets/audio/music/breath_of_ran_gor.mp3'},
        //{name: 'freedomfighters', path: 'assets/audio/music/freedom_fighters.mp3'},
        //{name: 'infinitelegends', path: 'assets/audio/music/infinite_legends.mp3'},
        //{name: 'masterofshadows', path: 'assets/audio/music/master_of_shadows.mp3'},
        //{name: 'toglory', path: 'assets/audio/music/to_glory.mp3'}   
    ]
};