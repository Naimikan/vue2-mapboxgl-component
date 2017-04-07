exports.updateMinZoom = (map, newMinZoom) => {
  if (newMinZoom && newMinZoom !== null) {
    if (Number.isInteger(newMinZoom) && (newMinZoom >= 0 || newMinZoom <= 22)) {
      map.setMinZoom(newMinZoom);
    } else {
      throw new Error('Invalid min zoom');
    }
  }
};
