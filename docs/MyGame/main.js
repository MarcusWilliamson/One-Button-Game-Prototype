title = "Worm";

description = `
  Press to move
  forward
`;

characters = [
`
llll
llll
lll
lll
ll
l
`
];

const G = {
	WIDTH: 100,
	HEIGHT: 100,
  PLAYER_GROW_SPEED: 1,
  PLAYER_SHRINK_SPEED: 1,
  PLAYER_DEFAULT_SIZE: 12,
  PLAYER_HEIGHT: 3,
  SCREEN_SCROLL_SPEED: 0.1,
  SCREEN_SCROLL_BOUND: 80,
  SCREEN_EDGE_SCROLL_AMOUNT: 50,
  GROUND_LEVEL: 90,
  CEILING_LEVEL: 20,
  SPIKE_STARTING_LEVEL: 60,
  SPIKE_DEFAULT_SPEED: 0.5,
  SPACE_BETWEEN_FORMATIONS: 30
}

options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  isPlayingBgm: true,
  isReplayEnabled: false,
  seed: 16,
};

/**
 * @typedef {{
* pos: Vector,
* size: number,
* }} Player
*/

/**
* @type { Player }
*/
let player;

/**
* @typedef {{
  * pos: Vector,
  * speed: number,
  * goingUp: boolean,
  * startLevel: number
  * }} Spike
  */
  
  /**
  * @type  { Spike [] }
  */
let spikes = [];
let currentStreak = 0;
let nextSpikePos = 40;
let numSpikeTypes = 4;

function update() {
  // Init
  if (!ticks) {
    player = {
      pos: vec(G.WIDTH * 0.2, G.HEIGHT * 0.9),
      size: G.PLAYER_DEFAULT_SIZE
    }
    // console.log("restart");
    nextSpikePos = 40;
  }

  // Generate spikes
  while (nextSpikePos < 200) {
    let formationType = Math.floor(Math.random() * numSpikeTypes * 2);
    if (formationType > numSpikeTypes - 1) {  // Make single spike
      createSpike(nextSpikePos);
      nextSpikePos += G.SPACE_BETWEEN_FORMATIONS;
    } else {  // Make spike formation
      nextSpikePos = createFormation(nextSpikePos, formationType) + G.SPACE_BETWEEN_FORMATIONS;
    }
  }
  
  // Draw player and spikes
  color("black");
  box(player.pos, player.size, G.PLAYER_HEIGHT);
  spikes.forEach(spike => {
    char('a', spike.pos);
    box(spike.pos.x, (spike.pos.y + G.CEILING_LEVEL) / 2, 4, (spike.pos.y - G.CEILING_LEVEL));
  });

  // Check collision
  checkCollision();

  // Move player
  if(input.isPressed) { // Extend front
    player.size += G.PLAYER_GROW_SPEED;
    player.pos.x += G.PLAYER_GROW_SPEED / 2;
    addScore(G.PLAYER_GROW_SPEED / 2);
    // currentStreak += player.size * (G.PLAYER_GROW_SPEED / 2) * 0.2; // Size * distance traveled * 0.2
  } else if (player.size > G.PLAYER_DEFAULT_SIZE) { // Retract rear
    /* if (currentStreak > 0) {
      addScore(currentStreak);
      currentStreak = 0;
    } */
    player.size -= G.PLAYER_SHRINK_SPEED;
    player.size = clamp(player.size, G.PLAYER_DEFAULT_SIZE, 100);
    player.pos.x += G.PLAYER_GROW_SPEED / 2;
  }

  // Scroll screen if player gets far enough
  if(player.pos.x + (player.size / 2) > G.SCREEN_SCROLL_BOUND) {
    scrollScreen(G.SCREEN_EDGE_SCROLL_AMOUNT);
  }

  // Remove spikes if left of screen
  if(spikes.length != 0 && spikes[0].pos.x < 0) {
    spikes.shift();
  }

  // Move spikes up and down
  spikes.forEach(spike => {
    if(!spike.goingUp) { // Going down
      if(spike.pos.y >= G.GROUND_LEVEL) {
        spike.goingUp = true;
      } else {
        spike.pos.y += spike.speed;
      }
    } else { // Going up
      if(spike.pos.y <= spike.startLevel) {
        spike.goingUp = false;
      } else {
        spike.pos.y -= spike.speed;
      }
    }
  });

}

