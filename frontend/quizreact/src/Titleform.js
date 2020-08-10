import React from "react";
import QuestionForm from "./Question";

class TitleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      data: { questions: [] },
      nextQuestionIndex: 0,
      currentQuestion: null,
      disableNextQuestionButton: false,
    };
    this.endpoint = props.endpoint;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
  }

  handleChange(event) {
    this.setState({ title: event.target.value });
  }
  handleSubmit(event) {
    if (this.state.title == "") {
      event.preventDefault();
      return;
    }
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: this.state.title }),
    };
    fetch(this.props.endpoint, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          currentQuestion: data["questions"][0],
          nextQuestionIndex: 1,
        });
        this.props.callback(data);

        this.setState({ data: data });
      });
    this.setState(this.state);

    event.preventDefault();
  }

  nextQuestion() {
    if (
      this.state.data["questions"].length > 0 &&
      this.state.nextQuestionIndex < this.state.data["questions"].length
    ) {
      const nextIndex = this.state.nextQuestionIndex + 1;
      this.setState({
        currentQuestion: this.state.data["questions"][
          this.state.nextQuestionIndex
        ],
        nextQuestionIndex: nextIndex,
        disableNextQuestionButton: false,
      });
    }
    if (this.state.nextQuestionIndex >= this.state.data.questions.length - 1) {
      this.setState({ disableNextQuestionButton: true });
    }
  }

  render() {
    var renderedQuestion;
    let nextQuestionButton;
    if (this.state.currentQuestion != null) {
      renderedQuestion = (
        <QuestionForm
          question={this.state.currentQuestion.question}
          answers={this.state.currentQuestion.answers}
          answerEnpoint="http://127.0.0.1:8000/answers/"
        />
      );
      nextQuestionButton = (
        <input
          type="button"
          onClick={this.nextQuestion}
          value="Next Question"
          disabled={this.state.disableNextQuestionButton}
        />
      );
    } else {
      renderedQuestion = <div></div>;
      nextQuestionButton = <div></div>;
    }

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Enter iteration title:
            <input
              type="text"
              value={this.state.title}
              onChange={this.handleChange}
            />{" "}
          </label>
          <input type="submit" value="Submit" />
        </form>
        {renderedQuestion}
        <div></div>
        {nextQuestionButton}
      </div>
    );
  }
}

export default TitleForm;
