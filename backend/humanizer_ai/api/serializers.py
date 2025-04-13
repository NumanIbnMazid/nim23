from rest_framework import serializers


class HumanizerRequestSerializer(serializers.Serializer):
    input_text = serializers.CharField(max_length=20000)

    class Meta:
        fields = ("input_text",)
