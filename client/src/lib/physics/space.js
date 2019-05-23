const THREE = require('three');
const Body = require('./body');

const truc = new Body(Body.DYNAMIC);
truc.position.y = -0.1;
truc.width = 0.4;
truc.height = 0.02;

class Space {
  bodies = [];
  gravity = new THREE.Vector2(1, -9.81);

  add = body => {
    this.bodies.push(body);
  };

  remove = body => {
    const index = this.bodies.indexOf(body);
    if (~index) {
      this.bodies.splice(index, 1);
    }
  };

  computeForce = body => {
    return new THREE.Vector2(
      body.mass * this.gravity.x,
      body.mass * this.gravity.y
    );
  };

  step = elapsed => {
    // elapsed = 0.0003;
    this.bodies.forEach(body => {
      const force = this.computeForce(body);

      if (body.type === Body.DYNAMIC) {
        body.acceleration.x = (force.x / body.mass) * elapsed;
        body.acceleration.y = (force.y / body.mass) * elapsed;
        body.velocity.x += body.acceleration.x;
        body.velocity.y += body.acceleration.y;
      }

      body.position.x += body.velocity.x * elapsed;
      body.position.y += body.velocity.y * elapsed;

      // wtf
      if (body.collide(truc)) {
        console.log('collide!');
      }
    });
  };
}

module.exports = Space;
