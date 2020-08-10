import React from "react";
import { Button, Checkbox } from "@material-ui/core";
import "./App.css";


class Answer extends React.Component {
  constructor(props) {
    super(props);
    this.handleCheck = this.handleCheck.bind(this);
  }

  handleCheck(event, id) {
    //this.setState({checked: event.target.checked});
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id, checked: event.target.checked }),
    };
    fetch(this.props.endpoint + id + "/", requestOptions)
      .then((response) => response.json())
      .then((data) => {});
  }

  render() {
    if (this.props.disable) {
      return (
        <label>
          <Checkbox
            inputProps={{ "aria-label": "primary checkbox" }}
            onChange={(e) => this.handleCheck(e, this.props.answerId)}
            id={String(this.props.answerId)}
            disabled={this.props.disable}
          />
          {this.props.answer}
        </label>
      );
    } else {
      return (
        <label>
          <Checkbox
            inputProps={{ "aria-label": "primary checkbox" }}
            onChange={(e) => this.handleCheck(e, this.props.answerId)}
            id={String(this.props.answerId)}
          />
          {this.props.answer}
        </label>
      );
    }
  }
}

export default Answer;
