/* eslint-disable no-console */
(function(window, $){

    var map, geolocation, isLocated, myMarker, myAccuracy;
    var placeService, placeMarker, placesInfo = {};
    var $places, $placeInfo;
    var mapStarted = false;
    var refreshTime = 86400000 * 2;


    function setPlaces(element, place) {
        place = typeof place === 'string' ? JSON.parse(place).data : place.data;
        //- console.log(place)
        var placeId = place._id;
        placeMarker = new google.maps.Marker({
            'icon': {
                'url': place.icon,
                'scaledSize': new google.maps.Size(25, 25),
            },
            'position': {
                lat: place.lat,
                lng: place.lng
            },
            'map': map
        });
        placeMarker._id = placeId;
        placeMarker.addListener('click', function() {
            placeFocus(this._id);
        });

        placesInfo[placeId] = place;
        placesInfo[placeId].marker = placeMarker;

        element.attr('id', placeId);
        element.data('placeid', placeId);
        element.find('.rating').text(place.rating);
        if (place.photo) {
            element.children('.place-background').css({ 'background-image': 'url(' + place.photo + ')' });
        } else {
            element.children('.place-background').css({ 'background-image': 'url(/images/default.jpg)' });
        }
        element.click(function(){
            console.log(element, element.data(), element.data(placeId));
            placeFocus(element.data('placeid'));
        });
    }


    //- Buscar datos de lugares
    function findPlace(i) {

        var p = $('.place')[i];
        if(!p) { return false; }

        var that = $(p);
        var data = that.data();
        var identifier = data.identifier.replace(/[^a-zA-Z]/g, '');
        var localData = localStorage.getItem(identifier);
        if(localData) {
            localData = JSON.parse(localData);
            if(localData.time) {
                var diffTime = new Date().getTime() - new Date(localData.time).getTime();
                if(diffTime < refreshTime){
                    console.log(data.identifier, 'local', localData.time, diffTime < refreshTime);
                    setPlaces(that, localData);
                    return findPlace(++i);
                }
            }
        }
        placeService.findPlaceFromQuery({
            query: data.identifier,
            fields: ['place_id', 'photo', 'name', 'rating', 'opening_hours', 'geometry', 'icon']
        }, function(res, status) {
            console.log(data.identifier, 'cloud');
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                res = res[0];
                var placeData = JSON.stringify({
                    time: new Date(),
                    data: {
                        _id: res.place_id,
                        name: identifier,
                        icon: res.icon,
                        lat: res.geometry.location.lat(),
                        lng: res.geometry.location.lng(),
                        photo: res.photos[0].getUrl(),
                        rating: res.rating
                    }
                });
                //- console.log(identifier, placeData);
                setPlaces(that, placeData);
                localStorage.setItem(identifier, placeData);
                findPlace(++i);
            } else {
                console.log('getDetails: ', identifier, status)
                setTimeout(function(){
                    findPlace(i);
                }, 1000);
            }
        });
    }


    // eslint-disable-next-line no-unused-vars
    function placeDetails (t) {
        var data = $(t).closest('.place').data();
        placeService.getDetails({
            placeId: data.placeid,
            fields: ['place_id', 'website', 'formatted_phone_number', 'photos', 'formatted_address', 'name']
        }, function(res, status) {
            console.log(status, res, data)
            if (status == google.maps.places.PlacesServiceStatus.OK) {

                var images = '';
                if (res.photos && res.photos.length) {
                    (res.photos).forEach(function(img){
                        images += '<img class="image" src=" ' + img.getUrl() + ' "></img>';
                        $placeInfo.find('.scroll-images').width( (($(window).width() * 0.77) + 11) * res.photos.length );
                    });
                } else {
                    images += '<img class="image" src="/images/default.jpg"></img>';
                    $placeInfo.find('.scroll-images').width( (($(window).width() * 0.9) ));
                }

                $placeInfo
                    .find('.scroll-images')
                        .html(images)
                    .end()
                    .find('.info')
                        .text( (data.info && data.info.length && data.info !== 'undefined') ? data.info : '' )
                    .end()
                    .find('.name')
                        .text(res.name)
                    .end()
                    .find('.phone')
                        .attr('href', 'tel: ' + res.formatted_phone_number)
                        .find('span')
                            .text(res.formatted_phone_number)
                        .end()
                    .end()
                    .find('.web')
                        .attr('href', res.website)
                        //- .find('span')
                        //-     .text('Enlace')
                        //- .end()
                    .end()
                    .find('.address')
                        .attr('href', "http://maps.google.com/?q=" + res.name + ' ' + res.formatted_address)
                        .find('span')
                            .text(res.formatted_address)

                $placeInfo.show()
                gtag('event', 'place_interest', {
                    'event_category': 'visit',
                    'event_label': res.name,
                    'value': res.name,
                });
            } else {
                console.error('Place not found: ', data);
            }
        });
    }


    function placeFocus(placeid) {
        var icon;
        //- Set original state to all markers
        Object.keys(placesInfo).forEach(function(item){
            icon = placesInfo[item].marker.getIcon();
            placesInfo[item].marker.setIcon({
                'url': icon.url,
                'scaledSize': new google.maps.Size(25, 25)
            });
            placesInfo[item].marker.setZIndex(1);
        });

        var place = placesInfo[placeid];
        var item = $places.find('#' + placeid);
        if (item) {
            $places.animate({ scrollLeft: item.offset().left - item.parent().offset().left }, 500);
        }
        map.panTo({
            lat: place.lat,
            lng: place.lng
        });
        icon = place.marker.getIcon();
        place.marker.setIcon({
            'url': icon.url,
            'scaledSize': new google.maps.Size(50, 50)
        })
        place.marker.setZIndex(10);
    }


    // eslint-disable-next-line no-unused-vars
    window.gps = function() {
        if(geolocation) {
            navigator.geolocation.clearWatch(geolocation);
            if (myMarker) { myMarker.setMap(null); }
            if (myAccuracy) { myAccuracy.setMap(null); }
            isLocated = false;
        }
        geolocation = navigator.geolocation.watchPosition(function(position){
            var myPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            console.log('Position: ', myPos);
            if (!isLocated) {
                map.panTo(myPos);
                myMarker = new google.maps.Marker({
                    'icon': {
                        'path': google.maps.SymbolPath.CIRCLE,
                        'fillColor': '#4285F4',
                        'fillOpacity': 1,
                        'scale': 6,
                        'strokeColor': 'white',
                        'strokeWeight': 2,
                    },
                    'position': myPos,
                    'map': map
                });

                myAccuracy = new google.maps.Circle({
                    'strokeColor': '#4285F4',
                    'strokeWeight': 2,
                    'fillColor': '#4285F4',
                    'fillOpacity': 0.3,
                    'map': map,
                    'radius': position.coords.accuracy,
                    'center': myPos,
                });
                isLocated = true;
            } else {
                myAccuracy.setCenter(myPos);
                myMarker.setPosition(myPos);
            }
        }, function(err){
            console.error('Error: ', err)
            alert( 'Ups! parece que algo no va bien... ', err.code , ' - ' , err.message );
        }, { timeout: 5000 });
    }


    //- Iniciar mapa y su configuración
    // eslint-disable-next-line no-unused-vars
    window.initMap = function() {
        if(mapStarted){
            return;
        } else {
            mapStarted = true;
        }

        map = new google.maps.Map(document.getElementById('map'), {
            center: new google.maps.LatLng( 38.008700, -3.369500),
            disableDefaultUI: true,
            zoom: 16,
            mapTypeControlOptions: {
                mapTypeIds: ['styled_map']
            }
        });
        //Associate the styled map with the MapTypeId and set it to display.
        map.mapTypes.set('styled_map', new google.maps.StyledMapType([
            {
                "featureType": "poi",
                "elementType": "labels.text",
                "stylers": [
                {
                    "visibility": "off"
                }
                ]
            },
            {
                "featureType": "poi.business",
                "stylers": [
                {
                    "visibility": "off"
                }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [
                {
                    "visibility": "off"
                }
                ]
            },
            {
                "featureType": "transit",
                "stylers": [
                {
                    "visibility": "off"
                }
                ]
            }
        ]));
        map.setMapTypeId('styled_map');

        placeService = new google.maps.places.PlacesService(map);
        findPlace(0);
    }


    $('document').ready(function() {
        $places = $('#places');
        var $place  = $places.find('.place');
        $places.find('.scroll-places').width( ($place.length * ($place.outerWidth() + 10) ) + 2 );

        $placeInfo = $('#placeInfo');
        $placeInfo.find('.close').click(function(){
            $placeInfo.hide();
        });
        window.initMap();
        // google.maps.event.addListener(map, 'idle', function() {
        //     window.initMap();
        // });
    });


})(window, jQuery);
