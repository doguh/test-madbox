class Shape {}

class Rectangle extends Shape {
  width;
  height;

  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }
}

class Circle extends Shape {
  radius;

  constructor(radius) {
    super();
    this.radius = radius;
  }
}

Shape.Rectangle = Rectangle;
Shape.Circle = Circle;

module.exports = Shape;
