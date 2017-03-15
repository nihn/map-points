/**
 * Show error msg on top of the page
 */
function showEror(msg) {
  console.log('ERROR: ' + msg);
  document.getElementById('error').innerHTML = msg;
}

/**
 * Hide previously shown error msg from top of the page
 */
function hideError() {
    document.getElementById('error').innerHTML = '';
}

/**
 * Initialize google map control
 */
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: window.MAP_CENTER
  });
  google.maps.event.addListener(map, 'click', function(event) {
    clickCallback(event.latLng);
  });
  refreshFusionLayer();
  return map
}


/**
Do insert and handle result
 */
function doInsert(data) {
  api.insert(data, function () {
    refreshFusionLayer();
    mapPointsTable.addRow(data.address, data.lng, data.lat);
    NProgress.done();
  }, function () {
    NProgress.done();
  });
}

function clickCallback(location) {
  NProgress.start();
  geocoder.geocode({
    'latLng': location
    }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      // Only process records with "street_address" included.
      if (results[0] && results[0].types[0] == 'street_address') {
        hideError();
        console.log('Got response: ', results);
        doInsert({
          lng: location.lng(),
          lat: location.lat(),
          address: results[0].formatted_address
        });
      }
      else {
        NProgress.done();
        showEror('Failed to get exact address');
      }
    }
    else {
      NProgress.done();
      console.log("Invalid Geocoder status: %s", status)
    }
  });
}

/**
 * Reset page along with its database and google fusion tables
 */
function reset() {
  console.log('Resetting');
  NProgress.start();
  api.flush(function() {
    refreshFusionLayer();
    mapPointsTable.flush();
    NProgress.done();
  }, function () {
    NProgress.done();
  });
}

/**
 Create new FushionTableLayer with random where condition to be sure that
 layer in refreshed.
 */
function refreshFusionLayer() {
  fusionLayer && fusionLayer.setMap(null);
  fusionLayer = new google.maps.FusionTablesLayer({
    query: {
      select: "'Address'",
      from: window.FUSION_TABLE_ID,
      where: "location not equal to " + (-1 * Math.random() * 10000000).toString()
    },
    map: map
  });
}

window.onerror = function() {
    NProgress.done();
};


// Handle requests which was done with unauthenticated session
var oldPost = localStorage.getItem('post');
if (oldPost) {
  localStorage.removeItem('post');
  doInsert(JSON.parse(oldPost));
}

if (localStorage.getItem('delete')) {
  reset();
  localStorage.removeItem('delete');
}

var fusionLayer;
var geocoder = new google.maps.Geocoder();
var map = initMap();
