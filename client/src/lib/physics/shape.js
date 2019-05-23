const THREE = require('three');

class Shape {}

class Rectangle extends Shape {}

class Circle extends Shape {}

Shape.Rectangle = Rectangle;
Shape.Circle = Circle;

module.exports = Shape;
