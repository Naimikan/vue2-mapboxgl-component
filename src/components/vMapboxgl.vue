<template>
  <div class="vue-mapboxgl-map">
    <div class="vue-mapboxgl-map-loader">
      <div class="spinner">
        <div class="double-bounce"></div>
        <div class="double-bounce delayed"></div>
      </div>
    </div>
  </div>
</template>

<script>
let mapboxgl = require('mapbox-gl');

const Utils = require('../utils/Utils.js');
const EventHub = require('../utils/EventHub.js').eventHub;
const Constants = require('../constants/Constants.js');

// Managers
const CenterManager = require('../managers/Center.js');
const ControlsManager = require('../managers/Controls.js');
const ZoomManager = require('../managers/Zoom.js');
const StyleManager = require('../managers/Style.js');
const BearingManager = require('../managers/Bearing.js');
const PitchManager = require('../managers/Pitch.js');
const MaxZoomManager = require('../managers/MaxZoom.js');
const MinZoomManager = require('../managers/MinZoom.js');
const MaxBoundsManager = require('../managers/MaxBounds.js');

export default {
  props: {
    id: String,
    accessToken: String,
    language: String,
    showCollisionBoxes: Boolean,
    showTileBoundaries: Boolean,
    repaint: Boolean,
    rtlEnabled: Boolean,
    height: {
      type: [String, Number],
      default: '450px'
    },
    width: [String, Number],
    hash: {
      type: Boolean,
      default: false
    },
    bearingSnap: {
      type: Number,
      default: 7
    },
    failIfMajorPerformanceCaveat: {
      type: Boolean,
      default: false
    },
    preserveDrawingBuffer: {
      type: Boolean,
      default: false
    },
    trackResize: {
      type: Boolean,
      default: true
    },
    renderWorldCopies: {
      type: Boolean,
      default: true
    },

    glBearing: {
      type: Object
    },
    glCenter: {
      type: [Object, Array],
      default () {
        return [0, 0];
      }
    },
    glControls: [Object, Array],
    glLayers: [Object, Array],
    glPitch: {
      type: Object
    },
    glStyle: {
      type: [Object, String],
      default: 'mapbox://styles/mapbox/streets-v9'
    },
    glZoom: {
      type: Object,
      default () {
        return { value: 0 };
      }
    },
    glMaxZoom: {
      type: Number,
      default: 22
    },
    glMinZoom: {
      type: Number,
      default: 0
    }
  },
  methods: {
    updateWidth (width) {
      if (isNaN(width)) {
        this.$el.style.width = width;
      } else {
        this.$el.style.width = width + 'px';
      }

      if (this.mapInstance && this.mapInstance !== null) {
        this.mapInstance.resize();
      }
    },
    updateHeight (height) {
      if (isNaN(height)) {
        this.$el.style.height = height;
      } else {
        this.$el.style.height = height + 'px';
      }

      if (this.mapInstance && this.mapInstance !== null) {
        this.mapInstance.resize();
      }
    },
    updateLanguage (newLanguage) {
      if (newLanguage && newLanguage !== null && this.mapInstance && this.mapInstance !== null) {
        this.mapInstance.setLayoutProperty('country-label-lg', 'text-field', '{name_' + newLanguage + '}');
      }
    },
    changeLoadingMap (newValue) {
      var children = this.$el.children;

      for (var iterator = 0; iterator < children.length; iterator++) {
        var child = children[0];

        if (child.className.indexOf('vue-mapboxgl-map-loader') !== -1) {
          if (newValue) {
            child.className += ' vue-mapboxgl-map-loading';
          } else {
            child.className = child.className.replace('vue-mapboxgl-map-loading', '');
          }
        }
      }
    }
  },
  watch: {
    height (newHeight) {
      this.updateHeight(newHeight);
    },
    width (newWidth) {
      this.updateWidth(newWidth);
    },
    language (newLanguage) {
      this.updateLanguage(newLanguage);
    },
    showCollisionBoxes: function (newShow) {
      this.mapInstance.showCollisionBoxes = newShow;
    },
    showTileBoundaries: function (newShow) {
      this.mapInstance.showTileBoundaries = newShow;
    },
    repaint: function (newRepaint) {
      this.mapInstance.repaint = newRepaint;
    },

    glBearing: {
      handler (newBearing) {
        BearingManager.updateBearing(this.mapInstance, newBearing);
      },
      deep: true
    },
    glCenter: {
      handler (newCenter, oldCenter) {
        CenterManager.updateCenter(this.mapInstance, newCenter, oldCenter);
      },
      deep: true
    },
    glControls: {
      handler (newControls) {
        ControlsManager.updateControls(this.mapInstance, newControls);
      },
      deep: true
    },
    glZoom: {
      handler (newZoom) {
        ZoomManager.updateZoom(this.mapInstance, newZoom);
      },
      deep: true
    },
    glStyle: {
      handler (newStyle, oldStyle) {
        StyleManager.updateStyle(this.mapInstance, newStyle, oldStyle);
      },
      deep: true
    },
    glPitch: {
      handler (newPitch) {
        PitchManager.updatePitch(this.mapInstance, newPitch);
      },
      deep: true
    },
    glMaxZoom (newMaxZoom) {
      MaxZoomManager.updateMaxZoom(this.mapInstance, newMaxZoom);
    },
    glMinZoom (newMinZoom) {
      MinZoomManager.updateMinZoom(this.mapInstance, newMinZoom);
    }
  },
  data () {
    return {
      mapInstance: null
    }
  },
  beforeCreate () {
    if (!mapboxgl) {
      throw new Error('Mapbox GL doesn\'t included');
    }

    if (!mapboxgl.supported()) {
      throw new Error('Your browser doesn\'t support Mapbox GL');
    }
  },
  created () {
    var self = this;

    if (!mapboxgl.accessToken) {
      if (self.accessToken && self.accessToken.length > 0) {
        mapboxgl.accessToken = self.accessToken;
      } else {
        throw new Error('Mapbox access token doesn\'t defined');
      }
    }

    if (self.rtlEnabled && typeof(self.rtlEnabled) === 'boolean') {
      if (mapboxgl.setRTLTextPlugin) {
        mapboxgl.setRTLTextPlugin(Constants.rtlPluginUrl);
      } else {
        throw new Error('Your version of Mapbox GL doesn\'t support "setRTLTextPlugin" function');
      }
    }
  },
  mounted () {
    var self = this;

    self.changeLoadingMap(true);

    var mapboxglMapId = self.id ? self.id : 'vue-map-' + Utils.generateGUID();
    self.$el.setAttribute('id', mapboxglMapId);

    self.updateHeight(self.height);
    self.updateWidth(self.width);

    var initObject = {
      container: mapboxglMapId,
      style: self.glStyle,
      center: self.glCenter,
      zoom: self.glZoom.value,
      hash: self.hash,
      bearingSnap: self.bearingSnap,
      failIfMajorPerformanceCaveat: self.failIfMajorPerformanceCaveat,
      preserveDrawingBuffer: self.preserveDrawingBuffer,
      trackResize: self.trackResize,
      renderWorldCopies: self.renderWorldCopies,
      attributionControl: false
    };

    CenterManager.validateAndFormatCenter(self.glCenter).then(function (newCenter) {
      initObject.center = newCenter ? newCenter : initObject.center;

      var mapboxGlMap = new mapboxgl.Map(initObject);

      ControlsManager.updateControls(mapboxGlMap, self.glControls);
      BearingManager.updateBearing(mapboxGlMap, self.glBearing);
      PitchManager.updatePitch(mapboxGlMap, self.glPitch);
      MaxBoundsManager.updateMaxBounds(mapboxGlMap, self.glMaxBounds);
      MaxZoomManager.updateMaxZoom(mapboxGlMap, self.glMaxZoom);
      MinZoomManager.updateMinZoom(mapboxGlMap, self.glMinZoom);

      mapboxGlMap.on('load', function (event) {
        var map = event.target;

        self.mapInstance = map;
        self.changeLoadingMap(false);
      });
    });
  },
  beforeDestroy () {
    if (this.mapInstance) {
      this.mapInstance.remove();
    }
  }
}
</script>

