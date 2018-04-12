PhaserSGBoiler.Preloader = function(game) {
    this.loadedAssets;
    this.loadedSave;
};

PhaserSGBoiler.Preloader.prototype = {
    preload: function() {
        // NOTE Loading the savegame in the preloader to wait for the callback
        console.log(examplePrefix + "sdkHandler.trigger 'restore' called");
        sdkHandler.trigger('restore', {
            key: PhaserSGBoiler.slug + PhaserSGBoiler.version,
            callback: function(error, value) {
                if (error || value == null) {
                    this.loadedSave = true;
                    PhaserSGBoiler.saveState = { highscore: 0 };
                } else {
                    this.loadedSave = true;
                    PhaserSGBoiler.saveState = JSON.parse(value);
                }
            }
        }, this);
        this.preloadBar = this.add.sprite(10, 30, 'preloadbar');
        this.load.setPreloadSprite(this.preloadBar);
        game.load.onFileComplete.add(this.fileComplete, this);
        // game files should be loaded only when they are needed
        // those are here to test "loading.update"
        game.load.image('sky', 'assets/sky.png');
        game.load.image('ground', 'assets/platform.png');
        game.load.image('star', 'assets/star.png');
        game.load.image('bomb', 'assets/bomb.png');
        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        game.load.image('menu', 'assets/number-buttons-90x90.png', 270, 180);
        this.load.onLoadComplete.add(function() {
            this.loadedAssets = true;
        }, this);

    },
    create: function() {
        this.game.stage.backgroundColor = '#555';
    },
    update: function() {
        if(this.loadedAssets && this.loadedSave) {
            // NOTE Notifying the sdk that the game is fully loaded
            console.log(examplePrefix + "sdkHandler.trigger 'loading.completed' called");
            sdkHandler.trigger('loading.completed', {
                callback: function(error, user) {
                    if (error) {
                        /* loading.completed failed, handle error */
                    } else {
                        /* loading.completed succeeded, you can use the user object {userId, name, avatar, avatarBase64} */
                    }
                }
            }, this);
        }
    },
    fileComplete: function (progress, cacheKey, success, totalLoaded, totalFiles) {
        console.log(examplePrefix + progress + "% loaded");
        // NOTE Notifying the sdk about the current loading status
        console.log(examplePrefix + "sdkHandler.trigger 'loading.update' called");
        sdkHandler.trigger('loading.update', { progressPercentage: progress}, this);
    }
}
