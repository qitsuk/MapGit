/*  We are declaring the different variables we need
    outside the initMap function. We do this so they are accesible
    throughout the script. */

/*  Firstly, the Directions Service and Directions Display. These
    are used, to find the route and draw the route on the map. */
var directionsService;
var directionsDisplay

/*  Booleans for determining if various conditions are met, so the program 
    can act accordingly. The ones we use are for testing if certain things 
    are being rendered. */
var superMarketsShowing = false;
var hotelsShowing = false;
var gasStationsShowing = false;

var routeFromRoedbyShowing = false;
var routeFromGedserShowing = false;
var customRouteShowing = false;

/*  The map and the where we center the map. */
var originalCenter;
var map;

/*  The infowindow, we need to display information, about the 
    different place. */
var infowindow;

/*  The service that searches and returns the different information,
    about each place. */
var placesService;

/*  Creating three arrays, that can hold the different markers,
    after we create them. We do this for easier access, so we can 
    add and remove them from the map. */
var superMarketMarkers = [];
var hotelsMarkers = [];
var gasStationMarkers = [];

/*  The first function called when the page loads. This is what creates/
    draws the map. */
function initMap() {

    /*  We instantiate the directionsService and the directionsDisplay
        early in the program. This is just to get it out of the way. */
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();

    // Setting where we want the center as a variable
    originalCenter = { lat: 55.077326, lng: 11.822575 };

    /*  Declaring the map, so that it can be shown
        We pass the center, set the zoom level, and define the type of map to be rendered. */
    this.map = new google.maps.Map(document.getElementById('map'), {
        center: originalCenter,
        zoom: 12,
        mapTypeId: 'terrain'
    });

    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directionsPanel'));

    /*  Setting up the Places Service that is going to be doing
        out text searches. Because this service takes our map as a parameter,
        we declare it after we've declared the map. */
    placesService = new google.maps.places.PlacesService(this.map);

    /*  Setting the original center marker. We are going to leave 
        that rendered throughout the lifecycle of the site. The marker,
        when created with the map, will render always, unless it is hidden.
        Setting the map property of marker to null, will result in the marker
        not being rendered. */
    var centerMarker = new google.maps.Marker({
        map: this.map,
        position: originalCenter,
        animation: google.maps.Animation.DROP,
    });

    // Instanciating the infowindow.
    infowindow = new google.maps.InfoWindow();

    /*  Adding an Event listener to the newly created marker. This specific one
        will react when the marker is clicked with the mouse, and display the
        the infowindow we created earlier. */
    google.maps.event.addListener(centerMarker, 'click', function () {
        infowindow.setContent("<div style='text-align: center;'>CK Racing Event<br/>Hanebjergvej 1<br/>4760 Vordingborg</div>");
        infowindow.open(this.map, this);
    });

    /*  The functions for finding the POI on the map are done in the init
        map function. This is because this function is called, whenever the
        webpage is loaded. We don't really have any other hooks, or callbacks to use,
        thus we do it here. */
    function findSuperMarkets() {

        /*  The service that we defined earlier, is a call to the Google Places API.
            We use this service to do a text search. There is something called a nearBy
            search as well, but that wouldn't work, so... Text Search! */
        placesService.textSearch({
            location: this.map.getCenter(), // Where to search from. We chose the center of the map.
            radius: '500', // This radius is supposed to be in meters but it is not!
            query: 'supermarked' // The string we want to look for
        }, superMarketHandling); // This is the method we pass the information returned, to.
    }

    /*  The callback function called when the service is done with it's search.
        We are not passing the parameters manually, because this is a callback function.
        We know, thanks to the API, that service.textSearch, is gonna return 2 things.
        A result array and a status. */
    function superMarketHandling(results, status) {
        // First we check that the service did what we wanted
        if (status === google.maps.places.PlacesServiceStatus.OK) {

            // And the we loop over the result array
            for (var i = 0; i < results.length; i++) {

                /*  And finally we make a call to the createSuperMarketMarker function
                    We pass the index of the array to the supermarket marker. Each result
                    in the results array, contain the info needed to create a marker. */
                createSuperMarketMarker(results[i]);

                /*  A quick console.log to make sure things are working. This is for debugging
                    purposes only, and should be removed in the production code. */
                // console.log(results[i]);
            }
        } else {
            console.log('Something went wrong!');
        }
    }

    /*  We do the exact same thing for the gas stations and the hotels/b'n'bs.
        (Repeating code, not gonna repeat comments!) */

    function findHotels() {
        placesService.textSearch({
            location: map.getCenter(),
            radius: '500',
            query: 'hotel'
        }, hotelHandling);
    }

    function hotelHandling(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                createHotelMarkers(results[i]);
            }
        } else {
            console.log('Something went wrong!');
        }
    }

    // And one more to handle the gas stations.
    function findGasStations() {
        placesService.textSearch({
            location: this.map.getCenter(),
            radius: '500',
            query: 'gasstation',
        }, handleGasStations);
    }

    function handleGasStations(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                createGasStationMarkers(results[i]);
            }
        } else {
            console.log('Something went wrong!');
        }
    }

    /*  Finally in the initMap function, we need to call the different functions, that look
        for the supermarkets, hotels and gasstations. Currently, they only exists as functions,
        and functions will not be executed unless they are called (thank you rubber duckie). */
    findSuperMarkets();
    findHotels();
    findGasStations();


}

