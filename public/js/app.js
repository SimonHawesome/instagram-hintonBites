(function() {
    var socket = io.connect('https://fierce-scrubland-7769.herokuapp.com/');

    /**
     * [Namespacing]
     */
    var Insta = Insta || {};


    var pictures = [];

    var markers = [];
    
    Insta.App = {

        /**
         * [Application initialization method / call for the methods being initializated in order]
         */
        init: function() {
            this.mostRecent();
            this.getData();
            this.mobileNav();
            this.mapLocations();
        },

        /**
         * [Interaction to open mobile navigation]
         */
        mobileNav: function() {
            var btMobNav = $('#js-mobNav'),
                nav = $('.nav');

            btMobNav.on('click', function(e) {
                e.preventDefault();
                if( !nav.hasClass('active') ) {
                    nav.addClass('active');
                } else {
                    nav.removeClass('active');
                }
            });

        },

        /**
         * [get data ajax and send to render method]
         */
        getData: function() {
            var self = this;
            socket.on('show', function(data) {

                console.log("hello");

                var url = data.show;
                $.ajax({
                    url: url,
                    type: 'POST',
                    crossDomain: true,
                    dataType: 'jsonp'
                }).done(function (data) {
                    self.renderTemplate(data);
                }); 
            });
        },

        /**
         * [Render the images on the page and check for layout resize]
         */
        renderTemplate: function(data) {
            var lastAnimate, lastSrc, nextSrc, last,
                current = data.data[0].images.standard_resolution.url,
                w = $(document).width();

                var
                    query = data,
                    source = $('#mostRecent-tpl').html(),
                    compiledTemplate = Handlebars.compile(source),
                    result = compiledTemplate(query),
                    imgWrap = $('#imgContent');

                imgWrap.prepend(result);


                last = $('#imgContent a:first-child');
                lastSrc = $('#imgContent a:first-child').find('img').attr('src');
                nextSrc = $('#imgContent a:nth-child(2)').find('img').attr('src');

                if( lastSrc === nextSrc ) {
                    last.remove();
                }

                last = $('#imgContent').find(':first-child').removeClass('Hvh');

        },

        /**
         * [ render most recent pics defined by subscribed hashtag ]
         */
        mostRecent: function() {
            socket.on('firstShow', function (data) {
                var clean = $('imgContent').find('a').remove();
                var
                    query = data,
                    source = $('#firstShow-tpl').html(),
                    compiledTemplate = Handlebars.compile(source),
                    result = compiledTemplate(query),
                    imgWrap = $('#imgContent');

                imgWrap.html(result);
            });
        },

        /**
         * [ render location points based from most recent tags ]
         */
        mapLocations: function(){
            socket.on('firstShow', function (data) {


                console.log(data);

                //loop through all instances with hashtag
                for (v=0; v < data.firstShow.length; v ++){

                    if(data.firstShow[v].location != null) {
                        var img = data.firstShow[v].images.thumbnail.url;
                        var lat = data.firstShow[v].location.latitude;
                        var long = data.firstShow[v].location.longitude;
                        var user = data.firstShow[v].user.username;
                        pictures.push([img, lat, long, 17, user]);
                    };

                }

                initialize();

            });
        }
    };




    // The following example creates complex markers to indicate pictures near
// Sydney, NSW, Australia. Note that the anchor is set to
// (0,32) to correspond to the base of the flagpole.

    function initialize() {
        var mapOptions = {
            zoom: 17,
            center: new google.maps.LatLng(45.420779,-75.688366)
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


        var infowindow = new google.maps.InfoWindow();

        google.maps.event.addListener(map, 'click', function() {
            infowindow.close();
        });



        var contentString = [];
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


            google.maps.event.addListener(marker, 'click', (function(marker, i) {

                return function() {

                    var mystring = '<div id="content">'+
                        '<img src="' + locations[i][0] + '"></>'+
                        '<p>' + locations[i][4] + '</p>'+
                        '</div>'+
                        '</div>';
                    infowindow.setContent(mystring);
                    infowindow.open(map, marker);

                }

            })(marker, i));

            markers.push(marker);



             //contentString.push([string]);

            //google.maps.event.addListener(marker, 'click', function(){
            //    infowindow.open(map, this);
            //});
            //
            console.log(markers[i]);
        }



        //var infowindow = new google.maps.InfoWindow({
        //    content: contentString[markers][0],
        //    maxWidth: 200
        //});

        var markerCluster = new MarkerClusterer(map, markers);
    }

    Insta.App.init();

})(this);