from rest_framework.serializers import ModelSerializer

from map_points.models import MapPoint


class MapPointSerializer(ModelSerializer):
    class Meta:
        model = MapPoint
        fields = '__all__'