/*  Now outside the initMap function, we make some other functions. The reason we are placing these outside the initMap,
    is for the sake of the scope. If we keep them in initMap, they will only be avaiable when the page loads. 

    The first thing we are going to do, is create the first markers. The
    first one we are dealing with is the supermarkets, because that was
    the first search we did. We are already making a call to this function
    earlier in the code. When we created it, we passed one of the results,
    from the result array. In this function we will refer to that, as a place,
    as the different information the places service returns, could be considered
    a place. */
function createSuperMarketMarker(place) {
    // We start by declaring a marker, from the google maps libs
    var marker = new google.maps.Marker({

        /*  We set the initial map of the marker, as null. We do this,
            because we don't wan't it to be drawn yet. When we give it our
            map, it will be rendered. We will handle this later with a 
            button. */
        map: null,

        /*  We set the position of the marker, based on the LatLng
            variables return from the service. */
        position: place.geometry.location,

        /*  This is where we set our icon. As this is a simple assignmet,
            we can change the icon, whenever we please. The url, is pretty self 
            explanatory. The size, is a scaledSize. This is found in the maps lib,
            and ensures, that the icon is scaled correctly according to the map. The 
            numbers are pixel indicators. */
        icon: { url: 'shopping-cart.svg', scaledSize: new google.maps.Size(50, 50) },

        /*  We set a simple drop animation, that will be played for the marker,
            when it is toggled on. The animation is also found in the google libs. */
        animation: google.maps.Animation.DROP,
    });

    /*  After creating the individual markers, we add them to a new array,
        so we can keep track of them. This array was declared earlier in the code. */
    superMarketMarkers.push(marker);

    /*  Setting the URL for the photo of the place in question. We extract it from the place
       array, that is extracted from the service. We also set how large the image maximum can be. */
    var superMarketPhotoURL = place.photos[0].getUrl({ maxWidth: 200, maxHeight: 200 });

    /*  We set up a click listener, for each marker. This function will handle showing the infowindow
        with the address and the image from the place in question. */
    google.maps.event.addListener(marker, 'click', function () {

        /*  This is where we need the jQuery. We need to wait for the slowPanTo to finish,
            before, we zoom. The slowPan and smoothZoom function are thouroughly documentet
            later in the code. */
        $.when(slowPanTo(map, marker.getPosition(), 10, 200)).done(smoothZoom(this.map, 16, this.map.getZoom(), true));

        /*  Then after this line is executed, we add content to the infowindow.
            For these, we are displaying the name, the address, and the image. */
        infowindow.setContent("<div style='text-align: center;'>" + place.name + "<br/>"
            + place.formatted_address + "<br/><br/><img src='" + superMarketPhotoURL + "'/>" + "</div>" + 
            "<p><input type='button' onclick='calculateFromSuperMarket()' value='Find Route To Here' /></p>");
        infowindow.open(map, this);
    });

    /*  The final step of creating the marker is setting an event listener, that handles when the user
        closes the infowindow. As is right now, when the user closes a marker, we pan and zoom back to
        the original center of the map. This is easily changed, if need be. */

    google.maps.event.addListener(infowindow, 'closeclick', function () {
        $.when(map.panTo(originalCenter)).done(smoothZoom(map, 12, map.getZoom(), false));
    });
}

