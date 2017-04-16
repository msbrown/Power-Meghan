//asteroid clone (core mechanics only)
// arrow keys to rotate and thrust + s to shoot

// Asteroids are not resetting on game over


var bullets;
var asteroids;
var ship;
var shipImage, bulletImage, particleImage;
var MARGIN = 20;
var score;
var highscore;
var bounceSound;
var thrustSound;
var fireSound;
var explosionSound;
var winSound;
var lives;
var gameState;
var startImg;
var loseImg;


function preload(){
    bounceSound=loadSound("assets/bounceloselife.ogg");
    thrustSound=loadSound("assets/SpaceShip_Engine_Medium_Loop_00.ogg");
    fireSound=loadSound("assets/Laser_07.ogg");
    explosionSound=loadSound("assets/explosion.ogg");

    bulletImage = loadImage("assets/asteroids_bullet.png");
    shipImage = loadImage("assets/lship0001.png");
    particleImage = loadImage("assets/asteroids_particle.png");

    startSound = loadSound('assets/start.mp3');
    startFont = loadFont('assets/PT_Sans-Web-Regular.ttf');
    gameFont = loadFont('assets/PressStart2P-Regular.ttf');

    winSound = loadSound('assets/Jingle_Win_00.ogg');

}

function setup() {
  createCanvas(800,600);
  score = 0;
  highscore = 0;
  gameState = 0;
  fill('FF6438');

  startImg = createImg("assets/happy.png");
  startImg.position(140,120);
    textFont(startFont);
    //Instruction Text
    instructP = createP('<b>Help Meghan banish the law books.</b> <br>Use the left and right arrows to rotate. <br>Up arrow to thrust. And the "s" key to shoot the books.');
    instructP.position(80, 20);

    // create Play Game button
    startButton = createButton('Play Game');
    startButton.position(80, 120);
    startButton.mousePressed(startGame);

    //Create lose image
    loseImg = createImg("assets/angrylose.png");
    loseImg.position(160,140);

    //Create win image
    winImg = createImg("assets/win.png");
    winImg.position(140,120);
}

function draw() {
  background('#3786CC');
  fill(255);
  textFont(startFont);
  text("Controls: Left or Right Arrow Keys to Rotate, Up Arrow for Thrust, S key to shoot", 80, 20);

    if (gameState === 1){

          // hide start button
          startButton.hide();
          //hide beginning text
          instructP.hide();
          startImg.hide();
          loseImg.hide();

          // display score & lives
          fill('#000066'); //dark blue
          noStroke();
          textSize(14);
          textFont(gameFont);
          text("Score: " + score, 80, 50);
          text("Lives: " + lives, 260, 50);
          text("High Score: " + highscore, 460, 50);

          for(var i=0; i<allSprites.length; i++) {
          var s = allSprites[i];
          if(s.position.x<-MARGIN) s.position.x = width+MARGIN;
          if(s.position.x>width+MARGIN) s.position.x = -MARGIN;
          if(s.position.y<-MARGIN) s.position.y = height+MARGIN;
          if(s.position.y>height+MARGIN) s.position.y = -MARGIN;
          }

          //Collision detection for bullets and asteroids
          asteroids.overlap(bullets, asteroidHit);
          //Collision detection for player/ship and asteroid
          ship.bounce(asteroids, loselife);

          //Player movement/mechanics including creating bullets
          if(keyDown(LEFT_ARROW))
            ship.rotation -= 4;
          if(keyDown(RIGHT_ARROW))
            ship.rotation += 4;
          if(keyDown(UP_ARROW))
            {
            ship.addSpeed(0.2, ship.rotation);
            ship.changeAnimation("thrust");
            //thrustSound.play();
            }
          else
            ship.changeAnimation("normal");
          //Creation of bullets into array
          if(keyWentDown("s"))
            {
            var bullet;
            bullet= createSprite(ship.position.x + 55 * cos(0.0174533*(ship.rotation)) , ship.position.y + 55 * sin(0.0174533*(ship.rotation)) );
            bullet.addImage(bulletImage);
            //adding shooting sound as well
            fireSound.play();
            bullet.setSpeed(10+ship.getSpeed(), ship.rotation);
            bullet.life = 15;
            bullets.add(bullet);
            }

        //Detect if won stage1 and some temporary stuff for now
        if(score === 21){
            gamestate = 2;
            wonStage1();
            background('#FF8C00');
            fill('#000066');
            textSize(40);
            textFont(startFont);
            text("Good job! You won!", 80, 80);
            winImg.show();
            //winSound.play();
            //NEED FUDN MUSIC, FUN GRAPHIC AND NEW BOTTON -
            //Stage 2: More asteroids (additional type and graphic?) and faster
        }

          //Draw the player, asteroids, bullets
          drawSprites();

  } else if (gameState === 0) {
      loseImg.hide();
      winImg.hide();

  }
    else if (gameState === 99){
        fill("#000000");
        textSize("30");
        text("Oh no, Game Over!", 80, 60);
        textSize("22");
        text("Score: " + score, 80, 85);
        text("High Score: " + highscore, 80, 110);
        //loseImg.show();
    }
}

