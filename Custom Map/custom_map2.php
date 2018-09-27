<?php
/*
Plugin Name: Custom Google Maps Plugin
Plugin Uri: N/A
description: A custom made Google Maps plugin, for showing directions and nearby locations.
Version: 1.0
Author: CCK Web & IT IVS
Author URI: https://www.cck-webogit.dk/
License: GPL 3
 */

function showMap()
{
    ?>
<html>
<head>
    <!-- Site title -->
    <title>Another Map Test</title>

    <!-- Meta data for the site -->
    <meta name="viewport" content="initial-scale=1.0">
    <meta charset="utf-8">

    <style>
    #map {
        height: 950px;
        width: 100%;
    }

    html,
    body {
        height: 100%;
        margin: 0;
        padding: 0;
    }

    #floating-panel {
        position: absolute;
        top: 10px;
        left: 25%;
        z-index: 5;
        background-color: #fff;
        padding: 5px;
        border: 1px solid #999;
        text-align: center;
        font-family: 'Roboto', 'sans-serif';
        line-height: 30px;
        padding-left: 10px;
    }
</style>
</head>

<body>
    <!-- Declaring a div to hold the different buttons, that will toggle the markers. -->
    <div id="floating-panel">

        <!-- Declaring the different buttons, for hiding and showing the markers. We will be using-->
        <!-- boolean values to check whether or not the markers are currently showing.  -->
        <input id="toggleSuperMarketButton" onclick="toggleSuperMarketMarkers();" type="button" value="Show Supermarkets">
        <input id="toggleHotelButton" onclick="toggleHotelMarkers();" type="button" value="Show Hotels">
        <input id="toggleGasStationButton" onclick="toggleGasStationMarkers();" type="button" value="Show Gas Stations">
        <br />
        <!-- The buttons for showing the predefined routes.  -->
        <input id="toggleRouteFromRoedbyHavnButton" onclick="calcRouteFromRoedby();" type="button" value="Show Route From Roedbyhavn">
        <input id="toggleRouteFromGedserButton" onclick="calcRouteFromGedser();" type="button" value="Show Route From Gedser">

        <!-- Creating a textfield, for entering and searching for a custom route -->
        <br />
        <input id="inputCustomRouteTextField" type="text" placeholder="Where are you...">
        <input id="searchCustomRouteButton" type="button" onclick="calcCustomRoute();" value="Show Other Route">
    </div>

    <!-- This is the panel for showing the step by step directions -->
    <div id="directionsPanel" style="float:right;width:0%;height:100%;"></div>

    <!-- Declaring a div to hold the map -->
    <div id="map" style="float:left;width:100%; height:100%"></div>
    <script>
        // This is the entire javascript, minified. This is to get it working as a plugin for WP.
        var directionsService,directionsDisplay,originalCenter,map,infowindow,placesService,superMarketsShowing=!1,hotelsShowing=!1,gasStationsShowing=!1,routeFromRoedbyShowing=!1,routeFromGedserShowing=!1,customRouteShowing=!1,superMarketMarkers=[],hotelsMarkers=[],gasStationMarkers=[];function initMap(){directionsService=new google.maps.DirectionsService,directionsDisplay=new google.maps.DirectionsRenderer,originalCenter={lat:55.077326,lng:11.822575},this.map=new google.maps.Map(document.getElementById("map"),{center:originalCenter,zoom:12,mapTypeId:"terrain"}),directionsDisplay.setMap(map),directionsDisplay.setPanel(document.getElementById("directionsPanel")),placesService=new google.maps.places.PlacesService(this.map);var e=new google.maps.Marker({map:this.map,position:originalCenter,animation:google.maps.Animation.DROP});function t(e,t){if(t===google.maps.places.PlacesServiceStatus.OK)for(var o=0;o<e.length;o++)createSuperMarketMarker(e[o]);else console.log("Something went wrong!")}function o(e,t){if(t===google.maps.places.PlacesServiceStatus.OK)for(var o=0;o<e.length;o++)createHotelMarkers(e[o]);else console.log("Something went wrong!")}function n(e,t){if(t===google.maps.places.PlacesServiceStatus.OK)for(var o=0;o<e.length;o++)createGasStationMarkers(e[o]);else console.log("Something went wrong!")}infowindow=new google.maps.InfoWindow,google.maps.event.addListener(e,"click",function(){infowindow.setContent("<div style='text-align: center;'>CK Racing Event<br/>Hanebjergvej 1<br/>4760 Vordingborg</div>"),infowindow.open(this.map,this)}),function(){placesService.textSearch({location:this.map.getCenter(),radius:"500",query:"supermarked"},t)}(),placesService.textSearch({location:map.getCenter(),radius:"500",query:"hotel"},o),function(){placesService.textSearch({location:this.map.getCenter(),radius:"500",query:"gasstation"},n)}()}function createSuperMarketMarker(e){var t=new google.maps.Marker({map:null,position:e.geometry.location,icon:{url:"../../wp-content/plugins/custom_map_2/shopping-cart.svg",scaledSize:new google.maps.Size(50,50)},animation:google.maps.Animation.DROP});superMarketMarkers.push(t);var o=e.photos[0].getUrl({maxWidth:200,maxHeight:200});google.maps.event.addListener(t,"click",function(){$.when(slowPanTo(map,t.getPosition(),10,200)).done(smoothZoom(this.map,16,this.map.getZoom(),!0)),infowindow.setContent("<div style='text-align: center;'>"+e.name+"<br/>"+e.formatted_address+"<br/><br/><img src='"+o+"'/></div"),infowindow.open(map,this)}),google.maps.event.addListener(infowindow,"closeclick",function(){$.when(map.panTo(originalCenter)).done(smoothZoom(map,12,map.getZoom(),!1))})}function createHotelMarkers(e){var t=new google.maps.Marker({map:null,position:e.geometry.location,icon:{url:"../../wp-content/plugins/custom_map_2/slumber.svg",scaledSize:new google.maps.Size(50,50)},animation:google.maps.Animation.DROP});hotelsMarkers.push(t);var o=e.photos[0].getUrl({maxWidth:200,maxHeight:200});google.maps.event.addListener(t,"click",function(){$.when(slowPanTo(map,t.getPosition(),10,200)).done(smoothZoom(this.map,16,this.map.getZoom(),!0)),infowindow.setContent("<div style='text-align: center;'>"+e.name+"<br/>"+e.formatted_address+"<br/><br/><img src='"+o+"'/></div"),infowindow.open(map,this)}),google.maps.event.addListener(infowindow,"closeclick",function(){$.when(map.panTo(originalCenter)).done(smoothZoom(map,12,map.getZoom(),!1))})}function createGasStationMarkers(e){var t=new google.maps.Marker({map:null,position:e.geometry.location,icon:{url:"../../wp-content/plugins/custom_map_2/gas-station.svg",scaledSize:new google.maps.Size(50,50)},animation:google.maps.Animation.DROP});gasStationMarkers.push(t),google.maps.event.addListener(t,"click",function(){$.when(slowPanTo(map,t.getPosition(),10,200)).done(smoothZoom(this.map,16,this.map.getZoom(),!0)),infowindow.setContent("<div style='text-align: center;'>"+e.name+"<br />"+e.formatted_address+"<br/><br/><img src='"+e.photos[0].getUrl({maxWidth:200,maxHeight:200})+"'></div>"),infowindow.open(map,this)}),google.maps.event.addListener(infowindow,"closeclick",function(){$.when(map.panTo(originalCenter)).done(smoothZoom(map,12,map.getZoom(),!1))})}function toggleSuperMarketMarkers(){if(this.superMarketsShowing){for(e=0;e<superMarketMarkers.length;e++)superMarketMarkers[e].setMap(null);superMarketsShowing=!1,document.getElementById("toggleSuperMarketButton").value="Show Supermarkets"}else{for(var e=0;e<superMarketMarkers.length;e++)superMarketMarkers[e].setMap(this.map),superMarketMarkers[e].setAnimation(google.maps.Animation.DROP);superMarketsShowing=!0,document.getElementById("toggleSuperMarketButton").value="Hide Supermarkets"}}function toggleHotelMarkers(){if(this.hotelsShowing){for(e=0;e<hotelsMarkers.length;e++)hotelsMarkers[e].setMap(null);hotelsShowing=!1,document.getElementById("toggleHotelButton").value="Show Hotels"}else{for(var e=0;e<hotelsMarkers.length;e++)hotelsMarkers[e].setMap(this.map),hotelsMarkers[e].setAnimation(google.maps.Animation.DROP);hotelsShowing=!0,document.getElementById("toggleHotelButton").value="Hide Hotels"}}function toggleGasStationMarkers(){if(this.gasStationsShowing){for(e=0;e<gasStationMarkers.length;e++)gasStationMarkers[e].setMap(null);gasStationsShowing=!1,document.getElementById("toggleGasStationButton").value="Show Gas Stations"}else{for(var e=0;e<gasStationMarkers.length;e++)gasStationMarkers[e].setMap(this.map),gasStationMarkers[e].setAnimation(google.maps.Animation.DROP);gasStationsShowing=!0,document.getElementById("toggleGasStationButton").value="Hide Gas Stations"}}async function smoothZoom(e,t,o,n){if(1==n){if(o>=t)return;var i=google.maps.event.addListener(e,"zoom_changed",function(n){google.maps.event.removeListener(i),smoothZoom(e,t,o+1,!0)});setTimeout(function(){e.setZoom(o)},80)}else{if(o<=t)return;i=google.maps.event.addListener(e,"zoom_changed",function(n){google.maps.event.removeListener(i),smoothZoom(e,t,o-1,!1)});setTimeout(function(){e.setZoom(o)},80)}}function slowPanTo(e,t,o,n){var i,a,s,r,l,m,g,d,u,c,p,h,w;for(a=function(e){return parseFloat(e)/o},w=e.getCenter(),m=t.lat()-w.lat(),u=t.lng()-w.lng(),g=a(m),c=a(u),l=[],d=[],s=r=1,h=o;r<=h;s=r+=1)l.push(e.getCenter().lat()+s*g),d.push(e.getCenter().lng()+s*c);return i=function(e,t,i){return parseFloat(n)/o},(p=function(t){if(t<l.length)return setTimeout(function(){return e.panTo(new google.maps.LatLng({lat:l[t],lng:d[t]})),p(t+1)},i(0,0,l.length))})(0)}function calcRouteFromRoedby(){if(routeFromGedserShowing||customRouteShowing)alert("Please hide any other directions you have active.");else if(routeFromRoedbyShowing)directionsDisplay.setPanel(null),directionsDisplay.setMap(null),routeFromRoedbyShowing=!1,document.getElementById("toggleRouteFromRoedbyHavnButton").value="Show Route From Roedbyhavn",document.getElementById("map").style.width="100%",document.getElementById("directionsPanel").style.width="0%",$.when(map.panTo(originalCenter)).done(smoothZoom(map,14,map.getZoom(),!0));else{null===directionsDisplay.map&&(directionsDisplay.setMap(map),directionsDisplay.setPanel(document.getElementById("directionsPanel")));var e={origin:{lat:54.656134,lng:11.35569},destination:originalCenter,travelMode:"DRIVING"};this.directionsService.route(e,function(e,t){"OK"===t&&directionsDisplay.setDirections(e)}),routeFromRoedbyShowing=!0,document.getElementById("toggleRouteFromRoedbyHavnButton").value="Hide Route",document.getElementById("map").style.width="70%",document.getElementById("directionsPanel").style.width="30%"}}function calcRouteFromGedser(){if(routeFromRoedbyShowing||customRouteShowing)alert("Please hide any other directions you have active.");else if(routeFromGedserShowing)directionsDisplay.setPanel(null),directionsDisplay.setMap(null),routeFromGedserShowing=!1,document.getElementById("toggleRouteFromGedserButton").value="Show Route From Gedser",document.getElementById("map").style.width="100%",document.getElementById("directionsPanel").style.width="0%",$.when(map.panTo(originalCenter)).done(smoothZoom(map,14,map.getZoom(),!0));else{null===directionsDisplay.map&&(directionsDisplay.setMap(map),directionsDisplay.setPanel(document.getElementById("directionsPanel")));var e={origin:{lat:54.573716,lng:11.926726},destination:originalCenter,travelMode:"DRIVING"};directionsService.route(e,function(e,t){"OK"===t&&directionsDisplay.setDirections(e)}),routeFromGedserShowing=!0,document.getElementById("toggleRouteFromGedserButton").value="Hide route",document.getElementById("map").style.width="70%",document.getElementById("directionsPanel").style.width="30%"}}function calcCustomRoute(){if(routeFromGedserShowing||routeFromRoedbyShowing)alert("Please hide any other directions you have active.");else if(""!==document.getElementById("inputCustomRouteTextField").value)if(customRouteShowing)directionsDisplay.setPanel(null),directionsDisplay.setMap(null),customRouteShowing=!1,document.getElementById("searchCustomRouteButton").value="Show Route From Searched Location",document.getElementById("map").style.width="100%",document.getElementById("directionsPanel").style.width="0%",$.when(map.panTo(originalCenter)).done(smoothZoom(map,14,map.getZoom(),!0)),document.getElementById("inputCustomRouteTextField").value="";else{null===directionsDisplay.map&&(directionsDisplay.setMap(map),directionsDisplay.setPanel(document.getElementById("directionsPanel")));var e={origin:document.getElementById("inputCustomRouteTextField").value,destination:originalCenter,travelMode:"DRIVING"};directionsService.route(e,function(e,t){"OK"===t&&directionsDisplay.setDirections(e)}),customRouteShowing=!0,document.getElementById("searchCustomRouteButton").value="Hide Route",document.getElementById("map").style.width="70%",document.getElementById("directionsPanel").style.width="30%"}else alert("You have to input your travel origin.")}
    </script>
</body>

<!-- Outside scripts needed for this to run. We are using the Google Maps JavaScript API. In this link -->
    <!-- our generated API key is included. After that, we also append that we need to use the places library. -->
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCytAmZwbPJuLx3mCsStL7hRjB4XBX8-YM&callback=initMap&libraries=places"
        async defer></script>

    <!-- We need to import jQuery as well, as we are doing a wait function. This is necessary, because everything with maps -->
    <!-- is running asynchronous, and there are things we need to finish before doing other things. This will happen later in the code. -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.js"></script>
</html>

    <?php
}
add_shortcode('test', 'showMap');
?>