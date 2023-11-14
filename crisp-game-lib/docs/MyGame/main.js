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
  PLAYER_DEFAULT_SIZE: 10,
  PLAYER_HEIGHT: 3,
  SCREEN_SCROLL_SPEED: 0.1,
  SCREEN_SCROLL_BOUND: 90,
  SCREEN_EDGE_SCROLL_AMOUNT: 40,
  GROUND_LEVEL: 90,
  CEILING_LEVEL: 40,
  SPIKE_DEFAULT_SPEED: 0.5
}

options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  isPlayingBgm: true,
  isReplayEnabled: true,
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
  * goingUp: boolean
  * }} Spike
  */
  
  /**
  * @type  { Spike [] }
  */
 let spikes = [];

function update() {
  // Init
  if (!ticks) {
    player = {
      pos: vec(G.WIDTH * 0.2, G.HEIGHT * 0.9),
      size: G.PLAYER_DEFAULT_SIZE
    }

    spikes.push({
      pos: vec(20, G.CEILING_LEVEL),
      speed: 0.5,
      goingUp: false
    });
    spikes.push({
      pos: vec(60, G.CEILING_LEVEL),
      speed: 0.5,
      goingUp: false
    });
    spikes.push({
      pos: vec(100, G.CEILING_LEVEL),
      speed: 0.5,
      goingUp: false
    });
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
  } else if (player.size > G.PLAYER_DEFAULT_SIZE) { // Retract rear
    player.size -= G.PLAYER_SHRINK_SPEED;
    player.size = clamp(player.size, G.PLAYER_DEFAULT_SIZE, 100);
    player.pos.x += G.PLAYER_GROW_SPEED / 2;
  }

  // Scroll screen if player gets far enough
  if(player.pos.x + (player.size / 2) > G.SCREEN_SCROLL_BOUND) {
    scrollScreen(G.SCREEN_EDGE_SCROLL_AMOUNT);
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
      if(spike.pos.y <= G.CEILING_LEVEL) {
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
}

function checkCollision() {
  const isCollidingWithSpike = box(player.pos, player.size, G.PLAYER_HEIGHT).isColliding.char.a;
  if(isCollidingWithSpike) {
    end();
  }
}
