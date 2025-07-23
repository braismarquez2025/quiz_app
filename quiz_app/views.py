from django.views.generic import TemplateView
from django.shortcuts import render


class HomeView(TemplateView):
    template_name = "general/home.html"


class PreguntasView(TemplateView):
    template_name = "general/preguntas.html"


class PuntuacionView(TemplateView):
    template_name = "general/puntuacion.html"

class PruebaView(TemplateView):
    template_name = "general/prueba.html"