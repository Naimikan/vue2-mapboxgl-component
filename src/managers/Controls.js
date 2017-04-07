const Utils = require('../utils/Utils.js');
let mapboxgl = require('mapbox-gl');

let controlsCreated = {
  custom: []
};

const mapboxglControlsAvailables = [
  {
		name: 'navigation',
		constructor: mapboxgl.Navigation || mapboxgl.NavigationControl,
		pluginName: 'mapboxgl.' + (mapboxgl.Navigation ? mapboxgl.Navigation.name : mapboxgl.NavigationControl.name)
	}, {
		name: 'scale',
		constructor: mapboxgl.Scale || mapboxgl.ScaleControl,
		pluginName: 'mapboxgl.' + (mapboxgl.Scale ? mapboxgl.Scale.name : mapboxgl.ScaleControl.name)
	}, {
		name: 'attribution',
		constructor: mapboxgl.Attribution || mapboxgl.AttributionControl,
		pluginName: 'mapboxgl.' + (mapboxgl.Attribution ? mapboxgl.Attribution.name : mapboxgl.AttributionControl.name)
	},/* {
		name: 'logo',
		constructor: mapboxgl.LogoControl,
		pluginName: 'mapboxgl.LogoControl'
	}, */{
		name: 'geolocate',
		constructor: mapboxgl.Geolocate || mapboxgl.GeolocateControl,
		pluginName: 'mapboxgl.' + (mapboxgl.Geolocate ? mapboxgl.Geolocate.name : mapboxgl.GeolocateControl.name),
		eventsExposedName: 'mapboxglGeolocate',
		eventsAvailables: [
			'geolocate',
			'error'
		]
	}, {
		name: 'geocoder',
		constructor: mapboxgl.Geocoder || window.MapboxGeocoder,
		pluginName: mapboxgl.Geocoder ? 'mapboxgl.Geocoder' : 'MapboxGeocoder',
		eventsExposedName: 'mapboxglGeocoder',
		eventsAvailables: [
			'clear',
			'loading',
			'results',
			'result',
			'error'
		]
	}, {
		name: 'fullscreen',
		constructor: mapboxgl.FullscreenControl || undefined,
		pluginName: mapboxgl.FullscreenControl ? 'mapboxgl.' + mapboxgl.FullscreenControl.name : 'mapboxgl.FullscreenControl'
	}, {
		name: 'directions',
		constructor: mapboxgl.Directions || window.MapboxDirections,
		pluginName: mapboxgl.Directions ? 'mapboxgl.Directions' : 'MapboxDirections',
		eventsExposedName: 'mapboxglDirections',
		eventsAvailables: [
			'clear',
			'loading',
			'profile',
			'origin',
			'destination',
			'route',
			'error'
		]
	}, {
		name: 'draw',
		constructor: mapboxgl.Draw || window.MapboxDraw,
		pluginName: mapboxgl.Draw ? 'mapboxgl.Draw' : 'MapboxDraw',
		eventsExposedName: 'mapboxglDraw',
		listenInMap: true,
		eventsAvailables: [
			'draw.create',
			'draw.delete',
			'draw.combine',
			'draw.uncombine',
			'draw.update',
			'draw.selectionchange',
			'draw.modechange',
			'draw.render',
			'draw.actionable'
		]
	}
];

const addNewControlCreated = (controlName, newControl, isCustomControl, controlEvents, isEventsListenedByMap) => {
  let mapListenEvents = isEventsListenedByMap ? isEventsListenedByMap : false;
  let events = controlEvents && Array.isArray(controlEvents) ? controlEvents : [];

  if (isCustomControl) {
    controlsCreated.custom.push({
      name: controlName || 'customControl_' + Utils.generateGUID(),
      control: newControl,
      isEventsListenedByMap: mapListenEvents,
      events: events
    });
  } else {
    controlsCreated[controlName] = {
      control: newControl,
      isEventsListenedByMap: mapListenEvents,
      events: events
    };
  }
};

const removeEventsFromControl = (control, events, isEventsListenedByMap, map) => {
  let listener = isEventsListenedByMap ? map : control;

  events.map((eachEvent) => {
    listener.off(eachEvent);
  });
};

const removeAllControlsCreated = (map) => {
  if (map && map !== null) {
    for (var attribute in controlsCreated) {
      if  (attribute !== 'custom') {
        var controlToRemove = controlsCreated[attribute];

        removeEventsFromControl(controlToRemove.control, controlToRemove.events, controlToRemove.isEventsListenedByMap, map);

        map.removeControl(controlToRemove.control);
      } else {
        var customControls = controlsCreated[attribute];

        for (var iterator = 0, length = customControls.length; iterator < length; iterator++) {
          var eachCustomControl = customControls[iterator];

          removeEventsFromControl(eachCustomControl.control, eachCustomControl.events, eachCustomControl.isEventsListenedByMap, map);

          map.removeControl(eachCustomControl.control);
        }
      }
    }
  }

  // Reset controls created
  controlsCreated = {
    custom: []
  };
};

exports.updateControls = (map, newControls) => {
  var self = this;

  if (newControls && newControls !== null) {
    // Remove all newControls
    removeAllControlsCreated(map, controlsCreated);

    mapboxglControlsAvailables.map((eachControlAvailable) => {
      if (newControls[eachControlAvailable.name] && newControls[eachControlAvailable.name].enabled) {
        if (eachControlAvailable.constructor) {
          const ControlConstructor = eachControlAvailable.constructor.bind.apply(eachControlAvailable.constructor, newControls[eachControlAvailable.name].options);
          let control = new ControlConstructor(newControls[eachControlAvailable.name].options);

          // Add control
          addNewControlCreated(eachControlAvailable.name, control, false, eachControlAvailable.eventsAvailables, eachControlAvailable.listenInMap);

          if (eachControlAvailable.eventsAvailables && eachControlAvailable.eventsExposedName) {
            const listener = eachControlAvailable.listenInMap ? map : control;

            eachControlAvailable.eventsAvailables.map((eachControlEvent) => {
              listener.on(eachControlEvent, (event) => {
                const eventName = eachControlAvailable.eventsExposedName + ':' + eachControlEvent;

                //self.$root.$emit(eventName, event);
              });
            });
          }

          let position = newControls[eachControlAvailable.name].options && newControls[eachControlAvailable.name].options.position ? newControls[eachControlAvailable.name].options.position : undefined;

          map.addControl(control, position);
        } else {
          console.warn(eachControlAvailable.pluginName + ' plugin is not included.');
        }
      }
    });
  }
};
