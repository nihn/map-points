var api = (function () {
  /**
   * Fetch map points from backend
   */
  function fetch(successCallback) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', window.MAP_POINTS_API_URL, true);
    xhr.onload = function () {
      if (xhr.status == 200) {
        successCallback(xhr);
      }
      else {
        console.log('Error while fetching: ', xhr.status)
      }
    };
    xhr.send();
    return xhr
  }

  /**
   * Insert data to backend database
   */
  function insert(data) {
    var xhr = new XMLHttpRequest();
    xhr.open('post', window.MAP_POINTS_API_URL, true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send(JSON.stringify(data));
  }

  /**
   * Flush backend database
   */
  function flush() {
    var xhr = new XMLHttpRequest();
    xhr.open('delete', window.MAP_POINTS_API_URL, true);
    xhr.onload = function() {
      if (xhr.status === 204) {
        console.log('Server database flushed')
      }
      else {
        console.log('Failed to flush server database, got: ' + res.status)
      }
    };
    xhr.send();
  }

  return {
    fetch: fetch,
    insert: insert,
    flush: flush
  }
})();
