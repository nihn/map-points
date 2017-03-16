from datetime import date

from django.conf import settings
from django.utils.decorators import method_decorator
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListCreateAPIView, DestroyAPIView
from rest_framework.status import HTTP_409_CONFLICT

from map_points.api.serializers import MapPointSerializer
from map_points.oauth2.decorators import auth_required
from map_points.models import MapPoint

INSERT_TPL = "INSERT INTO {table_id} (Address,Location,Date) VALUES " \
             "('{address}','{lat},{lng}','{date}')"
SELECT_TPL = "SELECT * FROM {table_id} WHERE Address='{address}'"
DELETE_TPL = "DELETE FROM {table_id}"


class AlreadyExistsError(ValidationError):
    status_code = HTTP_409_CONFLICT


class MapPointsView(ListCreateAPIView, DestroyAPIView):
    queryset = MapPoint.objects.all()
    serializer_class = MapPointSerializer

    @method_decorator(auth_required)
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def perform_create(self, serializer):
        """
        Validate if we don't already have given address in the fusion table and
        insert data to it apart of regular database.
        """
        select = SELECT_TPL.format(table_id=settings.FUSION_TABLE_ID,
                                   **serializer.validated_data)
        res = self.request.gapi_client.query().sql(sql=select).execute()
        if res.get('rows'):
            raise AlreadyExistsError("Address already exists in Fusion Table")

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
            sql=DELETE_TPL.format(table_id=settings.FUSION_TABLE_ID)).execute()
        return response

    def get_object(self):
        return self.queryset
