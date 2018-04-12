PhaserSGBoiler.Menu = function(game) {};

PhaserSGBoiler.Menu.prototype = {
    button: null,

    preload: function() {
        this.optionCount = 1;
    },
    create: function() {
        game.add.sprite(0, 0, 'sky');
        this.addMenuOption('Start', function() {
            game.state.start("Game");
        });
        this.addMenuOption('More Games', function() {
            // NOTE A Button/Link to more SG Games
            console.log(examplePrefix + "sdkHandler.trigger 'moreGames' called");
            sdkHandler.trigger('moreGames');
        });

        //button = game.add.button(0, 0, 'star', this.actionOnClick, this);

        if(!PhaserSGBoiler.isStarted)
        {
            sdkHandler.trigger('start');
            PhaserSGBoiler.isStarted = true;
        }
    },
    update: function() {},
    /*
    actionOnClick: function () {
        console.log("buttonclick");
    },
    */
    addMenuOption: function(text, callback) {
        var optionStyle = {
            font: '30pt TheMinion',
            fill: 'white',
            align: 'left',
            stroke: 'rgba(0,0,0,0)',
            srokeThickness: 4
        };
        var txt = game.add.text(game.world.centerX, (this.optionCount * 80) + 200, text, optionStyle);
        txt.anchor.setTo(0.5);
        txt.stroke = "rgba(0,0,0,0";
        txt.strokeThickness = 4;
        var onOver = function(target) {
            target.fill = "#FEFFD5";
            target.stroke = "rgba(200,200,200,0.5)";
            txt.useHandCursor = true;
        };
        var onOut = function(target) {
            target.fill = "white";
            target.stroke = "rgba(0,0,0,0)";
            txt.useHandCursor = false;
        };
        //txt.useHandCursor = true;
        txt.inputEnabled = true;
        txt.events.onInputUp.add(callback, this);
        txt.events.onInputOver.add(onOver, this);
        txt.events.onInputOut.add(onOut, this);

        this.optionCount++;
    }
}
