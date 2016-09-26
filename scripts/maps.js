var domain = 'http://postoseguro.azurewebsites.net';
var api = '/api/Posto';

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -23.6815315, lng: -46.8754831},
        scrollwheel: true,
        zoomControl: true,
        scaleControl: true,       
        zoom: 15,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            mapTypeIds: [
                google.maps.MapTypeId.ROADMAP,
                google.maps.MapTypeId.TERRAIN
            ]
        }
    });

    //var infowindow = new google.maps.InfoWindow();

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
       
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            map.setCenter(pos);
        }, function() {
            //handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        //handleLocationError(false, infoWindow, map.getCenter());
    }

    getPostos(map);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ? 'Erro: Falha ao obter localização.' : 'Erro: Browser não suporta geolocalização.');
}

function getPostos(map) {
    $.getJSON(domain + api, function(jsonResponse) {
        $.each(jsonResponse, function(key, posto) {

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(posto.Lat, posto.Lng),
                map: map,
                title: posto.Nome
            });
        });
    });
}