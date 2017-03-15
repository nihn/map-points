from django.conf.urls import url

from map_points.oauth2.views import oauth2callback

urlpatterns = [
    url(r'callback/$', oauth2callback, name='oauth2callback'),
]
