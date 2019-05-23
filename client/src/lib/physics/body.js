const THREE = require('three');
const { circleIntersectsRectangle } = require('./helpers');

class Body {
  static DYNAMIC = 'dynamic';
  static KINEMATIC = 'kinematic';

  type = null;
  position = new THREE.Vector2();
  velocity = new THREE.Vector2();
  acceleration = new THREE.Vector2();
  rotation = 0;
  mass = 0;
  shape = null;

  constructor(type) {
    this.type = type;
  }

  testCollision = body2 => {
    /**
     * attention ici on considere que `this` est une balle, et donc a un shape de type `Circle`,
     * et que `body2` est une poutre, et donc a un shape de type `Rectangle`
     */
    const circle = this;
    const rect = body2;

    const collide = circleIntersectsRectangle(
      circle.position.x,
      circle.position.y,
      circle.shape.radius,
      rect.position.x - rect.shape.width / 2,
      rect.position.y - rect.shape.height / 2,
      rect.shape.width,
      rect.shape.height,
      rect.rotation,
      rect.position.x,
      rect.position.y
    );
    if (collide) {
      console.log('collide!!!');
      // dummy
      this.velocity.x = -this.velocity.x / 2;
      this.velocity.y = -this.velocity.y / 2;
    }
    return collide;
  };
}

module.exports = Body;
