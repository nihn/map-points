from datetime import date

from django.conf import settings
from django.utils.decorators import method_decorator
from rest_framework.generics import ListCreateAPIView, DestroyAPIView

from map_points.api.serializers import MapPointSerializer
from map_points.oauth2.decorators import auth_required
from map_points.models import MapPoint

INSERT_TPL = "INSERT INTO {table_id} (Address,Location,Date) VALUES " \
             "('{address}','{lat},{lng}','{date}')"


class MapPointsView(ListCreateAPIView, DestroyAPIView):
    queryset = MapPoint.objects.all()
    serializer_class = MapPointSerializer

    @method_decorator(auth_required)
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def perform_create(self, serializer):
        super().perform_create(serializer)
        insert = INSERT_TPL.format(
            table_id=settings.FUSION_TABLE_ID,
            date=date.today(),
            **serializer.data,
        )
        self.request.gapi_client.query().sql(
            sql=insert).execute()

    @method_decorator(auth_required)
    def delete(self, request, *args, **kwargs):
        response = super().delete(request, *args, **kwargs)
        request.gapi_client.query().sql(
            sql=f"DELETE FROM {settings.FUSION_TABLE_ID}").execute()
        return response

    def get_object(self):
        return self.queryset
