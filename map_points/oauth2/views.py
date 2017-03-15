from django.conf import settings
from django.core.urlresolvers import reverse
from django.http import HttpResponse
from django.shortcuts import redirect
from oauth2client import client


def oauth2callback(request):
    flow = client.flow_from_clientsecrets(
        settings.OAUTH2['secrets_file'],
        scope=settings.OAUTH2['scope'],
        redirect_uri=request.build_absolute_uri(reverse('oauth2callback')),
    )

    if 'code' not in request.GET:
        auth_uri = flow.step1_get_authorize_url()
        # Do not return 302 as we do not want XHR to follow it
        return HttpResponse(auth_uri, status=401)

    auth_code = request.GET['code']
    credentials = flow.step2_exchange(auth_code)
    request.session['credentials'] = credentials.to_json()
    return redirect('index')
