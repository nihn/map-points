from rest_framework.generics import ListCreateAPIView, DestroyAPIView

from map_points.api.serializers import MapPointSerializer
from map_points.models import MapPoint


class MapPointsView(ListCreateAPIView, DestroyAPIView):
    queryset = MapPoint.objects.all()
    serializer_class = MapPointSerializer

    def get_object(self):
        return self.queryset
