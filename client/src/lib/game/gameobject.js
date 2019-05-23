const THREE = require('three');
const Body = require('../physics/body');
const { Circle, Rectangle } = require('../physics/shape');

class GameObject {
  sprite;
  body;

  update() {
    this.sprite.position.x = this.body.position.x;
    this.sprite.position.y = this.body.position.y;
    this.sprite.rotation.z = this.body.rotation;
  }
}

class Ball extends GameObject {
  constructor(radius = 0.05, mass = 10) {
    super();
    this.sprite = new THREE.Mesh(
      new THREE.CircleGeometry(radius, 32),
      new THREE.MeshBasicMaterial()
    );

    this.body = new Body(Body.DYNAMIC);
    this.body.mass = mass;
    this.body.shape = new Circle(radius);
  }
}

class Poutre extends GameObject {
  constructor({ w = 0.4, h = 0.02, x = 0, y = -0.1, r = 0 } = {}) {
    super();
    this.sprite = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial()
    );
    this.sprite.userData.item = this;

    this.body = new Body(Body.KINEMATIC);
    this.body.position.x = x;
    this.body.position.y = y;
    this.body.rotation = r;
    this.body.shape = new Rectangle(w, h);
  }
}

GameObject.Ball = Ball;
GameObject.Poutre = Poutre;

module.exports = GameObject;
