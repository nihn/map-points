var fusionTable = (function() {

  var GoogleAuth;
  var fusionLayer;

  gapi.load('client', initClient);

  function initClient() {
    gapi.client.init({
      'apiKey': '9nTNjGRTuLHyJ6naMuCqZhB4',
      'clientId': '470880903788-7ek2u566pljnt5qfvd45e30hflacuiao.apps.googleusercontent.com',
      'scope': 'https://www.googleapis.com/auth/fusiontables'
    }).then(function () {
      GoogleAuth = gapi.auth2.getAuthInstance();
    });
  }

  /**
   Create new FushionTableLayer with random where condition to be sure that
   layer in refreshed.
   */
  function refresh(map) {
    fusionLayer && fusionLayer.setMap(null);
    fusionLayer = new google.maps.FusionTablesLayer({
      query: {
        select: '\'Type\'',
        from: window.FUSION_TABLE_ID,
        where: "location not equal to" + (-1 * Math.random() * 10000000).toString()
      },
      map: map
    });
  }

  function doPostRequest(path) {
    if (!GoogleAuth.isSignedIn.get()) {
       GoogleAuth.signIn();
    }

    return gapi.client.request({
      method: 'post',
      path: path
    })
  }

  /**
   * Insert data to Fusion Table
   */
  function insert(result, location) {
    return doPostRequest("https://www.googleapis.com/fusiontables/v1/query?sql=" + buildInsert(result, location))
  }

  /**
   * Flush Fusion Table
   */
  function flush() {
    return doPostRequest("https://www.googleapis.com/fusiontables/v1/query?sql=DELETE+FROM+" + window.FUSION_TABLE_ID)
  }

  function buildInsert(result, location) {
    var date = new Date();
    var dateString = date.getDate() + "." + date.getMonth() + "." + date.getFullYear()
    return "INSERT+INTO+" +
      window.FUSION_TABLE_ID +
      "+(Type,Location,Date)+VALUES+('" +
      result.geometry.location_type + "','" + location.lat() + ',' + location.lng() + "','" + dateString + "')%3B"

  }
  return {
    insert: insert,
    flush: flush,
    refresh: refresh
  }
})();
