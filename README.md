<p align="right">
  <a href="https://www.npmjs.com/package/vue2-mapboxgl-component">
    <img src="https://img.shields.io/npm/v/vue2-mapboxgl-component.svg" alt="version" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/npm/l/vue2-mapboxgl-component.svg" alt="license" />
  </a>
</p>

<h1 align="center">vue2-mapboxgl-component | <a href="https://github.com/Naimikan/vue2-mapboxgl-component/wiki">Wiki</a></h1>

<h5 align="center">VueJS component for Mapbox GL</h5>

<h2 align="center">Installation</h2>

NPM
```BASH
npm install vue2-mapboxgl-component --save
```

<h2 align="center">Usage</h2>

```html
<template>
  <v-mapboxgl :access-token="accessToken"></v-mapboxgl>
</template>

<script>
  import vMapboxgl from 'vue2-mapboxgl-component'

  export default {
    data () {
      return {
        accessToken: '<YOUR_ACCESS_TOKEN>'
      }
    },

    components: {
      vMapboxgl
    }
  }
</script>
```

<h2 align="center">Developing</h2>

Install dependencies, build the source files and preview

```bash
# Clone repo
git clone https://github.com/Naimikan/vue2-mapboxgl-component.git

# Install dependencies
npm install

# Serve with hot reload at localhost:8080
npm run dev

# Build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).
