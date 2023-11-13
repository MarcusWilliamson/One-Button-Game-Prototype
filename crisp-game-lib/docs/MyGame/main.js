title = "Worm";

description = `
  Press to move
  forward
`;

characters = [

];

const G = {
	WIDTH: 100,
	HEIGHT: 100
}

options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 16,
};



let horizontalVelocity = 0;
let verticalLevel = 0;
let pin;
let player;

function update() {
  if (!ticks) {
    
  }

  player = {
    pos: vec(G.WIDTH * 0.5, G.HEIGHT * 0.5),
    angle: horizontalVelocity / 90,
  };
  player.pos = vec(G.WIDTH * 0.5 + horizontalVelocity, (G.HEIGHT - 60) + verticalLevel);
  char("a", player.pos);
  

  if (input.isPressed) {
    player.angle += player.angle == 90 ? 1 : 0;;
    horizontalVelocity += 1
  } else {
    player.angle -=  player.angle == -90 ? 1: 0;
    horizontalVelocity -= 1
  }
  
  verticalLevel -= 0.1
}
