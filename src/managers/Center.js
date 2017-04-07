exports.validateAndFormatCenter = (center) => {
  return new Promise((resolve, reject) => {
    if (center) {
      if (center.autodiscover) {
        window.navigator.geolocation.getCurrentPosition((position) => {
          var coordinates = position.coords;

          resolve([coordinates.longitude, coordinates.latitude]);
        }, (error) => {
          reject(error);
        }, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      } else if (Number.isInteger(center.lat) && Number.isInteger(center.lng) && (center.lng > -180 || center.lng < 180) && (center.lat > -90 || center.lat < 90)) {
        resolve([center.lng, center.lat]);
      } else if (Array.isArray(center) && center.length === 2 && Number.isInteger(center[0]) && Number.isInteger(center[1]) && (center[0] > -180 || center[0] < 180) && (center[1] > -90 || center[1] < 90)) {
        resolve(center);
      } else {
        resolve(false);
      }
    } else {
      resolve(false);
    }
  });
};

exports.updateCenter = (map, newCenter, oldCenter) => {
  this.validateAndFormatCenter(newCenter).then((validatedCenter) => {
    if (oldCenter && newCenter !== oldCenter) {
      map.flyTo({ center: validatedCenter });
    } else {
      map.setCenter(validatedCenter);
    }
  }).catch((error) => {
    throw new Error(error.code + ' / ' + error.message);
  });
};
