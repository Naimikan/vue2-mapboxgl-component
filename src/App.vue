<template>
  <div id="app">
    <button style="position: absolute; top: 15px; left: 15px; z-index: 99999;" v-on:click="addAttribution">Add Attribution</button>

    <v-mapboxgl
      :id="mapId"
      :access-token="mapAccessToken"
      :height="mapHeight"
      :width="mapWidth"
      :gl-center="mapCenter"
      :gl-controls="mapControls"
      :gl-zoom="mapZoom"
      :gl-style="mapStyle"
      :gl-bearing="mapBearing"
      :gl-pitch="mapPitch">
    </v-mapboxgl>
  </div>
</template>

<script>
export default {
  data ()  {
    return {
      mapId: 'map',
      mapAccessToken: 'pk.eyJ1IjoibmFpbWlrYW4iLCJhIjoiY2lraXJkOXFjMDA0OXdhbTYzNTE0b2NtbiJ9.O64XgZQHNHcV2gwNLN2a0Q',
      mapHeight: window.innerHeight,
      mapWidth: window.innerWidth,
      mapCenter: {
        autodiscover: true
      },
      mapControls: {
        navigation: {
          enabled: true,
          options: {}
        }
      },
      mapZoom: {
        value: 8
      },
      mapStyle: 'mapbox://styles/mapbox/streets-v9',
      mapBearing: {
        value: 40
      },
      mapPitch: {
        value: 60
      }
    }
  },
  methods: {
    handleResize (event) {
      this.mapHeight = event.currentTarget.innerHeight
      this.mapWidth = event.currentTarget.innerWidth
    },
    addAttribution (event) {
      this.mapControls = Object.assign({}, this.mapControls, { attribution: { enabled: true }});
    }
  },
  mounted () {
    window.addEventListener('resize', this.handleResize)

    this.$on('mapboxglMap:styleChanged', function (event, args) {
      console.log(event, args);
    });
  }
}
</script>

<style>
body {
  margin: 0;
}
</style>