<style lang="less" scoped>
// Loading Background Variables
@backgroundColorLoading: #999999;
@backgroundOpacityLoading: 0.75;

// Loading Spinner Variables
@spinnerWidth: 40px;
@spinnerHeight: 40px;
@spinnerColor: #333333;
@spinnerOpacity: 0.6;

.vue-mapboxgl-compare {
  position: relative;

  .compare-map {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }
}

.vue-mapboxgl-map {
  position: relative;

  .vue-mapboxgl-map-loader {
    // ...

    .spinner {
      display: none;
      width: @spinnerWidth;
      height: @spinnerHeight;
      top: ~"calc(50% - (@{spinnerHeight} / 2))";
      left: ~"calc(50% - (@{spinnerWidth} / 2))";
      position: relative;
      //margin: 100px auto;

      .double-bounce {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: @spinnerColor;
        opacity: @spinnerOpacity;
        position: absolute;
        top: 0;
        left: 0;

        -webkit-animation: sk-bounce 2.0s infinite ease-in-out;
        animation: sk-bounce 2.0s infinite ease-in-out;

        &.delayed {
          -webkit-animation-delay: -1.0s;
          animation-delay: -1.0s;
        }
      }
    }

    &.vue-mapboxgl-map-loading {
      position: absolute;
      background-color: @backgroundColorLoading;
      width: 100%;
      height: 100%;
      opacity: @backgroundOpacityLoading;
      z-index: 9900;

      .spinner {
        display: block;
      }
    }
  }

  // Fix directions style
  .directions-icon-depart, .directions-icon-arrive {
    background-position: 50% 50%;
    width: 100%;
    height: 100%;
  }
}

// Animations
@-webkit-keyframes sk-bounce {
  0%, 100% { -webkit-transform: scale(0.0) }
  50% { -webkit-transform: scale(1.0) }
}

@keyframes sk-bounce {
  0%, 100% {
    transform: scale(0.0);
    -webkit-transform: scale(0.0);
  } 50% {
    transform: scale(1.0);
    -webkit-transform: scale(1.0);
  }
}
</style>
