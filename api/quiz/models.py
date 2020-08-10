from django.db import models
from django.utils import timezone


class Answer(models.Model):
    answer = models.TextField()
    checked = models.BooleanField(default=False)
    question = models.ForeignKey(
        "Question", on_delete=models.CASCADE, null=True, related_name="answers"
    )

    def __str__(self):
        return self.answer


class Question(models.Model):
    question = models.TextField()
    iteration = models.ForeignKey("QuizIteration", related_name="iteration", on_delete=models.DO_NOTHING, default=None)

    def __str__(self):
        return self.question


class QuizIteration(models.Model):
    title = models.CharField(max_length=255)
    created = models.DateTimeField(default=timezone.now)
    finished = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    def __repr__(self):
        return f"{self.title}, {self.created}"
