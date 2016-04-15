var App = {
    
    startPhaser: function() {
        
        var width = 1200;
        var height = 720;

        var game = new Phaser.Game(width, height, Phaser.AUTO, '');

        //Initiate all states
        game.state.add('Boot', OverGame.BootState);
        game.state.add('Loader', OverGame.LoaderState);
        game.state.add('Main', OverGame.MainState);
        game.state.add('Ready', OverGame.ReadyState);
        game.state.add('Setup', OverGame.SetupState);
        game.state.add('Game', OverGame.GameState);
        game.state.add('Instructions', OverGame.InstructionState);

        game.state.start('Boot');

        window.game = game;
    }
};

App.startPhaser();