/*  And again, we need to do the same thing for the hotels and the gas stations.
   And again, duplicate code, I am not duplicating comments. */
function createHotelMarkers(place) {
    var marker = new google.maps.Marker({
        map: null,
        position: place.geometry.location,
        icon: { url: 'slumber.svg', scaledSize: new google.maps.Size(50, 50) },
        animation: google.maps.Animation.DROP,
    });
    hotelsMarkers.push(marker);
    var hotelPhotoURL = place.photos[0].getUrl({ maxWidth: 200, maxHeight: 200 });
    google.maps.event.addListener(marker, 'click', function () {
        $.when(slowPanTo(map, marker.getPosition(), 10, 200)).done(smoothZoom(this.map, 16, this.map.getZoom(), true));
        infowindow.setContent("<div style='text-align: center;'>" + place.name + "<br/>"
            + place.formatted_address + "<br/><br/><img src='" + hotelPhotoURL + "'/>" + "</div");
        infowindow.open(map, this);
    });
    google.maps.event.addListener(infowindow, 'closeclick', function () {
        $.when(map.panTo(originalCenter)).done(smoothZoom(map, 12, map.getZoom(), false));
    });
}


function createGasStationMarkers(place) {
    var marker = new google.maps.Marker({
        map: null,
        position: place.geometry.location,
        icon: { url: 'gas-station.svg', scaledSize: new google.maps.Size(50, 50) },
        animation: google.maps.Animation.DROP,
    });
    gasStationMarkers.push(marker);
    google.maps.event.addListener(marker, 'click', function () {
        $.when(slowPanTo(map, marker.getPosition(), 10, 200)).done(smoothZoom(this.map, 16, this.map.getZoom(), true));
        infowindow.setContent("<div style='text-align: center;'>" + place.name + "<br />" + place.formatted_address + "<br/><br/><img src='" + place.photos[0].getUrl({ maxWidth: 200, maxHeight: 200 }) + "'>" + "</div>");
        infowindow.open(map, this);
    });
    google.maps.event.addListener(infowindow, 'closeclick', function () {
        $.when(map.panTo(originalCenter)).done(smoothZoom(map, 12, map.getZoom(), false));
    });
}

/*  We then need to define the function, that is going to be fired from the button,
    to toggle the Supermarket markers. */
function toggleSuperMarketMarkers() {
    // First we check if the markers are showing.
    if (!this.superMarketsShowing) {

        /*  If they aren't, we show them, by assigning them the map.
            First we loop through the superMarketMarkers Array and
            assign each marker our map. */
        for (var i = 0; i < superMarketMarkers.length; i++) {
            superMarketMarkers[i].setMap(this.map);
            superMarketMarkers[i].setAnimation(google.maps.Animation.DROP); // Resetting the animation
        }

        // Debug message
        /*  Then we set the value for if the markers are showing, to true,
            and adjust the content of the button. */
        superMarketsShowing = true;
        document.getElementById('toggleSuperMarketButton').value = "Hide Supermarkets";

        //  And if they are showing ... 
    } else {

        /*  Again we start by looping through the array. Only this time,
            we set the map of each marker to null. */
        for (var i = 0; i < superMarketMarkers.length; i++) {
            superMarketMarkers[i].setMap(null);
        }

        // Debug message
        /*  We then set the boolean back to false, to indicate
            that the markers are no longer showing. */
        superMarketsShowing = false;

        //  And finally we set the button text back to say Show Supermarkets
        document.getElementById('toggleSuperMarketButton').value = "Show Supermarkets";
    }
}

