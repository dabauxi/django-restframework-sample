import requests
from django.test import TestCase
from vcr_unittest import VCRTestCase

from quiz.models import Answer, Question, QuizIteration


# Create your tests here.
class QuizTest(TestCase):

    BASE_URL = "http://127.0.0.1:8000"

    # def test_populate_data(self):
    #     Answer(answer="test").save()

    def test_update_question(self):
        response = requests.patch(
            url=f"{QuizTest.BASE_URL}/questions/2/",
            json={"answers": {"id": 2, "answer": "gugu", "checked": True}},
        )
        print(response)

    #
    # def test_list_answers(self):
    #     response = requests.get(url=f"{QuizTest.BASE_URL}/answers")
    #     result = response.json()
    #     self.assertTrue(result)
    #
    # def test_post_answer(self):
    #     response = requests.post(url=f"{QuizTest.BASE_URL}/answers/", json={"answer": "this is my answer"})
    #     self.assertTrue(response)
    #
    # def test_list_questions(self):
    #     response = requests.get(url=f"{QuizTest.BASE_URL}/questions/")
    #     questions = response.json()
    #     self.assertTrue(questions)
    #
    # def test_post_question(self):
    #     response = requests.post(url=f"{QuizTest.BASE_URL}/questions/", json={"question":"what is this?","answers":[{"answer":"red"},{"answer":"black"}], "selected_answers":[]})
    #
    # def test_update_question(self):
    #     response = requests.put(url=f"{QuizTest.BASE_URL}/questions/1/", json={"question":"what is this?","answers":[{"answer":"red"},{"answer":"black"}], "selected_answers":[ {
    #         "id": 3,
    #         "answer": "answer3"
    #     }]})
