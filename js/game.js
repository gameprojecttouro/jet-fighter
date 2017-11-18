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

var enemyBullet;
var firingTimer = 0;
var stateText;
var livingEnemies = [];

var BULLET_SPEED = 800;

function preload() {
	//game.load.baseURL = 'http://examples.phaser.io/assets/';
    game.load.crossOrigin = 'anonymous';

		game.stage.backgroundColor = "#697e96";
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.stage.disableVisibilityChange = true;
		game.load.image('ship', 'assets/fighters2.png');
   // game.load.image('bullet', 'assets/PNG/Lasers/laserBlue01.png');
   game.load.image('bullet', 'assets/bullet0.png');
   // game.load.image('alien', 'http://examples.phaser.io/assets/sprites/space-baddie.png');
   game.load.image('alien', 'assets/enemy1.png');
// parallax backgroud
    game.load.image('starfield', 'assets/bg1.png');
game.load.spritesheet('kaboom_old', 'http://examples.phaser.io/assets/games/invaders/explode.png', 128, 128);
  game.load.spritesheet('kaboom', 'assets/explosionBig.png',111,109);
//game.load.image('alien', 'assets/ship3.png');
   game.load.image('enemyBullet', 'assets/icons8-Missile-16.png');
   
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
	
	 // The enemy's bullets
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(30, 'enemyBullet');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 1);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);

    player = game.add.sprite(200, 550, 'ship');
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
	
	// add the game controls
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	// create an alien group
     aliens = game.add.group();
    aliens.enableBody = true;
    aliens.physicsBodyType = Phaser.Physics.ARCADE;


	// call the function to create aliens
    createAliens ();

	 //  Lives
    lives = game.add.group();
    game.add.text(game.world.width - 100, 10, 'LIVES : ', { font: '30px Arial', fill: '#fff' });

    //  Text
    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#000' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

	
	// create lives for player
    for (var i = 0; i < 3; i++) 
    {
        var ship = lives.create(game.world.width - 80 + (30 * i), 70, 'ship');
        ship.anchor.setTo(0.5, 0.5);
        ship.angle = 90;
        ship.alpha = 0.5;
		ship.width = 60;
		ship.height = 40;

    }
	

    //  An explosion pool
    explosions = game.add.group();
    explosions.createMultiple(20, 'kaboom');
    explosions.forEach(setupInvader, this);
	
	//  An explosion pool
    explosionsOld = game.add.group();
    explosionsOld.createMultiple(20, 'kaboom_old');
    explosionsOld.forEach(setupInvader, this);

     //  The score
    scoreString = 'Score : ';
    scoreText = game.add.text(10, 10, scoreString + score, { font: '34px Arial', fill: '#000' });


}

function createAliens () {

   for (var y = 0; y < 4; y++)
    {
        for (var x = 0; x < 10; x++)
        {
            var alien = aliens.create( x * 48, y * 50, 'alien');
			
			if(y==1)
			alien.anchor.setTo(0.5, 0.5);
		else
			alien.anchor.setTo(0, 0);
		
           // alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
           // alien.play('fly');
            alien.body.moves = false;
            alien.name = 'alien' + x.toString() + y.toString();
            alien.checkWorldBounds = true;
            alien.events.onOutOfBounds.add(alienOut, this);
         //   alien.body.velocity.y = 50 + Math.random() * 200;

        }
    }

    aliens.x = 100;
    aliens.y = 80;

    //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
    var tween = game.add.tween(aliens).to( { x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

    //  When the tween loops it calls descend
  //  tween.onLoop.add(descend, this);
}

function descend() {

  //  aliens.y += 10;

}

function update () {
    //  Scroll the background
    starfield.tilePosition.y += 2;
    // collision of bullter and alien
	if (player.alive)
    {
	

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
	
	if (game.time.now > firingTimer)
        {
            enemyFires();
        }
		
		game.physics.arcade.overlap(bullets, aliens, killAlien, null, this);
	//game.physics.arcade.overlap(player, aliens, shakePlayer, null, this);
	game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);
	}
}

function setupInvader (invader) {
    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('kaboom');
	//invader.animations.add('kaboom_old');
}




function killAlien(bullet1, alien1){
//console.log("kill");
			bullet1.kill();
           alien1.kill();   
          
		  score += 10;
        scoreText.text = scoreString + score;
            // coin.revive();

             var explosion = explosions.getFirstExists(false);
    explosion.reset(alien1.body.x, alien1.body.y);
    explosion.play('kaboom', 26, false, true);
	
	if (aliens.countLiving() === 0)
    {
        score += 1000;
        scoreText.text = scoreString + score;

        enemyBullets.callAll('kill',this);
        stateText.text = " You Won, \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }
	
}

function enemyHitsPlayer (player,bullet) {
    
    bullet.kill();

    live = lives.getFirstAlive();

    if (live)
    {
        live.kill();
    }

    //  And create an explosion :)
    var explosion = explosionsOld.getFirstExists(false);
    explosion.reset(player.body.x, player.body.y);
    explosion.play('kaboom', 30, false, true);

    // When the player dies
    if (lives.countLiving() < 1)
    {
        player.kill();
        enemyBullets.callAll('kill');

        stateText.text=" GAME OVER \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }

}

function enemyFires () {

    //  Grab the first bullet we can from the pool
    enemyBullet = enemyBullets.getFirstExists(false);

    livingEnemies.length=0;

    aliens.forEachAlive(function(alien){

        // put every living enemy in an array
        livingEnemies.push(alien);
    });
//game.physics.arcade.velocityFromRotation(player.rotation, 400, enemyBullet.body.velocity);
   enemyBullet.body.velocity.x = Math.cos(enemyBullet.rotation) * this.BULLET_SPEED;
    enemyBullet.body.velocity.y = Math.sin(enemyBullet.rotation) * this.BULLET_SPEED;

    if (enemyBullet && livingEnemies.length > 0)
    {
        
        var random=game.rnd.integerInRange(0,livingEnemies.length-1);

        // randomly select one of them
        var shooter=livingEnemies[random];
        // And fire the bullet from this enemy
        enemyBullet.reset(shooter.body.x, shooter.body.y);

        game.physics.arcade.moveToObject(enemyBullet,player,100);
        firingTimer = game.time.now + 2000;
    }

}


function fireBullet () {

    if (game.time.time > bulletTime)
    {
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            bullet.reset(player.x + 40, player.y - 12);
            bullet.body.velocity.y = -600;
            bulletTime = game.time.time + 100;
        }
    }

}

function restart () {

    //  A new level starts
    
    //resets the life count
    lives.callAll('revive');
    //  And brings the aliens back from the dead :)
    aliens.removeAll();
    createAliens();

    //revives the player
    player.revive();
    //hides the text
    stateText.visible = false;

}

function alienOut(alien) {
    //  Move the alien to the top of the screen again
    alien.reset(alien.x, 0);
    //  And give it a new random velocity
    alien.body.velocity.y = 50 + Math.random() * 200;

}

function render () {

}