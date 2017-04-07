exports.updateBearing = (map, newBearing) => {
  if (newBearing && newBearing !== null) {
    if (Number.isInteger(newBearing.value)) {
      map.setBearing(newBearing.value, newBearing.eventData);
    } else {
      throw new Error('Invalid bearing');
    }
  }
};
