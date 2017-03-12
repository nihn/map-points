from django.conf.urls import static, url

from map_points.api.views import MapPointsView

urlpatterns = [
    url(r'^map-points/?$', MapPointsView.as_view(), name='map-points-api'),
]
