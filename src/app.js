var examplePrefix = "[SG-SDK][EXAMPLE-GAME]: ";

PhaserSGBoiler = {
    /* Here we've just got some global level vars that persist regardless of State swaps */
    version: "0.0.2",
    slug: "phaser-sg-boilerplate",
    score: 0,
    language: "en",
    music: null,
    saveState: null,
    isStarted: false

};

function runGame() {
    var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: {
                    y: 300
                },
                debug: false
            }
        }
    };
    game = new Phaser.Game(config);
    game.state.add('Boot', PhaserSGBoiler.Boot);
    game.state.add('Preloader', PhaserSGBoiler.Preloader);
    game.state.add('Menu', PhaserSGBoiler.Menu);
    game.state.add('Game', PhaserSGBoiler.Game);
    game.state.start('Boot');
}
