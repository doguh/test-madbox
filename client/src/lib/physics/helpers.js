const THREE = require('three');

function clamp(min, mid, max) {
  return Math.min(Math.max(min, mid), max);
}

function circleIntersectsRectangle(
  circleX,
  circleY,
  circleRadius,
  rectX,
  rectY,
  rectWidth,
  rectHeight,
  rectAngle,
  rectPivotX,
  rectPivotY
) {
  const rotatedCircle = new THREE.Vector2(circleX, circleY).rotateAround(
    new THREE.Vector2(rectPivotX, rectPivotY),
    -rectAngle
  );
  const deltaX =
    rotatedCircle.x - clamp(rectX, rotatedCircle.x, rectX + rectWidth);
  const deltaY =
    rotatedCircle.y - clamp(rectY, rotatedCircle.y, rectY + rectHeight);
  return deltaX * deltaX + deltaY * deltaY < circleRadius * circleRadius;
}

module.exports = { clamp, circleIntersectsRectangle };
