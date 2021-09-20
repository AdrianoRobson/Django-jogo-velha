# importando re_path para criar um path com expressões regulares
from django.urls import re_path

from django.conf.urls import url

# GameConsumer faz a ponte entre o navegador e a aplicação
from .consumers import GameConsumer

# Rota para o channels
websocket_urlpatterns = [
    # iniciamos essa rota com ws que significa websocket(faz comunicação realtime)
    # re_path(r'ws/game/(?P<room_code>\w+)/', GameConsumer.as_asgi()),

    re_path(r'^ws/game/(?P<room_code>\w+)/', GameConsumer.as_asgi()),

]



