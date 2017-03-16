var api = (function () {
  /**
   * Fetch map points from backend
   */
  function fetch(successCallback) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', window.MAP_POINTS_API_URL, true);
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
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
  function insert(data, successCallback, errorCallback) {
    var xhr = new XMLHttpRequest();
    xhr.open('post', window.MAP_POINTS_API_URL, true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.onload = function () {
      if (xhr.status === 401 && xhr.responseText) {
        // Store our post to send it once we will be authorized to do so
        localStorage.setItem('post', JSON.stringify(data));
        window.location.href = xhr.responseText;
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        successCallback && successCallback();
      }
      else {
        errorCallback && errorCallback();
      }
    };
    xhr.send(JSON.stringify(data));
  }

  /**
   * Flush backend database
   */
  function flush(successCallback, errorCallback) {
    var xhr = new XMLHttpRequest();
    xhr.open('delete', window.MAP_POINTS_API_URL, true);
    xhr.onload = function() {
      if (xhr.status === 401 && xhr.responseText) {
        // Store our delete to send it once we will be authorized to do so
        localStorage.setItem('delete', '1');
        window.location.href = xhr.responseText;
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        console.log('Server database flushed');
        successCallback && successCallback()
      }
      else {
        console.log('Failed to flush server database, got: ' + res.status)
        errorCallback && errorCallback()
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
