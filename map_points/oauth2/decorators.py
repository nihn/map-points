import httplib2

from decorator import decorator
from django.core.urlresolvers import reverse
from django.shortcuts import redirect
from googleapiclient import discovery
from oauth2client.client import OAuth2Credentials


@decorator
def auth_required(f, request, *args, **kwargs):
    """
    Verify if request is authorized to communicate with Google's API. If so
    assign authorized Fusion Tables client to it as gapi attribute.
    """
    if 'credentials' not in request.session:
        return redirect(reverse('oauth2callback'))

    credentials = OAuth2Credentials.from_json(request.session['credentials'])

    if credentials.access_token_expired:
        return redirect(reverse('oauth2callback'))

    http_auth = credentials.authorize(httplib2.Http())
    client = discovery.build('fusiontables', 'v1', http=http_auth)
    request.gapi_client = client
    res = f(request, *args, **kwargs)

    if res.status_code == 403:
        # Logout unprivileged user
        del request.session['credentials']

    return res
