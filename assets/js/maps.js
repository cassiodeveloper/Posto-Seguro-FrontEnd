"use strict";
var $ = jQuery.noConflict();

var mapStyles = [ {"featureType":"road","elementType":"labels","stylers":[{"visibility":"simplified"},{"lightness":20}]},{"featureType":"administrative.land_parcel","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"transit","elementType":"all","stylers":[{"saturation":-100},{"visibility":"on"},{"lightness":10}]},{"featureType":"road.local","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"road.local","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":50}]},{"featureType":"water","elementType":"all","stylers":[{"hue":"#a1cdfc"},{"saturation":30},{"lightness":49}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"hue":"#f49935"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"hue":"#fad959"}]}, {featureType:'road.highway',elementType:'all',stylers:[{hue:'#dddbd7'},{saturation:-92},{lightness:60},{visibility:'on'}]}, {featureType:'landscape.natural',elementType:'all',stylers:[{hue:'#c8c6c3'},{saturation:-71},{lightness:-18},{visibility:'on'}]},  {featureType:'poi',elementType:'all',stylers:[{hue:'#d9d5cd'},{saturation:-70},{lightness:20},{visibility:'on'}]} ];

var $body = $('body');
if( $body.hasClass('map-fullscreen') ) {
    if( $(window).width() > 768 ) {
        $('.map-canvas').height( $(window).height() - $('.header').height() );
    }
    else {
        $('.map-canvas #map').height( $(window).height() - $('.header').height() );
    }
}