function loselife() {
  //sad sound
  bounceSound.play();
  //Quick background color change
  background('FF6438');
  // ship.changeAnimation("bounce");
  //ship.animation.goToFrame(0);

  //lives--;
  if (lives > 1) {
    lives--;
  }
  else {
      //Change state
      gameState = 99;
      gameOver();
  }

}

function startGame() {
    score = 0;
    lives = 3;
  // change gameState variable
  gameState = 1;
  // play starting sound
  startSound.play();
  //Ship creation
    ship = createSprite(width/2, height/2);
    ship.maxSpeed = 6;
    ship.friction = 0.98;
    ship.setCollider("rectangle", 0,0, 50, 30);

    ship.addImage("normal", shipImage);
    ship.addAnimation("thrust", "assets/lship0002.png", "assets/lship0006.png");
    ship.addAnimation("bounce", "assets/lshipbounce0.png", "assets/lshipbounce1.png");

  //Create array for asteroids & bullets
    asteroids = new Group();
    bullets = new Group();

    //Create asteroids
    //Difficulty: number of initial asteroids on screen
    // (3 spawns 6 spawns 12 = score of 21) & speed in createA function
    for(var i = 0; i<3; i++) {
      var ang = random(360);
      var px = width/2 + 1000 * cos(radians(ang));
      var py = height/2+ 1000 * sin(radians(ang));
      createAsteroid(3, px, py);
    }
    // console.log("game state = " + gameState);
    // console.log("lenght of asteroids array in start: " + asteroids.length);
}

function gameOver(){
    console.log("Gameover function. Score= " + score + " high= " + highscore);
    console.log("game state = " + gameState);
    if (score>highscore){highscore = score;}
    startButton.show();
    loseImg.show();

    asteroids.removeSprites();
    // asteroids.clear();
    ship.remove();
    console.log("length of asteroids array game over: " + asteroids.length);
}

function wonStage1(){
    //console.log("won stage 1 so that's cool. Need to transition to second stage");
    if (score>highscore){highscore = score;}
    asteroids.removeSprites();
    ship.remove();

}

function createAsteroid(type, x, y) {
  var a = createSprite(x, y);
  var img  = loadImage("assets/asteroid"+floor(random(0,3))+".png");
  a.addImage(img);
  //Difficulty as well in speed of asteroid increase as get smaller (set to 2.5 for harder screen)
  a.setSpeed(2.0-(type/2), random(360));
  a.rotationSpeed = 0.5;
  //a.debug = true;
  a.type = type;

  if(type == 2)      //medium asteroid (after big is hit)
    a.scale = 0.6;
  if(type == 1)      //smaller asteroid (after medium is hit)
    a.scale = 0.3;

  a.mass = 2+a.scale;
  a.setCollider("circle", 0, 0, 50);
  asteroids.add(a);
  return a;
}

function asteroidHit(asteroid, bullet) {
var newType = asteroid.type-1;

//Creates 2 'smaller' asteroids in same place as larger asteroid was hit
if(newType>0) {
  createAsteroid(newType, asteroid.position.x, asteroid.position.y);
  createAsteroid(newType, asteroid.position.x, asteroid.position.y);
  }

//Creates explosion animation when asteroid & bullet collide
for(var i=0; i<10; i++) {
  var p = createSprite(bullet.position.x, bullet.position.y);
  p.addImage(particleImage);
  p.setSpeed(random(3,5), random(360));
  p.friction = 0.95;
  p.life = 15;
  explosionSound.play();
  }

score++;
  //console.log("Counter of hits: ", score);

bullet.remove();
asteroid.remove();
}
