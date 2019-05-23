const THREE = require('three');
const findDistance = require('./pythagore');

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

    const unrotatedCircleX = circle.position.x;
    const unrotatedCircleY = circle.position.y;

    const aabb = {
      x: rect.position.x - rect.shape.width / 2,
      y: rect.position.y - rect.shape.height / 2,
      width: rect.shape.width,
      height: rect.shape.height,
    };

    // Closest point in the rectangle to the center of circle rotated backwards(unrotated)
    let closestX, closestY;

    // Find the unrotated closest x point from center of unrotated circle
    if (unrotatedCircleX < aabb.x) closestX = aabb.x;
    else if (unrotatedCircleX > aabb.x + aabb.width)
      closestX = aabb.x + aabb.width;
    else closestX = unrotatedCircleX;

    // Find the unrotated closest y point from center of unrotated circle
    if (unrotatedCircleY < aabb.y) closestY = aabb.y;
    else if (unrotatedCircleY > aabb.y + aabb.height)
      closestY = aabb.y + aabb.height;
    else closestY = unrotatedCircleY;

    // Determine collision
    let collision = false;

    let distance = findDistance(
      unrotatedCircleX,
      unrotatedCircleY,
      closestX,
      closestY
    );
    if (distance < circle.shape.radius) collision = true;
    // Collision
    else collision = false;

    if (collision) {
      const distVec = new THREE.Vector2(this.velocity.x, this.velocity.y);
      distVec.setLength(circle.shape.radius - distance);

      this.position.y = unrotatedCircleY - distVec.y;
      this.position.x = unrotatedCircleX - distVec.x;

      // this.velocity.x =
      //   -this.acceleration.x - (this.velocity.x - this.acceleration.x) / 2;
      this.velocity.y =
        -this.acceleration.y - (this.velocity.y - this.acceleration.y) / 2;
    }

    return collision;
  };
}

module.exports = Body;
