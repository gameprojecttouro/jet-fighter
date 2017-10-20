// Initialize game
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var player;
var bullets;

var cursors;
var fireButton;

var bulletTime = 0;
var bullet;

var alien;
var starfield;

var score = 0;
var scoreString = '';
var scoreText;

var lives;
var stateText;
var liveText;
var live = 0;

function preload() {
	//game.load.baseURL = 'http://examples.phaser.io/assets/';
    game.load.crossOrigin = 'anonymous';


game.stage.backgroundColor = "#697e96";
game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
 game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.stage.disableVisibilityChange = true;
    game.load.image('ship', 'assets/PNG/UI/playerLife1_orange.png');
    game.load.image('bullet', 'assets/PNG/Lasers/laserBlue01.png');
    game.load.image('alien', 'http://examples.phaser.io/assets/sprites/space-baddie.png');
// parallax backgroud
    game.load.image('starfield', 'assets/moving-through-stars.png');
  game.load.spritesheet('kaboom', 'http://examples.phaser.io/assets/games/invaders/explode.png', 128, 128);

}

function create() {
//  We only want world bounds on the left and right
        game.physics.setBoundsToWorld();
 //  The scrolling starfield background
    starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

	bullets = game.add.physicsGroup();
    bullets.createMultiple(32, 'bullet', false);
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    player = game.add.sprite(200, 550, 'ship');
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;

    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

     aliens = game.add.group();
    aliens.enableBody = true;
    aliens.physicsBodyType = Phaser.Physics.ARCADE;

    for (var y = 0; y < 4; y++)
    {
        for (var x = 0; x < 10; x++)
        {
            alien = aliens.create(200 + x * 48, y * 50, 'alien');
            alien.name = 'alien' + x.toString() + y.toString();
            alien.checkWorldBounds = true;
            alien.events.onOutOfBounds.add(alienOut, this);
            alien.body.velocity.y = 50 + Math.random() * 200;
        }
    }


  //  An explosion pool
    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(setupInvader, this);

     //  The score
    scoreString = 'Score : ';
    scoreText = game.add.text(10, 10, scoreString + score, { font: '34px Arial', fill: '#fff' });

      //  Lives
    lives = game.add.group();
    game.add.text(game.world.width - 140, 10, 'Lives : ' + liveText, { font: '34px Arial', fill: '#fff' });
}

function update () {
    //  Scroll the background
    starfield.tilePosition.y += 2;
    // collision of bullter and alien
	game.physics.arcade.overlap(bullets, aliens, killAlien, null, this);
	game.physics.arcade.overlap(player, aliens, shakePlayer, null, this);

    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -600;
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 600;
    }

    if (fireButton.isDown)
    {
        fireBullet();
    }
}

function setupInvader (invader) {
    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('kaboom');
}


function killAlien(bullet1, alien1){
//console.log("kill");
           alien1.kill();   
           score += 100;
        scoreText.text = scoreString + score;
            // coin.revive();

             var explosion = explosions.getFirstExists(false);
    explosion.reset(alien1.body.x, alien1.body.y);
    explosion.play('kaboom', 30, false, true);
}

function shakePlayer(player, aliens){
	live -= 1;
	console.log(live);
liveText = 'Lives : ' + live;
}

function fireBullet () {

    if (game.time.time > bulletTime)
    {
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            bullet.reset(player.x + 17, player.y - 12);
            bullet.body.velocity.y = -600;
            bulletTime = game.time.time + 100;
        }
    }

}

function alienOut(alien) {
    //  Move the alien to the top of the screen again
    alien.reset(alien.x, 0);
    //  And give it a new random velocity
    alien.body.velocity.y = 50 + Math.random() * 200;

}

function render () {

}