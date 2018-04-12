PhaserSGBoiler.Game = function(game) {};

PhaserSGBoiler.Game.prototype = {
    player: null,
    stars: null,
    platforms: null,
    cursors: null,
    gameOver: false,
    scoreText: null,
    highScoreText: null,
    bombs: null,
    isPauseMenuOpen: false,

    preload: function() {},
    create: function() {
        // NOTE The game round is now starting
        console.log(examplePrefix + "sdkHandler.trigger 'gameStart' called");
        sdkHandler.trigger('gameStart');

        //  We're going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //  A simple background for our game
        game.add.sprite(0, 0, 'sky');

        //  Finally some bombs to die
        bombs = game.add.group();
        bombs.enableBody = true;

        //  The platforms group contains the ground and the 2 ledges we can jump on
        platforms = game.add.group();

        //  We will enable physics for any object that is created in this group
        platforms.enableBody = true;

        // Here we create the ground.
        var ground = platforms.create(0, game.world.height - 64, 'ground');

        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        ground.scale.setTo(2, 2);

        //  This stops it from falling away when you jump on it
        ground.body.immovable = true;

        //  Now let's create two ledges
        var ledge = platforms.create(400, 400, 'ground');
        ledge.body.immovable = true;

        ledge = platforms.create(-150, 250, 'ground');
        ledge.body.immovable = true;

        // The player and its settings
        player = game.add.sprite(32, game.world.height - 150, 'dude');

        //  We need to enable physics on the player
        game.physics.arcade.enable(player);

        //  Player physics properties. Give the little guy a slight bounce.
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        //  Finally some stars to collect
        stars = game.add.group();

        //  We will enable physics for any star that is created in this group
        stars.enableBody = true;

        //  Here we'll create 12 of them evenly spaced apart
        for (var i = 0; i < 12; i++) {
            //  Create a star inside of the 'stars' group
            var star = stars.create(i * 70, 0, 'star');

            //  Let gravity do its thing
            star.body.gravity.y = 300;

            //  This just gives each star a slightly random bounce value
            star.body.bounce.y = 0.7 + Math.random() * 0.2;
        }

        //  The score
        scoreText = game.add.text(16, 16, 'score: 0', {
            fontSize: '32px',
            fill: '#000'
        });
        PhaserSGBoiler.score = 0;
        highScoreText = game.add.text(16, 48, 'Highscore: ' + PhaserSGBoiler.saveState.highscore, {
            fontSize: '32px',
            fill: '#000'
        });

        // Create a label to use as a button
        pause_label = game.add.text(game.width - 100, 20, 'Pause', {
            font: '24px Arial',
            fill: '#fff'
        });
        pause_label.inputEnabled = true;
        pause_label.events.onInputUp.add(this.pause);

        // Add a input listener that can help us return from being paused
        game.input.onDown.add(this.unpause.bind(this), self);

        //  Our controls.
        cursors = game.input.keyboard.createCursorKeys();
    },
    update: function() {
        //  Collide the player and the stars with the platforms
        var hitPlatform = game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(stars, platforms);
        game.physics.arcade.collide(bombs, platforms);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        game.physics.arcade.overlap(player, stars, this.collectStar, null, this);

        //  Checks to see if the player overlaps with any of the bombs, if he does call the hitBomb function
        game.physics.arcade.overlap(player, bombs, this.hitBomb, null, this);

        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;

        if (cursors.left.isDown) {
            //  Move to the left
            player.body.velocity.x = -150;
            player.animations.play('left');
        } else if (cursors.right.isDown) {
            //  Move to the right
            player.body.velocity.x = 150;
            player.animations.play('right');
        } else {
            //  Stand still
            player.animations.stop();
            player.frame = 4;
        }
        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown && player.body.touching.down && hitPlatform) {
            player.body.velocity.y = -350;
        }
    },
    collectStar: function(player, star) {
        // Removes the star from the screen
        stars.remove(star, true, false);
        star.kill();

        if(stars.children.length === 0)
        {
            //  Here we'll create 12 of them evenly spaced apart
            for (var i = 0; i < 12; i++) {
                //  Create a star inside of the 'stars' group
                var star = stars.create(i * 70, 0, 'star');

                //  Let gravity do its thing
                star.body.gravity.y = 300;

                //  This just gives each star a slightly random bounce value
                star.body.bounce.y = 0.7 + Math.random() * 0.2;
            }

        }
        var bomb = bombs.create(i * 70, 0, 'bomb');
        bomb.body.collideWorldBounds = true;
        bomb.body.gravity.y = 0;
        bomb.body.velocity.x = (0.7 + Math.random() * 0.2)*100;
        bomb.body.velocity.y = (0.7 + Math.random() * 0.2)*100;
        bomb.body.bounce.x = 0.7 + Math.random() * 0.2;
        bomb.body.bounce.y = 0.7 + Math.random() * 0.2;

        //  Add and update the score
        PhaserSGBoiler.score += 10;
        scoreText.text = 'Score: ' + PhaserSGBoiler.score;
        if(PhaserSGBoiler.saveState.highscore < PhaserSGBoiler.score)
        {
            highScoreText.text = 'Highscore: ' + PhaserSGBoiler.score
        }
    },
    hitBomb: function (player, bomb) {
        bombs.remove(bomb, true, false);
        bomb.kill();
        this.die();
    },
    die: function() {
        player.tint = 0xff0000;
        //  Stand still
        player.animations.stop();
        player.frame = 4;
        this.gameOver = true;
        this.pause();
        choiseLabel.text = 'you lose';
    },
    submitGameOver: function () {
        // NOTE notifying the sdk that the round is over
        console.log(examplePrefix + "sdkHandler.trigger 'gameOver' called");
        sdkHandler.trigger('gameOver', {
            score: PhaserSGBoiler.score,
            // NOTE optional
            /*
            shareImage: "res/share.png",
            shareText: "Check Out My New Score!",
            appVariant: "dailyChallengeMode",
            customMessage: [{
                name: 'newHighScore',
                background: 'custom-message/bg.jpg',
                nameFont: 'custom-message/title-font',
                score font 'custom-message / score font',
                userImageTopMargin: 98,
                userImageLeftMargin: 260,
                userImageWidth: 148,
                userNameTopMargin: 260,
                scoreTopMargin: 310,
            }, {
                name: 'beatFriend',
                background: 'custom-message/bg_03_v2.jpg',
                nameFont: 'custom-message/title-font',
                score font 'custom-message / score font',
                titleFont: custom message / font score,
                user1ImageTopMargin: 122,
                user1ImageLeftMargin: 223,
                user1ImageWidth: 102,
                userName1TopMargin: 145,
                score1TopMargin: 190,
                user2ImageTopMargin: 142,
                user2ImageLeftMargin: 347,
                user2ImageWidth: 102,
                userName2TopMargin: 145,
                score2TopMargin: 190,
                titleTopMargin: 300
            }],
            */
            callback: function(err) {
                if(err) {
                    /* failed, handle error */
                    console.log(examplePrefix + "Gameover callback - error");
                }
                else {
                    /* succeeded */
                    console.log(examplePrefix + "Gameover callback - success");
                }
            }
        });

        if (PhaserSGBoiler.saveState.highscore < PhaserSGBoiler.score) {
            PhaserSGBoiler.saveState.highscore = PhaserSGBoiler.score;
            // NOTE saving the game if score is higher then highscore
            console.log(examplePrefix + "sdkHandler.trigger 'save' called");
            sdkHandler.trigger('save', {
                key: PhaserSGBoiler.slug + PhaserSGBoiler.version,
                value: JSON.stringify(PhaserSGBoiler.saveState),
                callback: function(error) {
                    if(error) {
                        /* save failed, handle error */
                        console.log(examplePrefix + "Saving callback - error");
                    }
                    else {
                        /* save succeeded */
                        console.log(examplePrefix + "Saving callback - success");
                    }
                }
            }, this);
        }
    },
    pause: function() {
        // When the paus button is pressed, we pause the game
        game.paused = true;
        this.isPauseMenuOpen = true;

        // Then add the menu
        menu = game.add.sprite(game.width / 2, game.height / 2, 'menu');
        menu.anchor.setTo(0.5, 0.5);

        // And a label to illustrate which menu item was chosen. (This is not necessary)
        choiseLabel = game.add.text(game.width / 2, game.height - 150, 'Click outside menu to continue', {
            font: '30px Arial',
            fill: '#fff'
        });
        choiseLabel.anchor.setTo(0.5, 0.5);
    },

    unpause: function (event) {
        // Only act if paused
        if (game.paused && this.isPauseMenuOpen) {
            // Calculate the corners of the menu
            var x1 = game.width / 2 - 270 / 2,
                x2 = game.width / 2 + 270 / 2,
                y1 = game.height / 2 - 180 / 2,
                y2 = game.height / 2 + 180 / 2;

            // Check if the click was inside the menu
            if (event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2) {
                // The choicemap is an array that will help us see which item was clicked
                var choisemap = ['one', 'two', 'three', 'four', 'five', 'six'];

                // Get menu local coordinates for the click
                var x = event.x - x1,
                    y = event.y - y1;

                // Calculate the choice
                var choise = Math.floor(x / 90) + 3 * Math.floor(y / 90);
                if(this.gameOver == true && choise < 2)
                    this.submitGameOver();
                if(choise == 0){
                    // Unpause the game
                    game.paused = false;
                    this.isPauseMenuOpen = false;
                    game.state.start("Menu");

                }else if(choise == 1){
                    // Unpause the game
                    game.paused = false;
                    this.isPauseMenuOpen = false;
                    game.state.start("Game");
                } else if(choise == 2){
                    console.log("try ad");
                    if(sgSettings.config.rewarded.enabled)
                    {
                        sdkHandler.trigger('rewardedAd',{
                            callback: function(success) {
                                if (success) {
                                    /* show thanks for watching screen and the reward given (e.g. coins, boosters, continue game) */
                                    console.log(examplePrefix + "rewardedAd callback - success");
                                    PhaserSGBoiler.score = PhaserSGBoiler.score * 2
                                    scoreText.text = 'Score: ' + PhaserSGBoiler.score;
                                }
                                else {
                                    /* 'no more videos screen */
                                    console.log(examplePrefix + "rewardedAd callback - error (no more vids)");
                                    choiseLabel.text = 'no ads available';
                                }
                            }
                        },this);
                    }
                }
            } else if(!this.gameOver){
                // Remove the menu and the label
                menu.destroy();
                choiseLabel.destroy();

                // Unpause the game
                game.paused = false;
                this.isPauseMenuOpen = false;
            }
        }
    }
}
