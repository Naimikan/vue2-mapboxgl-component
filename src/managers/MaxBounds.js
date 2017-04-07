exports.updateMaxBounds = (map, newMaxBounds) => {
  if (newMaxBounds && newMaxBounds !== null) {
    if (Array.isArray(newMaxBounds) && newMaxBounds.length === 2) {
      map.setMaxBounds(newMaxBounds);
    } else {
      throw new Error('Invalid max bounds');
    }
  }
};
