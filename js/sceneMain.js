class SceneMain extends Phaser.Scene {
    constructor() {
        super('SceneMain');
    }

    preload() {
        this.preloadKey("alien");
        this.preloadKey("bullet");
        this.preloadKey("human");
        this.preloadKey("background")
        this.preloadKey("city")


        this.load.spritesheet('exp', 'images/exp.png', {
            frameWidth: 256,
            frameHeight: 256
        });
        this.load.audio("boomSound", "audio/boom.wav");
        this.load.audio("pop", "audio/pop.wav");
        this.load.audio("shoot", "audio/shoot.wav");
    }

    preloadKey(key) {
        this.load.image(key, "images/" + key + ".png");
    }

    create() {
        // Variable Gloabal
        this.score = 0;

        this.background = this.add.image(0, 0, "background")
        this.background.setOrigin(0, 0)
        this.background.displayHeight = game.config.height
        this.background.displayWidth = game.config.width
        // define Object
        this.charGroup = this.physics.add.group();
        this.bulletGroup = this.physics.add.group();

        this.aGrid = new AlignGrid({scene: this, rows: 11, cols: 11})
        // this.aGrid.showNumbers()

        this.addChar()
        
        var randomDelay = Phaser.Math.Between(500, 1000);
        this.time.addEvent({delay: randomDelay, callback: this.addChar, callbackScope: this, loop: true});

        // addBullet
        this.input.on("pointerdown", this.addBullet, this)

        // Add colider
        this.physics.add.collider(this.charGroup, this.bulletGroup, this.addHits, null, this)

        // Add Intro Text
        this.introText = this.add.text(0, 0, "Try To Shoot Every Alien", {color: "#fff", fontSize: game.config.width / 20});
        this.introText.setOrigin(.5, .5)
        this.aGrid.placeAtIndex(49, this.introText)
        this.introText2 = this.add.text(0, 0, "Save The Human To Return Home", {color: "#fff", fontSize: game.config.width / 20});
        this.introText2.setOrigin(.5, .5)
        this.aGrid.placeAtIndex(60, this.introText2)

        // Add score text
        this.scoreText = this.add.text(0, 0, "Score : 0", {color: "#fff", fontSize: game.config.width / 15});
        this.scoreText.setOrigin(.5, .5)
        this.aGrid.placeAtIndex(5, this.scoreText)

        // Add Background and city
        this.city = this.add.image(game.config.width / 2, game.config.height, "city").setOrigin(.5, 1)
        Align.scaleToGameW(this.city, 1)

        // Add explosion annimation
        var frameNames= this.anims.generateFrameNumbers('exp');

        this.anims.create({
            key: 'boom',
            frames: frameNames,
            frameRate: 32,
            repeat: 0
        });

        // Add Sound
        this.pop = this.sound.add("pop");
        this.shoot = this.sound.add("shoot");
        this.boomSound = this.sound.add("boomSound");
    }

    playBoomAnnimation(x,y) {
        this.boomSound.play()
        this.exp = this.add.sprite(x, y, "exp");
        Align.scaleToGameW(this.exp , .25)
        this.exp.play("boom")
        this.exp.on('animationcomplete', function () {this.destroy()});
    }

    updateSCore() {
        this.score++;
        this.scoreText.setText("Score:" + this.score);
    }

    addHits(char, bullet) {
        if (char.isHuman) {
            this.scene.start("SceneOver")
        }else {
            this.updateSCore()
            this.playBoomAnnimation(char.x , char.y)
        }
        char.destroy()
        bullet.destroy()
    }

    addChar() {
        var rand = Phaser.Math.Between(0, 100)
        if (rand > 50) {
            var char = this.physics.add.sprite(0, 0, "alien")
            char.isHuman = false;
        } else {
            var char = this.physics.add.sprite(0, 0, "human")
            char.isHuman = true;
        }

        this.aGrid.placeAtIndex(21, char)
        Align.scaleToGameW(char, .1)

        this.charGroup.add(char)
        char.setVelocityX(-200)
    }

    addBullet(pointer) {
        this.introText.destroy()
        this.introText2.destroy()
        
        this.shoot.play()
        var bullet = this.physics.add.sprite(pointer.x, game.config.height * .9, "bullet")
        Align.scaleToGameW(bullet, .025)
        this.bulletGroup.add(bullet)
        bullet.setVelocityY(-500)
    }

    update() {
        // console.log("update");
        this.charGroup.children.iterate(function (child) {
            if (child) {

                if (child.x < 0) {
                    child.x = 10
                    child.setVelocityX(200)
                    child.y += child.displayHeight
                }

                if (child.x > game.config.width) {
                    child.x -= 10
                    child.setVelocityX(-200)
                    child.y += child.displayHeight
                }
                if (child.y > game.config.height*.9) {
                    if(child.isHuman) {
                        this.updateSCore()
                        this.pop.play()
                    }else {
                        // Game Over
                        this.scene.start("SceneOver")
                    }
                    child.destroy()
                }
            }

        }.bind(this));
    }
}
