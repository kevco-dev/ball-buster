let emitter;
let timerText;
let timerEvent;
let timeLimit = 30;
let timerStarted = false;
let score = 0;
let currentColor = 0xfa328c;
let scoreText;

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        const canvas = this.sys.game.canvas;
        canvas.style.margin = "auto";
        canvas.style.display = "block";
        canvas.style.border = "2px solid rgb(250,50,140)";
        canvas.style.borderRadius = "1rem"
        this.cameras.main.setBackgroundColor('rgb(0,0,14)');
        this.physics.world.setBoundsCollision(true, true, true, true);
        const ball = this.add.circle(400, 300, 25, 0xfa238c);
        this.physics.add.existing(ball);
        ball.body.setBounce(1);
        ball.body.setCollideWorldBounds(true);
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(0, 0, 6);
        graphics.generateTexture('particle_circle', 10, 10);
        ball.setInteractive();
        const that = this;
        ball.on('pointerdown', function () {
            timerStarted = true;
            score = score + 1;
            timeLimit = timeLimit + 1;
            const randomVelocityX = Phaser.Math.Between(-800, 800);
            const randomVelocityY = Phaser.Math.Between(-800, 800);
            ball.body.setVelocity(randomVelocityX, randomVelocityY);
            const randomColor = Phaser.Display.Color.RandomRGB();
            const color = Phaser.Display.Color.GetColor(randomColor.r, randomColor.g, randomColor.b);
            emitter = that.add.particles('particle_circle').createEmitter({
                on: false,
                x: 400,
                y: 300,
                speed: { min: -800, max: 800 },
                angle: { min: 0, max: 360 },
                scale: { start: 1, end: 0 },
                tint: { start: currentColor, end: currentColor },
                blendMode: 'ADD',
                lifespan: 1000,
                gravityY: 800
            });
            ball.fillColor = color;
            emitter.explode(50, ball.x, ball.y);
            currentColor = color;
        });
        timerText = this.add.text(740, 20, `Time: ${timeLimit}`, { font: "24px Arial", fill: "#ffffff" }).setOrigin(0.5);
        timerEvent = this.time.addEvent({
            delay: 1000,
            callback: updateTimer,
            callbackScope: this,
            loop: true
        });
        scoreText = this.add.text(60, 20, `Score: ${score}`, { font: "24px Arial", fill: "#ffffff" }).setOrigin(0.5);
    }
}

class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create() {
        const gameOverText = this.add.text(400, 250, 'Game Over', { font: "48px Arial", fill: "#ffffff" }).setOrigin(0.5);
        const currentScore = this.add.text(400, 300, `${score} Balls Busted!`, { font: "48px Arial", fill: "#ffffff" }).setOrigin(0.5);
        const restartText = this.add.text(400, 350, 'Click to Try Again', { font: "24px Arial", fill: "#ffffff" }).setOrigin(0.5);
        restartText.setInteractive();
        restartText.on('pointerdown', () => {
            score = 0;
            this.scene.start('GameScene');
        });
    }
}

function updateTimer() {
    if (timerStarted) {
        timeLimit--;
        timerText.setText(`Time: ${timeLimit}`);
        scoreText.setText(`Score: ${score}`);
        if (timeLimit === 0) {
            timerStarted = false;
            timeLimit = 30;
            currentColor = 0xff0000;
            this.scene.start('GameOverScene');
        }
    }
}

const game = new Phaser.Game({
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    scene: [GameScene, GameOverScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    }
});