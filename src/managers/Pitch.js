exports.updatePitch = (map, newPitch) => {
  if (newPitch && newPitch !== null) {
    if (Number.isInteger(newPitch.value) && (newPitch.value >= 0 || newPitch.value <= 60)) {
      map.setPitch(newPitch.value, newPitch.eventData);
    } else {
      throw new Error('Invalid pitch');
    }
  }
};
