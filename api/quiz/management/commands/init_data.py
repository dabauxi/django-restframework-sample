from django.core.management.base import BaseCommand

from quiz.models import Answer, Question, QuizIteration

quizes = [
    {"title": "Quiz1",},
    {"title": "Quiz2"},
    {"title": "Quiz3",},
    {"title": "Quiz4"},
    {"title": "Quiz5",},
    {"title": "Quiz6"},
    {"title": "Quiz7",},
    {"title": "Quiz8"},
]


question_data = [
    {"question": "Which color?", "answers": ["red", "black"],},
    {"question": "Which person?", "answers": ["cat", "dog"],},
    {"question": "Tabs or Spaces?", "answers": ["tabs", "spaces"],},
    {"question": "Vanilla or Chocolate?", "answers": ["vanilla", "chocolate"],},
    {"question": "Java or Python?", "answers": ["Java", "Python"],},
]


def generate_questions(iteration):
    for elem in question_data:
        question = Question(question=elem["question"], iteration=iteration)
        question.save()
        for answer_data in elem["answers"]:
            answer = Answer(answer=answer_data, question=question)
            answer.save()


class Command(BaseCommand):
    help = "Initialize with some data."

    def handle(self, *args, **kwargs):
        for quiz in quizes:
            quiz_iteration = QuizIteration(title=quiz["title"])
            quiz_iteration.save()
            generate_questions(quiz_iteration)
