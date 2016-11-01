var domain = 'http://localhost:52821';
var api = '/api/Posto';
var defaultLat = -23.5655317;
var defaultLng = -46.6546707;
var defaultZomm = 10;

var shortDateFormat = 'dd/MM/yyyy';

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

    $.getJSON(domain + api + '/' + postoId, function(jsonResponse) {
        var infoWindow = new google.maps.InfoWindow({
            content: configureInfoWindowLayout(jsonResponse)
        });

        infoWindow.open(map, marker);
    });
}

function configureInfoWindowLayout(posto) {

    var penalidadesContent = '<ul>';

    for (pen of posto.Penalidades) {
        penalidadesContent += '<li><b>Data: </b>' + $.format.date(pen.Data, shortDateFormat) + '</li>' +
                             '<li><b>Descrição: </b>' + pen.Descricao + '</li>' +
                             '<li><b>Tipo: </b>' + pen.Tipo + '</li>' + 
                             '<br />'
    }

    penalidadesContent += '</ul>';

    return  '<div id="infoWindowContent">' +
                '<h2 id="postoNome" class="postoNome">' + posto.Nome + '</h2>' +
                '<div id="infoWindowBodyContent">' +
                    '<p><b>Bandeira: </b>' + posto.Bandeira + '</p>' +
                    '<p><b>Tipo: </b>' + posto.Tipo + '</p>' +
                    '<p><b>Data cadastro: </b>' + $.format.date(posto.DataCadastro, shortDateFormat) + '</p>' +
                    '<p><b>Endereço: </b>' + posto.Endereco + ', ' + posto.Cidade + ', ' + posto.Bairro + ', ' + posto.Estado +'</p>' +                    
                    '<p><b>Penalidades: </b>' + penalidadesContent + '</p>' +
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