
    var config = {
        type: Phaser.AUTO,
        width: 480,
        height: 640,
        parent: 'phaser-game',
        scene: [SceneMain , SceneOver],
        physics: {
            default: 'arcade',
            arcade: {
                debug: false
            }
        }
    };
var game = new Phaser.Game(config);