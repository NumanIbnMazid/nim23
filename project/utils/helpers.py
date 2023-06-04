from rest_framework.response import Response


class ResponseWrapper(Response):

    def __init__(self, data=None, error_code=None, template_name=None, headers=None, exception=False, content_type=None,
                 error_message=None, message=None, response_success=True, status=None, data_type=None):
        """
        Alters the init arguments slightly.
        For example, drop 'template_name', and instead use 'data'.

        Setting 'renderer' and 'media_type' will typically be deferred,
        For example being set automatically by the `APIView`.
        """
        status_by_default_for_gz = 200
        if error_code is None and status is not None:
            if status > 299 or status < 200:
                error_code = status
                response_success = False
            else:
                status_by_default_for_gz = status
        if error_code is not None:
            status_by_default_for_gz = error_code
            response_success = False

        # manipulate dynamic message
        if message is not None and not message == "":
            if message.lower() == "list":
                message = "List retrieved successfully!" if response_success else "Failed to retrieve the list!"
            elif message.lower() == "create":
                message = "Created successfully!" if response_success else "Failed to create!"
            elif message.lower() == "update":
                message = "Updated successfully!" if response_success else "Failed to update!"
            elif message.lower() == "delete":
                message = "Deleted successfully!" if response_success else "Failed to delete!"
            elif message.lower() == "retrieve":
                message = "Object retrieved successfully!" if response_success else "Failed to retrieve the object!"
            else:
                pass

        output_data = {
            "success": response_success,
            "status_code": error_code if not error_code == "" and not error_code == None else status_by_default_for_gz,
            "data": data,
            "message": message if message else str(error_message) if error_message else "Success" if response_success else "Failed",
            "error": {"code": error_code, "error_details": error_message},
        }
        if data_type is not None:
            output_data["type"] = data_type

        super().__init__(data=output_data, status=status_by_default_for_gz,
                         template_name=template_name, headers=headers,
                         exception=exception, content_type=content_type)
