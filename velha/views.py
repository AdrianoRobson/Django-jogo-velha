from django.views.generic import TemplateView, FormView
from .forms import SecaoGameForm
from django.urls import reverse_lazy  # Para redirecionamento

from django.shortcuts import redirect

# Como o usuário vai informar o nome da sala, vamos usar o mark_safe
# para remover possível código malisiono e tornar a string segura
from django.utils.safestring import mark_safe

import json


class IndexView(FormView):
    template_name = 'index.html'

    form_class = SecaoGameForm
    success_url = reverse_lazy('index')

    # Recuperando o contexto da página
    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        context['form'] = SecaoGameForm()
        return context

    def form_valid(self, form, *args, **kwargs):
        return redirect('game', form.cleaned_data["room_code"], form.cleaned_data["gamer"])

    def form_invalid(self, form, *args, **kwargs):
        return super(IndexView, self).form_valid(form, *args, **kwargs)


class GameView(TemplateView):
    template_name = 'game.html'



