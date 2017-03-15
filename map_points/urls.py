from django.conf.urls import url, include

from map_points.api import urls as api_urls
from map_points.oauth2 import urls as oauth2_urls
from map_points.views import IndexView

urlpatterns = [
    url(r'^$', IndexView.as_view(), name='index'),
    url(r'^api/', include(api_urls)),
    url(r'^oauth2/', include(oauth2_urls)),
]
