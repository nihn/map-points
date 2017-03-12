var mapPointsTable = (function() {
  var table = document.getElementById('map-points');
  init();

  /**
   * Add row to the address table below the map
   */
  function addRow(addr, lng, lat) {
    function addTh(row, text) {
      var th = document.createElement('th');
      th.innerHTML = text;
      row.appendChild(th)
    }

    if (!table.rows.length) {
      var header_row = table.insertRow(0);
      addTh(header_row, 'Address');
      addTh(header_row, 'Longitude');
      addTh(header_row, 'Latitude');
    }

    var row = table.insertRow(-1);
    row.insertCell(0).innerHTML = addr;
    row.insertCell(1).innerHTML = lng;
    row.insertCell(2).innerHTML = lat;
  }

  /**
  Flush all table rows
   */
  function flush() {
    while(table.rows.length > 0) {
        table.deleteRow(0);
      }
  }

  /**
  Fetch map points from backend and put them into the table
   */
  function init() {
    api.fetch(function (xhr) {
      var list = JSON.parse(xhr.responseText);
      for (var idx in list) {
        if (list.hasOwnProperty(idx)) {
          addRow(list[idx].address, list[idx].lng, list[idx].lat);
        }
      }
    })
  }
  return {
    addRow: addRow,
    flush: flush
  }
})();