/*  And once again, we need to duplicate the code, but change the values.
    And as before, I am not reproducing the comments for this part. */
function toggleHotelMarkers() {
    if (!this.hotelsShowing) {
        for (var i = 0; i < hotelsMarkers.length; i++) {
            hotelsMarkers[i].setMap(this.map);
            hotelsMarkers[i].setAnimation(google.maps.Animation.DROP);
        }
        hotelsShowing = true;
        document.getElementById("toggleHotelButton").value = "Hide Hotels";
    } else {
        for (var i = 0; i < hotelsMarkers.length; i++) {
            hotelsMarkers[i].setMap(null);
        }
        hotelsShowing = false;
        document.getElementById("toggleHotelButton").value = "Show Hotels";
    }
}

function toggleGasStationMarkers() {
    if (!this.gasStationsShowing) {
        for (var i = 0; i < gasStationMarkers.length; i++) {
            gasStationMarkers[i].setMap(this.map);
            gasStationMarkers[i].setAnimation(google.maps.Animation.DROP);
        }
        gasStationsShowing = true;
        document.getElementById("toggleGasStationButton").value = "Hide Gas Stations";
    } else {
        for (var i = 0; i < gasStationMarkers.length; i++) {
            gasStationMarkers[i].setMap(null);
        }
        gasStationsShowing = false;
        document.getElementById("toggleGasStationButton").value = "Show Gas Stations";
    }
}

/*  The smoothZoom function. The standard zoom, doesn't zoom gradually, just snaps to the zoom level.
    This function seeks to redeem that. It takes 4 parameters - out map, the zoom level, current
    zoom level and mode. Mode is whether or not to zoom in or out. */

async function smoothZoom(map, level, cnt, mode) {

    //  Mode true, means we are zooming in.
    if (mode == true) {

        /*  We check if we are zoomed in further than the level we want to go to.
            If we are, we do nothing. */
        if (cnt >= level) {
            return;
        }
        /*  This is where we zoom in. We setup another event listener, where we check if the zoom level
            was changed. If the level was changed and if we are still zoomed out further than the desired
            zoom level, it will run function again, making this a recursive function. After each run,
            we remove the listener, just in case we are at the level we want to be at. */
        else {
            var z = google.maps.event.addListener(map, 'zoom_changed', function (event) {
                google.maps.event.removeListener(z);
                smoothZoom(map, level, cnt + 1, true);
            });

            /*  Setting the timeout is important, as this is what gives us the 'smooth'
                zoom function. */
            setTimeout(function () { map.setZoom(cnt) }, 80);
        }
        /*  If we are not in zoom in mode, we zoom out. This is done basically the same way, only
            we decrement the zoom level, instead of incrementing it.  */
    } else {
        if (cnt <= level) {
            return;
        }
        else {
            var z = google.maps.event.addListener(map, 'zoom_changed', function (event) {
                google.maps.event.removeListener(z);
                smoothZoom(map, level, cnt - 1, false);
            });
            setTimeout(function () { map.setZoom(cnt) }, 80);
        }
    }
}
/*  Found this function on stack overflow, to make the map pan slower. This is because
the maps API, has no way of controlling pan speed, just like with the zoom. This function
is a little complicated for me to start going in to detail with. But it is basically a rewrite
of googles own panning mechanism, slowed down. */
function slowPanTo(map, endPosition, n_intervals, T_msec) {
    var f_timeout, getStep, i, j, lat_array, lat_delta, lat_step, lng_array, lng_delta, lng_step, pan, ref, startPosition;
    getStep = function (delta) {
        return parseFloat(delta) / n_intervals;
    };
    startPosition = map.getCenter();
    lat_delta = endPosition.lat() - startPosition.lat();
    lng_delta = endPosition.lng() - startPosition.lng();
    lat_step = getStep(lat_delta);
    lng_step = getStep(lng_delta);
    lat_array = [];
    lng_array = [];
    for (i = j = 1, ref = n_intervals; j <= ref; i = j += +1) {
        lat_array.push(map.getCenter().lat() + i * lat_step);
        lng_array.push(map.getCenter().lng() + i * lng_step);
    }
    f_timeout = function (i, i_min, i_max) {
        return parseFloat(T_msec) / n_intervals;
    };
    pan = function (i) {
        if (i < lat_array.length) {
            return setTimeout(function () {
                map.panTo(new google.maps.LatLng({
                    lat: lat_array[i],
                    lng: lng_array[i]
                }));
                return pan(i + 1);
            }, f_timeout(i, 0, lat_array.length - 1));
        }
    };
    return pan(0);
};

