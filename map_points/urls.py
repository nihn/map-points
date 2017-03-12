from django.conf.urls import url, include

from map_points.views import IndexView

urlpatterns = [
    url(r'^$', IndexView.as_view()),
]
