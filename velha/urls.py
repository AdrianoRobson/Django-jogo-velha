from django.urls import path
from .views import IndexView, GameView

urlpatterns = [
    # Rota inicio para escolha x ou 0
    path('', IndexView.as_view(), name='index'),
    path('game/<room_code>/<gamer>', GameView.as_view(), name='game'),
]