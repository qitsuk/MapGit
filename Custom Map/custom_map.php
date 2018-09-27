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

    <!-- Outside scripts needed for this to run. We are using the Google Maps JavaScript API. In this link -->
    <!-- our generated API key is included. After that, we also append that we need to use the places library. -->
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCytAmZwbPJuLx3mCsStL7hRjB4XBX8-YM&callback=initMap&libraries=places"
        async defer></script>

    <!-- We need to import jQuery as well, as we are doing a wait function. This is necessary, because everything with maps -->
    <!-- is running asynchronous, and there are things we need to finish before doing other things. This will happen later in the code. -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.js"></script>
    <script src="\wordpress\wp-content\plugins\custom_map\map_src.js"></script>
    <link rel="stylesheet" type="text/css" href="\wordpress\wp-content\plugins\custom_map\style.css">


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
</body>
</html>

    <?php
}
add_shortcode('test', 'showMap');
?>