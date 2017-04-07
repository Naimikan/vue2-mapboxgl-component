exports.updateZoom = (map, newZoom) => {
  if (newZoom && newZoom !== null) {
    if (Number.isInteger(newZoom.value) && (newZoom.value >= 0 || newZoom.value <= 22)) {
      map.setZoom(newZoom.value, newZoom.eventData);
    } else {
      throw new Error('Invalid zoom');
    }
  }
};
