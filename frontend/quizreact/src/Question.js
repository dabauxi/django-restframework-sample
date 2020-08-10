import React from "react";
import Answer from "./Answer";

const ANSWER_ENDPOINT = "http://127.0.0.1:8000/answers/";

class QuestionForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var answers = this.props.answers.map((elem) => {
      return (
        <Answer
          answer={elem["answer"]}
          answerId={elem["id"]}
          key={String(elem.id)}
          endpoint={ANSWER_ENDPOINT}
        />
      );
    });
    return (
      <div>
        <p>{this.props.question}</p>
        {answers}
      </div>
    );
  }
}

export default QuestionForm;