/*  The function that draws the route from Roedbyhavn to the
    address, where the track is. */
function calcRouteFromRoedby() {
    // First we check if another route is currently showing
    if (routeFromGedserShowing || customRouteShowing) {

        // And if it is, we do nothing more here.
        alert('Please hide any other directions you have active.');
        return;

        // And if not, we continue
    } else {

        // First we check that the route is not showing.
        if (!routeFromRoedbyShowing) {

            // Next we check if the directionDisplays map is set to null
            if (directionsDisplay.map === null) {

                /*  If it is, we assign it our map, and we set
                    and we set the step by step guide to our html
                    directions panel. */
                directionsDisplay.setMap(map);
                directionsDisplay.setPanel(document.getElementById('directionsPanel'));
            }

            //  Next, we create the request for the directions service.
            var request = {
                origin: { lat: 54.656134, lng: 11.355690 }, // We give it the origin of our trip.
                destination: originalCenter, // The destination, set to the center of our map.
                travelMode: 'DRIVING' // And the travel mode. We set this for driving as default.
            };

            /*  Next we calculate the route. We call the route function on the directions service,
                and pass it the request we just created. This function also take a function
                as a parameter. This function is defined right away and is passed a result, and
                a status. These both come from the route function.  */
            this.directionsService.route(request, function (result, status) {

                /*  We check if the returned status is equal to 'OK', which it should
                    be as long as we pass it a legitimate origin and destination. */
                if (status === 'OK') {

                    /*  And assuming all is alright, we set the directions returned by
                        the service to our DirectionsRenderer variable. */
                    directionsDisplay.setDirections(result);
                }
            });

            // We then set the routeFromRoedbyShowing variable to true, as it is now showing.
            routeFromRoedbyShowing = true;

            // We change to content of the button to hide instead of show.
            document.getElementById('toggleRouteFromRoedbyHavnButton').value = "Hide Route";

            // We change the width of the map, so it no longer takes up the whole screen.
            document.getElementById('map').style.width = "70%";

            // And where the map was, we plop in our step by step directions panel.
            document.getElementById('directionsPanel').style.width = "30%";

            // And else, if the routeFromRoedbyhavnShowing varible is true.
        } else {

            // We set the step by step panel display to null
            directionsDisplay.setPanel(null);

            // We set the map to null. This will prevent the route being drawn.
            directionsDisplay.setMap(null);

            // We set the boolean back to false, as the route is no longer showing.
            routeFromRoedbyShowing = false;

            // Change up the text of the button, back to show from hide.
            document.getElementById('toggleRouteFromRoedbyHavnButton').value = "Show Route From Roedbyhavn";

            // We set the map back to 100% width
            document.getElementById('map').style.width = "100%";

            // And set the step by step panels width to 0%, effectively hiding it, until it is needed.
            document.getElementById('directionsPanel').style.width = "0%";

            /*  And just for good measure, we pan back to our originalCenter and
                zoom back in. */

            $.when(map.panTo(originalCenter)).done(smoothZoom(map, 14, map.getZoom(), true));
        }
    }
}

