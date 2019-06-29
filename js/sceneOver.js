class SceneOver extends Phaser.Scene {
    constructor() {
        super('SceneOver');
    }
    preload()
    {
        this.preloadKey("background")
        this.preloadKey("city")
    }

    preloadKey(key) {
        this.load.image(key, "images/" + key + ".png");
    }

    create() {
        // Add Background and city

        this.background = this.add.image(0, 0, "background")
        this.background.setOrigin(0, 0)
        this.background.displayHeight = game.config.height
        this.background.displayWidth = game.config.width

        this.city = this.add.image(game.config.width / 2, game.config.height, "city").setOrigin(.5, 1)
        Align.scaleToGameW(this.city, 1)

        this.face = this.add.image(0 , 0 , "alien")
        Align.center(this.face)
        this.face.setInteractive()
        this.face.on("pointerdown" , this.playAgain , this)


        this.aGrid = new AlignGrid({scene: this, rows: 11, cols: 11})
        // this.aGrid.showNumbers()

        // Add Gamne Over text
        this.gameOverText = this.add.text(0, 0, "Game Over", {color: "#ff0000", fontSize: game.config.width / 10});
        this.gameOverText.setOrigin(.5, .5)
        this.aGrid.placeAtIndex(27, this.gameOverText)

        // Add Play Again text
        this.playAgainText = this.add.text(0, 0, "Play Again", {color: "#fff", fontSize: game.config.width / 10});
        this.playAgainText.setOrigin(.5, .5)
        this.aGrid.placeAtIndex(93, this.playAgainText)

        this.playAgainText.setInteractive()
        this.playAgainText.on("pointerdown" , this.playAgain , this)
    }

    playAgain() {
        this.scene.start("SceneMain")
    }

    update() {}

}