const Utils = require('../utils/Utils.js')
const Vue = require('vue')
const mapboxgl = require('mapbox-gl')

/*
  /\$\{(.+?)\}/g --> Lorem ${ipsum} lorem ${ipsum} --> ['${ipsum}', '${ipsum}']
  /[^\$\{](.+)[^\}]/g --> ${ipsum} --> ipsum
*/
var _regexFindDollar = new RegExp(/\$\{(.+?)\}/g)
var _regexGetValueBetweenDollarClaudator = new RegExp(/[^\$\{](.+)[^\}]/g)
var _popupsCreated = []

exports.removeAllPopupsCreated = () => {
  _popupsCreated.map(eachPopup => {
    eachPopup.popupInstance.remove()
  })

  _popupsCreated = []
}

exports.generatePopupMessage = (object, feature) => {
  var popupMessage = object.message

  if (popupMessage instanceof HTMLElement) return popupMessage
  else if (feature && feature !== null) {
    var allMatches = popupMessage.match(_regexFindDollar)

    if (allMatches.length > 0) {
      allMatches.map(eachMatch => {
        var tempMatch = eachMatch.match(_regexGetValueBetweenDollarClaudator)

        if (tempMatch.length > 0) {
          var regexValue = tempMatch[0]

          if (feature.properties.hasOwnProperty(regexValue)) popupMessage = popupMessage.replace(eachMatch, feature.properties[regexValue])
          else throw new Error('Property "' + regexValue + '" isn\'t exist in source "' + feature.layer.source + '"')
        }
      })
    }
  }

  return popupMessage

  // var templateScope = angular.isDefined(object.getScope) && angular.isFunction(object.getScope) ? object.getScope() : $rootScope;
  //
  // try {
  //   var templateHtmlElement = $compile(popupMessage)(templateScope)[0];
  //
  //   return templateHtmlElement;
  // } catch (error) {
  //   return popupMessage;
  // }
}

exports.createPopupByObject = (map, popupObject, feature) => {
  return new Promise((resolve, reject) => {
    console.log('createPopupByObject')

    var popup = new mapboxgl.Popup(popupObject.options || {})

    if (popupObject.coordinates && popupObject.coordinates !== null) {
      var popupCoordinates = popupObject.coordinates

      if (feature && feature !== null) popupCoordinates = popupCoordinates === 'center' ? feature.geometry.coordinates : popupCoordinates

      if (popupCoordinates !== 'center') popup.setLngLat(popupCoordinates)
    }

    if (popupObject.onClose && popupObject.onClose !== null && Utils.isFunction(popupObject.onClose)) {
      popup.on('close', event => {
        popupObject.onClose(event, event.target)
      })
    }

    popup.addTo(map)

    var popupMessage = this.generatePopupMessage(popupObject, feature)

    var res = Vue.default.compile('<span>' + popupMessage + '</span>')

    new Vue.default({
      render: res.render,
      staticRenderFns: res.staticRenderFns,
      mounted: function () {
        console.log('mounted')

        popupMessage = this.$el

        if (popupMessage instanceof HTMLElement) popup.setDOMContent(popupMessage)
        else popup.setHTML(popupMessage)

        _popupsCreated.push({
          popupInstance: popup,
          isOnClick: popupObject.isOnClick ? popupObject.isOnClick : false,
          isOnMouseover: popupObject.isOnMouseover ? popupObject.isOnMouseover : false,
          layerId: feature && feature !== null ? feature.layer.id : undefined
        })


        resolve(popup)
      }
    }).$mount('#vue-mapboxgl-compile-popup')
  })
}

exports.updatePopups = (map, newPopups) => {
  if (newPopups && newPopups !== null) {
    if (Array.isArray(newPopups) && newPopups.length > 0) {
      // Remove
      this.removeAllPopupsCreated()

      newPopups.map(eachPopup => {
        this.createPopupByObject(map, eachPopup).then(popupCreated => {
          // popupCreated.addTo(map)
        })
      })
    } else {
      throw new Error('Invalid popup parameter')
    }
  }
}