/*  We then need another default route. This one is from Gedser. The basic code is the same,
    so... No duplicate comments. */
function calcRouteFromGedser() {
    if (routeFromRoedbyShowing || customRouteShowing) {
        alert('Please hide any other directions you have active.');
    } else {
        if (!routeFromGedserShowing) {
            if (directionsDisplay.map === null) {
                directionsDisplay.setMap(map);
                directionsDisplay.setPanel(document.getElementById('directionsPanel'));
            }
            var request = {
                origin: { lat: 54.573716, lng: 11.926726 },
                destination: originalCenter,
                travelMode: 'DRIVING',
            }
            directionsService.route(request, function (result, status) {
                if (status === 'OK') {
                    directionsDisplay.setDirections(result);
                }
            });
            routeFromGedserShowing = true;
            document.getElementById('toggleRouteFromGedserButton').value = "Hide route";
            document.getElementById('map').style.width = '70%';
            document.getElementById('directionsPanel').style.width = '30%';

        } else {
            directionsDisplay.setPanel(null);
            directionsDisplay.setMap(null);
            routeFromGedserShowing = false;
            document.getElementById('toggleRouteFromGedserButton').value = "Show Route From Gedser";
            document.getElementById('map').style.width = '100%';
            document.getElementById('directionsPanel').style.width = "0%";
            $.when(map.panTo(originalCenter)).done(smoothZoom(map, 14, map.getZoom(), true));
        }
    }
}

/*  Now, setting up the custom route option. We want to take an input from the user
    and show a route based on where they are. This is basically gonna work like 
    the other route functions, so I'm not going to flood this in comments. Only
    the relevant parts will be commented upon. */
function calcCustomRoute() {
    if (routeFromGedserShowing || routeFromRoedbyShowing) {
        alert('Please hide any other directions you have active.');
        return;

        /*  We need to check whether the user has input anything in the search
            field, to ensure we are not sending an empty request. */
    } else if (document.getElementById('inputCustomRouteTextField').value === '') {
        alert('You have to input your travel origin.');
        return;
    } else {
        if (!customRouteShowing) {
            if (directionsDisplay.map === null) {
                directionsDisplay.setMap(map);
                directionsDisplay.setPanel(document.getElementById('directionsPanel'));
            }
            var request = {

                /*  Instead of passing a LatLng position, we are doing a text input.
                    Don't know if this works yet, so this may go. */
                origin: document.getElementById('inputCustomRouteTextField').value,
                destination: originalCenter,
                travelMode: 'DRIVING',
            }
            directionsService.route(request, function (result, status) {
                if (status === 'OK') {
                    directionsDisplay.setDirections(result);
                }
            });
            customRouteShowing = true;
            document.getElementById('searchCustomRouteButton').value = "Hide Route";
            document.getElementById('map').style.width = "70%";
            document.getElementById('directionsPanel').style.width = "30%";
        } else {
            directionsDisplay.setPanel(null);
            directionsDisplay.setMap(null);
            customRouteShowing = false;
            document.getElementById('searchCustomRouteButton').value = "Show Route From Searched Location";
            document.getElementById('map').style.width = '100%';
            document.getElementById('directionsPanel').style.width = "0%";
            $.when(map.panTo(originalCenter)).done(smoothZoom(map, 14, map.getZoom(), true));
            document.getElementById('inputCustomRouteTextField').value = '';
        }
    }
}