// The following example creates complex markers to indicate pictures near
// Sydney, NSW, Australia. Note that the anchor is set to
// (0,32) to correspond to the base of the flagpole.

function initialize() {
  var mapOptions = {
    zoom: 5,
    center: new google.maps.LatLng(45.406508, -75.723342)
  }
  var map = new google.maps.Map(document.getElementById('map-canvas'),
                                mapOptions);

  setMarkers(map, pictures);

  // To style the map
  var styles = [
    {
      stylers: [
        // { hue: "#00d4ff" },
        // { saturation: 20 }

          { hue: "#00d4ff" },
          { saturation: 20 },
          // { lightness: -20 },
          { gamma: 1.51 }
      ]
    },{
      featureType: "road",
      elementType: "labels",
      stylers: [
        { visibility: "on" }
      ]
    },{
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [
        { color: '#00d4ff' }
      ]
    },{  
        featureType: 'landscape.natural',  
        elementType: 'all',  
        stylers: [  
            { hue: '#00d4ff' },  
            { gamma: 1.5 }  
        ]  
    }  
  ];

  map.setOptions({styles: styles});

}

/**
 * Data for the markers consisting of a name, a LatLng and a zIndex for
 * the order in which these markers should display on top of each
 * other.
 */
var pictures = [
  //['Suzy Q', 45.405538, -75.723478, 17],
  //['Café My House', 45.404999, -75.723775, 17],
  //['The Hintonburg Public House', 45.404695, -75.723598, 17],
  //['Back Lane Café', 45.403121, -75.725506, 17],
  //['Burnt Butter Italian Kitchen', 45.402669, -75.725734, 17]
];

function setMarkers(map, locations) {
  // Add markers to the map

  // Marker sizes are expressed as a Size of X,Y
  // where the origin of the image (0,0) is located
  // in the top left of the image.

  // Origins, anchor positions and coordinates of the marker
  // increase in the X direction to the right and in
  // the Y direction down.
  var image = {
    url: 'images/cupcake.png',
    // This marker is 26 pixels wide by 36 pixels tall.
    size: new google.maps.Size(26, 32),
    // The origin for this image is 0,0.
    origin: new google.maps.Point(0,0),
    // The anchor for this image is the base of the flagpole at 14,36.
    anchor: new google.maps.Point(14, 32)
  };
  // Shapes define the clickable region of the icon.
  // The type defines an HTML &lt;area&gt; element 'poly' which
  // traces out a polygon as a series of X,Y points. The final
  // coordinate closes the poly by connecting to the first
  // coordinate.
  var shape = {
      coords: [1, 1, 1, 20, 18, 20, 18 , 1],
      type: 'poly'
  };
  for (var i = 0; i < locations.length; i++) {
    var beach = locations[i];
    var myLatLng = new google.maps.LatLng(beach[1], beach[2]);
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: image,
        shape: shape,
        title: beach[0],
        zIndex: beach[3]
    });
  }
};

google.maps.event.addDomListener(window, 'load', initialize);