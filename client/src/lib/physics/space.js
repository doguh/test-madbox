const THREE = require('three');
const Body = require('./body');

class Space {
  bodies = [];
  gravity = new THREE.Vector2(0, -9.81);

  add = body => {
    this.bodies.push(body);
  };

  remove = body => {
    const index = this.bodies.indexOf(body);
    if (~index) {
      this.bodies.splice(index, 1);
    } else {
      console.error('space: body not found for remove');
    }
  };

  computeForce = body => {
    return new THREE.Vector2(
      body.mass * this.gravity.x,
      body.mass * this.gravity.y
    );
  };

  step = elapsed => {
    const times = 10;
    const subelapsed = elapsed / times;
    for (let i = 0; i < times; i++) {
      this.substep(subelapsed);
    }
  };

  substep = elapsed => {
    this.bodies.forEach(body => {
      const force = this.computeForce(body);

      if (body.type === Body.DYNAMIC) {
        body.acceleration.x = (force.x / body.mass) * elapsed;
        body.acceleration.y = (force.y / body.mass) * elapsed;
        body.velocity.x += body.acceleration.x;
        body.velocity.y += body.acceleration.y;

        this.bodies.forEach(body2 => {
          if (body !== body2) body.testCollision(body2);
        });
      }

      body.position.x += body.velocity.x * elapsed;
      body.position.y += body.velocity.y * elapsed;
    });
  };
}

module.exports = Space;
