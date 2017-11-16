<template>
  <div id="app">
    <!-- <button style="position: absolute; top: 15px; left: 15px; z-index: 99999;" v-on:click="addAttribution">Add Attribution</button>

    <v-mapboxgl :id="'map1'" :access-token="mapAccessToken"></v-mapboxgl>
    <v-mapboxgl :id="'map2'" :access-token="mapAccessToken"></v-mapboxgl> -->

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
      :gl-pitch="mapPitch"
      :gl-popups="mapPopups">
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
      },
      mapPopups: [
        {
          coordinates: [-2, 41],
          // message: 'Hi popup!'
          message: '<h3>Title</h3><v-mapboxgl :access-token="\'pk.eyJ1IjoibmFpbWlrYW4iLCJhIjoiY2lraXJkOXFjMDA0OXdhbTYzNTE0b2NtbiJ9.O64XgZQHNHcV2gwNLN2a0Q\'" :width="150" :height="150"></v-mapboxgl>'
        }, {
          coordinates: [-3, 46],
          // message: 'Hi popup!'
          message: '<h3>Title 2</h3><v-mapboxgl :access-token="\'pk.eyJ1IjoibmFpbWlrYW4iLCJhIjoiY2lraXJkOXFjMDA0OXdhbTYzNTE0b2NtbiJ9.O64XgZQHNHcV2gwNLN2a0Q\'" :width="100" :height="100"></v-mapboxgl>'
        }
      ]
    }
  },
  methods: {
    handleResize (event) {
      this.mapHeight = event.currentTarget.innerHeight
      this.mapWidth = event.currentTarget.innerWidth
    },
    addAttribution (event) {
      this.mapControls = Object.assign({}, this.mapControls, { attribution: { enabled: true }})
    }
  },
  mounted () {
    window.addEventListener('resize', this.handleResize)

    this.$on('mapboxglMap:styleChanged', (event, args) => {
      console.log(event, args)
    })
  }
}
</script>

<style>
body {
  margin: 0;
}
</style>
