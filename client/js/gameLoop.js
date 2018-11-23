
// player data
var playerScore = 0;
var playerScoreTextImage;

// controllers
var cursors;
var dCursors;   // developers' cursors

var gameLoop = {};
gameLoop.init = (data) => {
    gameLoop.player = data.player || config.default.player;
    gameLoop.score  = data.score  || config.default.score;
    if (data.debug && data.debug.isOn === true){
        gameLoop.debug = data.debug;
    }
}
gameLoop = {
    // game loop member variables ---------
    player: {
        sprite: {},
        playerSpeed : config.player.speed,
    },

    playerMovementMethod: {},

    // game loop methods ----------------
    /**
     * Extension method to bring delegate function support into javascript
     * TODO: move this to an extension methods script
     */
    createDelegate: function (func, target) {
        return function() {
            return func.apply(target, arguments);
        };
    },

    mouseMovementStrategy: function (player, playerSpeed) {
        let cursorDistanceFromPlayer = game.input.x - player.x;
        let intendedMoveDirection = Math.sign(cursorDistanceFromPlayer);
        let playerMovementDelta = cursorDistanceFromPlayer;
        if (Math.abs(cursorDistanceFromPlayer) > playerSpeed)
            playerMovementDelta = intendedMoveDirection * playerSpeed;
        player.x += playerMovementDelta;
    },

    keyboardMovementStrategy: function (player, playerSpeed) {
        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            player.x -= playerSpeed;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            player.x += playerSpeed;
        }
    },

    // phaser methods -------------------------

    create: function () {
        neutralMap.create();    // setup neutral map sprites

        // setup player
        gameLoop.player.sprite = game.add.sprite(config.init.screenWidth/2, config.init.screenHeight*3/4, 'player');
        gameLoop.player.sprite.anchor.setTo(0.5, 0.5);
        playerScoreTextImage = game.add.text(0, 5, config.player.score.text, { font: config.player.score.font, fill: config.player.score.color });

        // create user input
        gameLoop.playerMovementMethod = gameLoop.createDelegate(gameLoop.mouseMovementStrategy);
        //cursors = game.input.keyboard.createCursorKeys();
        dCursors = game.input.keyboard;
    },
    
    update: function(){
        neutralMap.updateMap();    // update neutral map states
        //updatePlayer(player, playerSpeed);
        gameLoop.playerMovementMethod(gameLoop.player.sprite, gameLoop.player.speed);

        gameLoop.score.amount += gameLoop.score.bonus1;

        // update score and text
        playerScoreTextImage.setText(config.player.score.text + gameLoop.score.amount);

        // developer buttons, IHAX YUR GAMEZ!!
        if(DEBUG){
            if(dCursors.isDown(Phaser.KeyCode.OPEN_BRACKET))
                neutralMap.changeMapSpeed(-1);
            if(dCursors.isDown(Phaser.KeyCode.CLOSED_BRACKET))
                neutralMap.changeMapSpeed(1);
        }

    }
};
