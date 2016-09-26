var domain = 'http://localhost:52821';
var api = '/api/Posto';
var defaultLat = -23.5655317;
var defaultLng = -46.6546707;
var defaultZomm = 10;

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: defaultLat, lng: defaultLng},
        scrollwheel: true,
        zoomControl: true,
        scaleControl: true,       
        zoom: defaultZomm,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            mapTypeIds: [
                google.maps.MapTypeId.ROADMAP,
                google.maps.MapTypeId.TERRAIN
            ]
        }
    });

    getGeolocation(map);

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

            marker.addListener('click', function() {
                setInfoWindowContent(posto.Id, map, marker);
            });
        });
    });
}

function setInfoWindowContent(postoId, map, marker) {

    $.getJSON(domain + api, function(jsonResponse) {
        $.each(jsonResponse, function(key, posto) {
            var infoWindow = new google.maps.InfoWindow({
                content: configureInfoWindowLayout(posto)
            });

            infoWindow.open(map, marker);
        });
    });
}

function configureInfoWindowLayout(posto) {
    return  '<div id="content">' +
                '<div id="siteNotice"></div>' +
                '<h1 id="firstHeading" class="firstHeading">' + posto.Nome + '</h1>' +
                '<div id="bodyContent">' +
                    '<p>Bandeira: <b>' + posto.Bandeira + '</b></p>' +
                    '<p>Tipo: <b>' + posto.Tipo + '</b></p>' +
                    '<p>Endereço: ' + posto.Endereco + ', ' + posto.Cidade + ', ' + posto.Bairro + ', ' + posto.Estado +'</p>' +                    
                    '<p>Penalidades: <ul>' + posto.Penalidades.forEach(function(penalidade) {
                        '<li>' + penalidade.Data + '</li>'
                        '<li>' + penalidade.Descricao + '</li>'
                        '<li>' + penalidade.Tipo + '</li>'
                    }) +
                    '</ul></p>' +
                '</div>' +
            '</div>';
}

function getGeolocation(map) {
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
}