function createHomepageGoogleMap(_latitude, _longitude, json){
    $.get("assets/external/_infobox.js", function() {
        gMap();
    });
    function gMap(){
        var mapCenter = new google.maps.LatLng(_latitude,_longitude);
        var mapOptions = {
            zoom: 11,
            center: mapCenter,
            disableDefaultUI: false,
            scrollwheel: true,
            styles: mapStyles,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.BOTTOM_CENTER
            },
            panControl: true,
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.LARGE,
                position: google.maps.ControlPosition.RIGHT_TOP
            }
        };

        var mapElement = document.getElementById('map');
        var map = new google.maps.Map(mapElement, mapOptions);
        var newMarkers = [];
        var markerClicked = 0;
        var activeMarker = false;
        var lastClicked = false;

        for (var i = 0; i < json.length; i++) {

            json[i].index = i;

            if( json[i].color ) 
                var color = json[i].color;
            else 
                color = '';

            var markerContent = document.createElement('DIV');
            
            if( json[i].featured && json[i].featured == 1 ) {
                markerContent.innerHTML =
                    '<div class="map-marker featured' + color + '">' +
                        '<div class="icon">' +
                        '<img src="assets/icons/transportation/road-transportation/fillingstation.png">' +
                        '</div>' +
                    '</div>';
            }
            else {
                markerContent.innerHTML =
                    '<div class="map-marker ' + json[i].color + '">' +
                        '<div class="icon">' +
                        '<img src="assets/icons/transportation/road-transportation/fillingstation.png">' +
                        '</div>' +
                    '</div>';
            }

            var marker = new RichMarker({
                position: new google.maps.LatLng( json[i].Lat, json[i].Lng ),
                map: map,
                draggable: false,
                content: markerContent,
                flat: true
            });

            newMarkers.push(marker);

            var infoboxContent = document.createElement("div");
            
            var infoboxOptions = {
                content: infoboxContent,
                disableAutoPan: false,
                pixelOffset: new google.maps.Size(-18, -42),
                zIndex: null,
                alignBottom: true,
                boxClass: "infobox",
                enableEventPropagation: true,
                closeBoxMargin: "0px 0px -30px 0px",
                closeBoxURL: "assets/img/close.png",
                infoBoxClearance: new google.maps.Size(1, 1)
            };

            var category = json[i].category;
            infoboxContent.innerHTML = drawInfobox(category, infoboxContent, json, i);

            newMarkers[i].infobox = new InfoBox(infoboxOptions);

            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    google.maps.event.addListener(map, 'click', function(event) {
                        lastClicked = newMarkers[i];
                    });
                    activeMarker = newMarkers[i];
                    if( activeMarker != lastClicked ){
                        for (var h = 0; h < newMarkers.length; h++) {
                            newMarkers[h].content.className = 'marker-loaded';
                            newMarkers[h].infobox.close();
                        }
                        newMarkers[i].infobox.open(map, this);
                        newMarkers[i].infobox.setOptions({ boxClass:'fade-in-marker'});
                        newMarkers[i].content.className = 'marker-active marker-loaded';
                        markerClicked = 1;
                    }
                }
            })(marker, i));

            google.maps.event.addListener(newMarkers[i].infobox, 'closeclick', (function(marker, i) {
                return function() {
                    activeMarker = 0;
                    newMarkers[i].content.className = 'marker-loaded';
                    newMarkers[i].infobox.setOptions({ boxClass:'fade-out-marker' });
                }
            })(marker, i));
        }

        google.maps.event.addListener(map, 'click', function(event) {
            if( activeMarker != false && lastClicked != false ){
                if( markerClicked == 1 ){
                    activeMarker.infobox.open(map);
                    activeMarker.infobox.setOptions({ boxClass:'fade-in-marker'});
                    activeMarker.content.className = 'marker-active marker-loaded';
                }
                else {
                    markerClicked = 0;
                    activeMarker.infobox.setOptions({ boxClass:'fade-out-marker' });
                    activeMarker.content.className = 'marker-loaded';
                    setTimeout(function() {
                        activeMarker.infobox.close();
                    }, 350);
                }
                markerClicked = 0;
            }
            if( activeMarker != false ){
                google.maps.event.addListener(activeMarker, 'click', function(event) {
                    markerClicked = 1;
                });
            }
            markerClicked = 0;
        });

        var clusterStyles = [
            {
                url: 'assets/img/cluster.png',
                height: 34,
                width: 34
            }
        ];

        var markerCluster = new MarkerClusterer(map, newMarkers, { styles: clusterStyles, maxZoom: 19 });
        
        markerCluster.onClick = function(clickedClusterIcon, sameLatitude, sameLongitude) {
            return multiChoice(sameLatitude, sameLongitude, json);
        };

        google.maps.event.addListener(map, 'idle', function() {
            var visibleArray = [];

            for (var i = 0; i < json.length; i++) {
                if ( map.getBounds().contains(newMarkers[i].getPosition()) ){
                    visibleArray.push(newMarkers[i]);
                    
                    $.each( visibleArray, function (i) {
                        setTimeout(function(){
                            if ( map.getBounds().contains(visibleArray[i].getPosition()) ){
                                if( !visibleArray[i].content.className ){
                                    visibleArray[i].setMap(map);
                                    visibleArray[i].content.className += 'bounce-animation marker-loaded';
                                    markerCluster.repaint();
                                }
                            }
                        }, i * 50);
                    });
                } else {
                    newMarkers[i].content.className = '';
                    newMarkers[i].setMap(null);
                }
            }

            var visibleItemsArray = [];
            
            $.each(json, function(a) {
                if( map.getBounds().contains( new google.maps.LatLng( json[a].Lat, json[a].Lng ) ) ) {
                    var category = json[a].category;
                    pushItemsToArray(json, a, category, visibleItemsArray);
                }
            });

            $('.items-list .results').html( visibleItemsArray );

            $.each(json, function(a) {
                if( map.getBounds().contains( new google.maps.LatLng( json[a].Lat, json[a].Lng ) ) ) {
                    is_cached(json[a].gallery, a);
                }
            });

            rating('.results .item');

            var $singleItem = $('.results .item');
            
            $singleItem.hover(
                function(){
                    newMarkers[ $(this).attr('id') ].content.className = 'marker-active marker-loaded';
                },
                function() {
                    newMarkers[ $(this).attr('id') ].content.className = 'marker-loaded';
                }
            );
        });

        redrawMap('google', map);

        function is_cached(src, a) {
            var image = new Image();
            var loadedImage = $('.results li #' + json[a].index + ' .image');
            image.src = src;
            
            if( image.complete ){
                $(".results").each(function() {
                    loadedImage.removeClass('loading');
                    loadedImage.addClass('loaded');
                });
            }
            else {
                $(".results").each(function() {
                    $('.results li #' + json[a].index + ' .image').addClass('loading');
                });
                $(image).load(function(){
                    loadedImage.removeClass('loading');
                    loadedImage.addClass('loaded');
                });
            }
        }

        $('.geolocation').on("click", function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(success);
            } else {
                console.log('Geo Location is not supported');
            }
        });

        function success(position) {
            var locationCenter = new google.maps.LatLng( position.coords.latitude, position.coords.longitude);
            
            map.setCenter( locationCenter );
            map.setZoom(11);
			
			var markerContent = document.createElement('DIV');
			
            markerContent.innerHTML = '<div class="map-marker"><div class="icon"></div></div>';

			var marker = new RichMarker({
				position: locationCenter,
				map: map,
				draggable: false,
				content: markerContent,
				flat: true
			});

			marker.content.className = 'marker-loaded';

            var geocoder = new google.maps.Geocoder();
            
            geocoder.geocode({ "latLng": locationCenter}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var lat = results[0].geometry.location.lat(),
                        lng = results[0].geometry.location.lng(),
                        placeName = results[0].address_components[0].long_name,
                        latlng = new google.maps.LatLng(lat, lng);

                    $("#location").val(results[0].formatted_address);
                }
            });

        }

        // Autocomplete address ----------------------------------------------------------------------------------------

        var input = document.getElementById('location') ;
        
        var autocomplete = new google.maps.places.Autocomplete(input, {
            types: ["geocode"]
        });
        
        autocomplete.bindTo('bounds', map);

        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            var place = autocomplete.getPlace();
            
            if (!place.geometry) {
                return;
            }
            
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
                map.setZoom(14);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(14);
            }

            var address = '';

            if (place.address_components) {
                address = [
                    (place.address_components[0] && place.address_components[0].short_name || ''),
                    (place.address_components[1] && place.address_components[1].short_name || ''),
                    (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
            }
        });
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Item Detail Map - Google
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function itemDetailMap(json){
    var mapCenter = new google.maps.LatLng(json.latitude,json.longitude);
    var mapOptions = {
        zoom: 14,
        center: mapCenter,
        disableDefaultUI: true,
        scrollwheel: false,
        styles: mapStyles,
        panControl: false,
        zoomControl: false,
        draggable: true
    };
    var mapElement = document.getElementById('map-detail');
    var map = new google.maps.Map(mapElement, mapOptions);
    if( json.type_icon ) var icon = '<img src="' + json.type_icon +  '">';
    else icon = '';

    // Google map marker content -----------------------------------------------------------------------------------

    var markerContent = document.createElement('DIV');
    markerContent.innerHTML =
        '<div class="map-marker">' +
            '<div class="icon">' +
            icon +
            '</div>' +
        '</div>';

    // Create marker on the map ------------------------------------------------------------------------------------

    var marker = new RichMarker({
        position: new google.maps.LatLng( json.latitude, json.longitude ),
        map: map,
        draggable: false,
        content: markerContent,
        flat: true
    });

    marker.content.className = 'marker-loaded';
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Simple Google Map (contat, submit...)
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function simpleMap(_latitude, _longitude, draggableMarker){   
    var mapCenter = new google.maps.LatLng(_latitude, _longitude);
    var mapOptions = {
        zoom: 14,
        center: mapCenter,
        disableDefaultUI: true,
        scrollwheel: false,
        styles: mapStyles,
        panControl: false,
        zoomControl: false,
        draggable: true
    };
    var mapElement = document.getElementById('map-simple');
    var map = new google.maps.Map(mapElement, mapOptions);

    // Google map marker content -----------------------------------------------------------------------------------

    var markerContent = document.createElement('DIV');
    markerContent.innerHTML =
        '<div class="map-marker">' +
            '<div class="icon"></div>' +
        '</div>';

    // Create marker on the map ------------------------------------------------------------------------------------

    var marker = new RichMarker({
        //position: mapCenter,
        position: new google.maps.LatLng( _latitude, _longitude ),
        map: map,
        draggable: draggableMarker,
        content: markerContent,
        flat: true
    });

    marker.content.className = 'marker-loaded';
}

function pushItemsToArray(json, a, category, visibleItemsArray){
    var itemPrice;
    visibleItemsArray.push(
        '<li>' +
            '<div class="item" entityid="' + json[a].Id + '" id="' + json[a].index + '">' +
                '<div class="wrapper">' +
                    '<a href="#" id="' + json[a].index + '"><h3>' + json[a].Nome + '</h3></a>' +
                    '<figure>' + json[a].Bandeira + '</figure>' +
                    drawPrice(json[a].Penalidades.lenght) +
                    // '<div class="info">' +
                    //     '<div class="type">' +
                    //         '<i><img src="' + json[a].type_icon + '" alt=""></i>' +
                    //         '<span>' + json[a].type + '</span>' +
                    //     '</div>' +
                    //     '<div class="rating" data-rating="' + json[a].rating + '"></div>' +
                    // '</div>' +
                '</div>' +
            '</div>' +
        '</li>'
    );

    function drawPrice(lenght){
        if( lenght ){
            itemLenght = '<div class="price">' + lenght +  '</div>';
            return itemLenght;
        }
        else {
            return '';
        }
    }
}

function centerMapToMarker(){
    $.each(json, function(a) {
        if( json[a].index == id ) {
            var _latitude = json[a].Lat;
            var _longitude = json[a].Lng;
            var mapCenter = new google.maps.LatLng(_latitude,_longitude);
            map.setCenter(mapCenter);
        }
    });
}

function multiChoice(sameLatitude, sameLongitude, json) {
    var multipleItems = [];
    
    $.each(json, function(a) {
        if( json[a].latitude == sameLatitude && json[a].longitude == sameLongitude ) {
            pushItemsToArray(json, a, json[a].category, multipleItems);
        }
    });
    
    $('body').append('<div class="modal-window multichoice fade_in"></div>');
    
    $('.modal-window').load( 'assets/external/_modal-multichoice.html', function() {
        $('.modal-window .modal-wrapper .items').html( multipleItems );
        rating('.modal-window');
    });
    
    $('.modal-window .modal-background, .modal-close').live('click',  function(e){
        $('.modal-window').addClass('fade_out');
        setTimeout(function() {
            $('.modal-window').remove();
        }, 300);
    });
}

function animateOSMMarkers(map, loadedMarkers, json){
    var bounds = map.getBounds();
    var visibleItemsArray = [];
    var multipleItems = [];

    $.each( loadedMarkers, function (i) {
        if ( bounds.contains( loadedMarkers[i].getLatLng() ) ) {
            var category = json[i].category;
            pushItemsToArray(json, i, category, visibleItemsArray);

            setTimeout(function(){
                if( loadedMarkers[i]._icon != null ){
                    loadedMarkers[i]._icon.className = 'leaflet-marker-icon leaflet-zoom-animated leaflet-clickable marker-loaded';
                }
            }, i* 50);
        }
        else {
            if( loadedMarkers[i]._icon != null ){
                loadedMarkers[i]._icon.className = 'leaflet-marker-icon leaflet-zoom-animated leaflet-clickable';
            }
        }
    });

    $('.items-list .results').html( visibleItemsArray );

    rating('.results .item');

    $('.results .item').hover(
        function(){
            if( loadedMarkers[ $(this).attr('id') - 1 ]._icon ){
                loadedMarkers[ $(this).attr('id') - 1 ]._icon.className = 'leaflet-marker-icon leaflet-zoom-animated leaflet-clickable marker-loaded marker-active';
            }
        },
        function() {
            if( loadedMarkers[ $(this).attr('id') - 1 ]._icon ){
                loadedMarkers[ $(this).attr('id') - 1 ]._icon.className = 'leaflet-marker-icon leaflet-zoom-animated leaflet-clickable marker-loaded';
            }
        }
    );

}

// Redraw map after item list is closed --------------------------------------------------------------------------------

function redrawMap(mapProvider, map){
    $('.map .toggle-navigation').click(function() {
        $('.map-canvas').toggleClass('results-collapsed');
        $('.map-canvas .map').one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
            if( mapProvider == 'osm' ){
                map.invalidateSize();
            }
            else if( mapProvider == 'google' ){
                google.maps.event.trigger(map, 'resize');
            }
        });
    });
}