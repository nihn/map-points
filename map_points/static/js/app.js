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
      center: { lat: 47.37, lng: 8.54 }
  });
  google.maps.event.addListener(map, 'click', function(event) {
    clickCallback(event.latLng);
  });
  return map
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
        fusionTable.insert(results[0], location).then(function(res) {
          if (res.status === 200) {
            var data = {
              lng: location.lng(),
              lat: location.lat(),
              address: results[0].formatted_address
            };

            fusionTable.refresh(map);
            api.insert(data);
            mapPointsTable.addRow(data.address, data.lng, data.lat)
          }
          else {
            console.log('Got ' + res.status + 'from Fusion Tables API');
          }
          NProgress.done();
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
  api.flush();

  fusionTable.flush().then(function (res) {
    if (res.status === 200) {
      console.log('Fusion table flushed');
      fusionTable.refresh(map);
      mapPointsTable.flush();
    }
    else {
      console.log('Failed to flush Fusion table')
    }
    NProgress.done();
  });
}

var geocoder = new google.maps.Geocoder();
var map = initMap();
fusionTable.refresh(map);
