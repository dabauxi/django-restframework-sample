from rest_framework import viewsets

from quiz.models import Answer, Question, QuizIteration
from quiz.serializers import (
    AnswerSerializer,
    QuestionSerializer,
    QuizIterationSerializer,
)


class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer


class QuizIterationViewSet(viewsets.ModelViewSet):

    serializer_class = QuizIterationSerializer
    queryset = QuizIteration.objects.all().order_by("title")
