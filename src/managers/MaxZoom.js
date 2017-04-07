exports.updateMaxZoom = (map, newMaxZoom) => {
  if (newMaxZoom && newMaxZoom !== null) {
    if (Number.isInteger(newMaxZoom) && (newMaxZoom >= 0 || newMaxZoom <= 22)) {
      map.setMaxZoom(newMaxZoom);
    } else {
      throw new Error('Invalid max zoom');
    }
  }
};
