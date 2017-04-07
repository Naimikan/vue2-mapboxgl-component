const EventHub = require('../utils/EventHub.js').eventHub;

exports.updateStyle = (map, newStyle, oldStyle) => {
  if (newStyle && newStyle !== null) {
    if (newStyle !== oldStyle) {
      var styleChanged = false;

      map.setStyle(newStyle);

      map.on('styledata', (event) => {
        if (!styleChanged) {
          EventHub.$emit('mapboxglMap:styleChanged', {
            map: map,
            newStyle: newStyle,
            oldStyle: oldStyle
          });

          styleChanged = true;
        }
      });
    }
  }
};
