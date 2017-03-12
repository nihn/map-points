from django.conf.urls import url, include

from map_points.api import urls as api_urls
from map_points.views import IndexView

urlpatterns = [
    url(r'^$', IndexView.as_view()),
    url(r'^api/', include(api_urls)),
]
