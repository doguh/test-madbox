const THREE = require('three');
const { clamp } = require('./helpers');

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

    const rotatedCircle = new THREE.Vector2(
      circle.position.x,
      circle.position.y
    ).rotateAround(rect.position, -rect.rotation);

    const aabb = {
      minX: rect.position.x - rect.shape.width / 2,
      minY: rect.position.y - rect.shape.height / 2,
      maxX: rect.position.x + rect.shape.width / 2,
      maxY: rect.position.y + rect.shape.height / 2,
    };

    const nearestX = clamp(aabb.minX, rotatedCircle.x, aabb.maxX);
    const nearestY = clamp(aabb.minY, rotatedCircle.y, aabb.maxY);

    const deltaX = rotatedCircle.x - nearestX;
    const deltaY = rotatedCircle.y - nearestY;
    const collide =
      deltaX * deltaX + deltaY * deltaY <
      circle.shape.radius * circle.shape.radius;

    if (collide) {
      console.log('collide!!');
      const dist = new THREE.Vector2(
        rotatedCircle.x - nearestX,
        rotatedCircle.y - nearestY
      );

      const rotatedVelocity = new THREE.Vector2(
        circle.velocity.x,
        circle.velocity.y
      ).rotateAround(new THREE.Vector2(0, 0), -rect.rotation);

      // if circle goes towards the rectangle
      if (rotatedVelocity.dot(dist) < 0) {
        var dnormal = new THREE.Vector2(-dist.y, dist.x);
        var normal_angle = Math.atan2(dnormal.y, dnormal.x);
        var incoming_angle = Math.atan2(rotatedVelocity.y, rotatedVelocity.x);
        var theta = normal_angle - incoming_angle;
        rotatedVelocity.rotateAround(new THREE.Vector2(0, 0), 2 * theta);

        // apply new velocity
        circle.velocity = rotatedVelocity
          .rotateAround(rect.position, rect.rotation)
          .multiplyScalar(0.75);
      }

      // resolve circle position
      // const penetrationDepth =
      //   -circle.shape.radius + Math.sqrt(dist.x * dist.x + dist.y * dist.y);
      // const penetrationVector = dist
      //   .normalize()
      //   .multiplyScalar(penetrationDepth);
      // rotatedCircle.sub(penetrationVector);
      // rotatedCircle.rotateAround(rect.position, rect.rotation);
      // circle.position = rotatedCircle;
    }
  };
}

module.exports = Body;