function scrollScreen(amount=G.SCREEN_SCROLL_SPEED) {
  player.pos.x -= amount;
  spikes.forEach(spike => spike.pos.x -= amount);
  nextSpikePos -= amount;
}

function checkCollision() {
  const isCollidingWithSpike = box(player.pos, player.size, G.PLAYER_HEIGHT).isColliding.char.a;
  if(isCollidingWithSpike) {
    gameOver();
  }
}

function createSpike(x, y=G.SPIKE_STARTING_LEVEL, startOffset=0, speed=G.SPIKE_DEFAULT_SPEED, goingUp=false) {
  spikes.push({
    pos: vec(x, y),
    speed: speed,
    startLevel: G.SPIKE_STARTING_LEVEL + startOffset,
    goingUp: goingUp
  });
  // console.log(y + " " + (G.SPIKE_STARTING_LEVEL + startOffset));
}

function createFormation(posX, formationNumber) {
  // console.log("Creating formation " + formationNumber + " at x: " + posX);
  switch(formationNumber) {
    case 0:  // Alternating rows of 3
      createSpike(posX, G.SPIKE_STARTING_LEVEL - 10, -10);
      createSpike(posX + 10, G.SPIKE_STARTING_LEVEL - 10, -10);
      createSpike(posX + 20, G.SPIKE_STARTING_LEVEL - 10, -10);
      createSpike(posX + 30, G.GROUND_LEVEL, -10);
      createSpike(posX + 40, G.GROUND_LEVEL, -10);
      createSpike(posX + 50, G.GROUND_LEVEL, -10);
      return posX + 50
    case 1: // Alternating rows of 3, closer formation
      createSpike(posX, G.SPIKE_STARTING_LEVEL - 10, -10);
      createSpike(posX + 5, G.SPIKE_STARTING_LEVEL - 10, -10);
      createSpike(posX + 10, G.SPIKE_STARTING_LEVEL - 10, -10);
      createSpike(posX + 15, G.GROUND_LEVEL, -10);
      createSpike(posX + 20, G.GROUND_LEVEL, -10);
      createSpike(posX + 25, G.GROUND_LEVEL, -10);
      return posX + 25;
    case 2: // Chasing spikes
      createSpike(posX, G.SPIKE_STARTING_LEVEL + 25);
      createSpike(posX + 5, G.SPIKE_STARTING_LEVEL + 20);
      createSpike(posX + 10, G.SPIKE_STARTING_LEVEL + 15);
      createSpike(posX + 15, G.SPIKE_STARTING_LEVEL + 10);
      createSpike(posX + 20, G.SPIKE_STARTING_LEVEL + 5);
      createSpike(posX + 25);
      return posX + 25;
    case 3: // Chasing spikes, wider formation
      createSpike(posX, G.SPIKE_STARTING_LEVEL + 10, -15,);
      createSpike(posX + 10, G.SPIKE_STARTING_LEVEL + 5, -15);
      createSpike(posX + 20, G.SPIKE_STARTING_LEVEL, -15);
      createSpike(posX + 30, G.SPIKE_STARTING_LEVEL - 5, -15);
      createSpike(posX + 40, G.SPIKE_STARTING_LEVEL - 10, -15);
      createSpike(posX + 50, G.SPIKE_STARTING_LEVEL - 15, -15);
      return posX + 50;
    default:
      console.log("This shouldn't happen");
      break;
  }
}

function gameOver() {
  end()
  spikes = []
}