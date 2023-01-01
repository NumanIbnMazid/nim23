from django.shortcuts import render


def index(request):
    context = {"hello": {"world": {"name": "Universe"}}}
    return render(request, "index.html", context)

