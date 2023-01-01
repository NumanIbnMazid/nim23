from django_unicorn.components import UnicornView


class HelloWorldView(UnicornView):
    name = "World"
