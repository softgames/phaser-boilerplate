PhaserSGBoiler.Boot = function(game) {};

PhaserSGBoiler.Boot.prototype = {
    preload: function() {
        this.load.image('preloadbar', 'assets/platform.png');
    },
    create: function() {
        this.game.stage.backgroundColor = '#555';
        // NOTE get the locale from sgSettings.config.env.locale
        PhaserSGBoiler.language = sgSettings.config.env.locale;
    },
    update: function() {
        game.state.start('Preloader');
    }
}
