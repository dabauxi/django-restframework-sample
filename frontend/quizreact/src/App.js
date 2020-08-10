import React from "react";
import "./App.css";
import Answer from "./Answer";
import { Button } from "@material-ui/core";
import TitleForm from "./Titleform";
import Grid from "@material-ui/core/Grid";

class QuizApp extends React.Component {
  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.checkFinished = this.checkFinished.bind(this);
    this.addIterationData = this.addIterationData.bind(this);
    this.handleOnDeleteClick = this.handleOnDeleteClick.bind(this);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      iteration: null,
      iterationFinished: false,
    };
  }

  componentDidMount() {
    fetch("http://127.0.0.1:8000/quiziterations/")
      .then((res) => res.json())
      .then(
        (result) => {
          // console.log(result)
          this.setState({
            isLoaded: true,
            items: result,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  checkFinished(iteration) {
    let finished = true;
    for (let question of iteration.questions) {
      let question_finished = new Set();
      console.log(question);
      for (let answer of question.answers) {
        question_finished.add(answer.checked);
      }
      if (!question_finished.has(true)) {
        finished = false;
        break;
      }
    }
    console.log(iteration);
    iteration.finished = finished;
    this.setState({ iteration: iteration });
  }

  handleOnClick(event, id) {
    fetch("http://127.0.0.1:8000/quiziterations/" + id)
      .then((res) => res.json())
      .then(
        (result) => {
          //console.log(result)
          this.setState({
            isLoaded: true,
            iteration: result,
          });
          this.checkFinished(result);
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  handleOnDeleteClick(endpoint, id) {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    };
    fetch("http://127.0.0.1:8000/" + endpoint + "/" + id + "/", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ data: data });
      });
    if (endpoint == "quiziterations") {
      var items = this.state.items;
      var filtered = items.filter(function (el) {
        return el.id != id;
      });
      this.setState({ items: filtered, iteration: null });
    }
    if (endpoint == "answers") {
      let filteredQuestions = this.state.iteration.questions.map((question) => {
        let filteredAnswers = question.answers.filter((elem) => elem.id != id);
        question.answers = filteredAnswers;
        return question;
      });
      let filteredIteration = this.state.iteration;
      filteredIteration.questions = filteredQuestions;
      this.setState({ iteration: filteredIteration });
    }
  }

  addIterationData(iteration) {
    console.log(iteration);
    let items = this.state.items;
    items.push(iteration);
    this.setState({ items: items });
  }

  render() {
    const { error, isLoaded, items } = this.state;
    //  console.log(items)
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      const listItems = items.map((item) => {
        return (
          <div key={String(item.id)}>
            <Button
              variant="contained"
              onClick={(e) => this.handleOnClick(e, item["id"])}
            >
              {item.title}
            </Button>
          </div>
        );
      });
      var iterationInfo = <div></div>;
      var selectedAnswers;
      if (this.state.iteration != null) {
        iterationInfo = (
          <p>
            <p>Title: {this.state.iteration.title}</p>
            <p>Created: {this.state.iteration.created}</p>
            <p>Finished: {String(this.state.iteration.finished)}</p>
            <Button
              variant="contained"
              onClick={(e) =>
                this.handleOnDeleteClick(
                  "quiziterations",
                  this.state.iteration.id
                )
              }
            >
              Delete
            </Button>
          </p>
        );
        // console.log(this.state.iteration);
        selectedAnswers = this.state.iteration["questions"].map((question) => {
          let answers = question.answers.map((answer) => {
            if (answer.checked == true) {
              return (
                <div>
                  <Answer
                    answer={answer.answer}
                    answerId={answer.id}
                    disable="true"
                  />
                  <Button
                    variant="contained"
                    onClick={(e) =>
                      this.handleOnDeleteClick("answers", answer.id)
                    }
                  >
                    Delete
                  </Button>
                </div>
              );
            }
          });
          return answers;
        });
      }
      return (
        <div>
          <Grid container spacing={1} mb={2}>
            <Grid items xs={3}></Grid>
            <Grid items xs={3}>
              <TitleForm
                endpoint="http://127.0.0.1:8000/quiziterations/"
                callback={this.addIterationData}
              />
            </Grid>
            <Grid items xs={3}></Grid>
            <Grid items xs={3}></Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid items xs={3}></Grid>
            <Grid items xs={3}>
              <h3>Iterations:</h3>
              {listItems}
            </Grid>
            <Grid items xs={3}>
              {iterationInfo}
              {selectedAnswers}
            </Grid>
            <Grid items xs={3}></Grid>
          </Grid>
        </div>
      );
    }
  }
}

export default QuizApp;
