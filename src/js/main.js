ymaps.ready(init);

function init() {
  var myMap = new ymaps.Map("map", {

    center: [48.872185, 2.354224],
    zoom: 15
  });

  var myPlacemark = new ymaps.Placemark([48.872185, 2.354224], {}, {
    iconLayout: 'default#image',
    iconImageHref: './img/map-icon.png',
    iconImageSize: [50, 72],
    iconImageOffset: [-6, -42]
  });

  myMap.geoObjects.add(myPlacemark);
}


