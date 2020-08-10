from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers

from quiz.models import Answer, Question, QuizIteration


class AnswerSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    checked = serializers.BooleanField()

    class Meta:
        model = Answer
        fields = ["id", "answer", "checked"]


class QuestionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    answers = AnswerSerializer(many=True)

    def update(self, instance, validated_data):

        selected_answers = validated_data.pop("answers", [])

        question = validated_data.pop("question", None)
        if question:
            instance.question = question
            instance.save()
        for answer in selected_answers:
            id = answer.get("id", None)
            checked = answer.get("checked", None)
            answer_text = answer.get("answer", None)
            try:
                answer = Answer.objects.get(id=id)
                if answer_text:
                    answer.answer = answer_text
                    answer.save()
                if answer.question.id == instance.id and checked is not None:
                    answer.checked = checked
                    answer.save()
            except ObjectDoesNotExist:
                raise serializers.ValidationError("Answer does not exist")
        return instance

    class Meta:
        model = Question
        fields = ["id", "question", "answers"]


class QuizIterationSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, required=False)

    def duplicate_questions(self):
        duplicated_questions = []
        quiz_iteration = QuizIteration.objects.first()
        for question in quiz_iteration.questions.all():
            duplicated_answers = []
            duplicated_question = Question(question=question.question)
            duplicated_question.save()
            for answer in question.answers.all():
                duplicated_answer = Answer(
                    answer=answer.answer, checked=False, question=duplicated_question
                )
                duplicated_answer.save()
                duplicated_answers.append(duplicated_answer)
            duplicated_questions.append(duplicated_question)
        return duplicated_questions

    def create(self, validated_data):
        title = validated_data.pop("title", None)
        if not title:
            raise serializers.ValidationError("No iteration title provided.")
        iteration = QuizIteration(title=title)
        iteration.save()
        iteration.questions.set(self.duplicate_questions())
        iteration.save()
        return iteration

    class Meta:
        model = QuizIteration
        fields = ["id", "title", "created", "finished", "questions"]
