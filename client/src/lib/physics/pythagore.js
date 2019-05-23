function findDistance(fromX, fromY, toX, toY) {
  const a = Math.abs(fromX - toX);
  const b = Math.abs(fromY - toY);
  return Math.sqrt(a * a + b * b);
}

module.exports = findDistance;
