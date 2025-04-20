from rest_framework import serializers


class RecommendationRequestSerializer(serializers.Serializer):
    client_id = serializers.CharField()
    media_type = serializers.CharField()
    mood = serializers.CharField()
    occasion = serializers.ListField(child=serializers.CharField(allow_blank=True), allow_empty=True)
    genres = serializers.ListField(child=serializers.CharField(allow_blank=True), allow_empty=True)
    language = serializers.ListField(child=serializers.CharField(allow_blank=True), allow_empty=True)
    media_age = serializers.ListField(child=serializers.CharField(allow_blank=True), allow_empty=True)
    rating = serializers.ListField(child=serializers.CharField(allow_blank=True), allow_empty=True)
    categories = serializers.ListField(child=serializers.CharField(allow_blank=True), allow_empty=True)
    other_preferences = serializers.CharField(allow_blank=True)
