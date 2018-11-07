import React from 'react';
import ReactDOM from 'react-dom';
import { formatWithOptions } from 'util';

class ResultsMessage extends React.Component {
  constructor(props){
    super(props);
    var myMessage = "";
    for(var i = 0; i < this.props.questions.length; i++){
      var theAnswer = this.props.questions[i].answer;
      var answerRemainder = this.props.questions[i].answerRemainder;
      var value1 = this.props.questions[i].value1;
      var value2 = this.props.questions[i].value2;
      var theUserAnswer = this.props.questions[i].userAnswer;
      var theUserAnswerRemainder = this.props.questions[i].userAnswerRemainder;
      var operator = this.props.questions[i].operator;
      var divisionRemainderCorrect = true;
      if(operator == "/"){
        if(answerRemainder != theUserAnswerRemainder)
          divisionRemainderCorrect = false;
      }

      if(theAnswer != theUserAnswer || divisionRemainderCorrect == false){
        if(myMessage != "")
          myMessage = myMessage + ", ";
        myMessage = myMessage + value1 + operator + value2 + "=" + theAnswer + " (your answer:" + theUserAnswer + ") ";
      }
    }
    this.props.resultMessage = myMessage;
  };
  render() {
    return (
      <div>
        <div>Missed Questions:</div>
        <div>{this.props.resultMessage}</div>
      </div>
    );
  }
}

class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = {userAnswer: 0, userAnswerRemainder: 0};
  };
  handleClick(e){
    var myAnswer = this.state.userAnswer;
    var myAnswerRemainder = this.state.userAnswerRemainder;
    this.props.onClick(myAnswer, myAnswerRemainder);
  }
  keyPress(e){
    const keyCode = e.keyCode || e.which;
    const keyValue = String.fromCharCode(keyCode);
    if (!/^[0-9\b]+$/.test(keyValue)){
      e.preventDefault();
    }
  }
  updateAnswer(e){
    var answer = e.target.value;
    const re = /^[0-9\b]+$/;
      if (answer == '' || re.test(answer)) {
        this.setState({userAnswer: answer});
      }
  }
  updateAnswerRemainder(e){
    var answer = e.target.value;
    this.setState({userAnswerRemainder: answer});
  }
  
  render() {
    if(this.props.question.operator == "/"){
      return (
        <div className="questionSection" style={{marginTop:"15px"}}>
          <span className="questionDivision">
            {this.props.question.value1}
          </span>
          <span className="questionDivisionInside">
            {this.props.question.value2}
          </span>
          <div style={{marginTop:"15px"}}>
            Answer: <input autoFocus type="text" pattern="[0-9]*" id="answer" onChange={e => this.updateAnswer(e)} onKeyPress={e => this.keyPress(e)} className="answerBox"></input>
            Remainder: <input id="answerRemainder" onChange={e => this.updateAnswerRemainder(e)} onKeyPress={e => this.keyPress(e)} className="answerBox"></input>
          </div>
          <div onClick={e => this.handleClick(e)} className="button">Save Answer</div>
        </div>
    );
    } else {
      return (
          <div className="questionSection">
            <div className="question">
              {this.props.question.value1}
              <br />
              {this.props.question.operatorText}
              &nbsp;
              {this.props.question.value2}
            </div>
            <div>
              <input autoFocus type="text" pattern="[0-9]*" id="answer" onChange={e => this.updateAnswer(e)} onKeyPress={e => this.keyPress(e)} className="answerBox"></input>
            </div>
            <div onClick={e => this.handleClick(e)} className="button">Save Answer</div>
          </div>
      );
    }
  }
}

function randomIntFromInterval(min,max) // min and max included
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function setUp(){
  var numQuestions = 2;
  var myQuestions = [];
  var maxNumber1Add = 999;
  var maxNumber2Add = 999;
  var maxNumber1Subtract = 999;
  var maxNumber2Subtract = 999;
  var maxNumber1Multiply = 999;
  var maxNumber2Multiply = 9;
  var maxNumber1Divide = 9;
  var maxNumber2Divide = 999;
  var operator = "+";
  var operatorText = "+";
  var answer = 0;
  var answerRemainder = 0;
  var value1 = 0;
  var value2 = 0;
  for(var i = 0; i < numQuestions; i++){
    var operatorNumber = randomIntFromInterval(1, 4);
    switch(operatorNumber)
    {
      case 1:
        operator = "+";
        value1 = randomIntFromInterval(1, maxNumber1Add);
        value2 = randomIntFromInterval(1, maxNumber2Add);
        while (value2 >= value1){
          value2 = randomIntFromInterval(1, maxNumber2Add);
        }
        answer = value1 + value2;
        break;
      case 2:
        operator = "-";
        operatorText = "-";
        value1 = randomIntFromInterval(1, maxNumber1Subtract);
        value2 = randomIntFromInterval(1, maxNumber2Subtract);
        while (value2 >= value1){
          value2 = randomIntFromInterval(1, maxNumber2Add);
        }
        answer = value1 - value2;
        break;
      case 3:
        operator = "*";
        operatorText = "X";
        value1 = randomIntFromInterval(1, maxNumber1Multiply);
        value2 = randomIntFromInterval(1, maxNumber2Multiply);
        while (value2 >= value1){
          value2 = randomIntFromInterval(1, maxNumber2Multiply);
        }
        answer = value1 * value2;
        break;
      case 4:
        operator = "/";
        operatorText = "/";
        value1 = randomIntFromInterval(1, maxNumber1Divide);
        value2 = randomIntFromInterval(1, maxNumber2Divide);
        while (value2 <= value1){
          value2 = randomIntFromInterval(1, maxNumber2Divide);
        }
        answer = Math.floor(value2 / value1);
        answerRemainder = value2 % value1;
        break;
    }
    
    myQuestions.push({questionNum : i, operator : operator, operatorText : operatorText, userAnswer:0, userAnswerRemainder:0,
      value1 : value1, value2 : value2, answer : answer, answerRemainder : answerRemainder });
  }
  return myQuestions;
}

class Root extends React.Component {
    constructor(props) {
      super(props);
      this.saveAnswer = this.saveAnswer.bind(this);
      this.state = { currentQuestionNum : 0, questions : setUp(), lastAnswer : 0, numberCorrect : 0,
        startTime: new Date(), endTime: "", message : "", styleColor : "green", scoreMessage : "", resultsMessage : ""};
    };

    saveAnswer(userAnswer, userAnswerRemainder) {
      var myMessage = "";
      var answer = this.state.questions[this.state.currentQuestionNum].answer;
      var answerRemainder = this.state.questions[this.state.currentQuestionNum].answerRemainder;
      var divisionRemainderCorrect = true;
      if(this.state.questions[this.state.currentQuestionNum].operator == "/"){
        if(answerRemainder != userAnswerRemainder)
          divisionRemainderCorrect = false;
      }

      this.state.questions[this.state.currentQuestionNum].userAnswer = userAnswer;
      this.state.questions[this.state.currentQuestionNum].userAnswerRemainder = userAnswerRemainder;

      if(userAnswer != null){
        if(userAnswer != answer || divisionRemainderCorrect != true){
          myMessage = "Incorrect, should be: " + answer;
          if(this.state.questions[this.state.currentQuestionNum].operator == "/")
            myMessage = myMessage + " remainder: " + answerRemainder;
          this.setState({styleColor : "red"});
        } else {
          var temp = this.state.numberCorrect;
          this.setState({numberCorrect : temp + 1});
          myMessage = "Correct!";
          this.setState({styleColor : "green"});
        }
      }
      var newCurrentQuestionNum = this.state.currentQuestionNum + 1;
      this.setState({currentQuestionNum : newCurrentQuestionNum});

      if(newCurrentQuestionNum >= this.state.questions.length){
        //this.state.endTime = new Date();
        var temp = this.state.numberCorrect;
        var score = (this.state.numberCorrect / this.state.questions.length) * 100;
        var timeInMinutes = (((new Date() - this.state.startTime) / 1000) / 60).toFixed(2);
        this.state.scoreMessage = "SCORE: " + this.state.numberCorrect + " out of " 
          + this.state.questions.length + " = " + score + "%, Time in Minutes: " + timeInMinutes;
      }
      this.setState({message: myMessage});
    }
  
    render() {
      if(this.state.currentQuestionNum < this.state.questions.length) {
        //displays questions
        return (
          <div style={{width:'100%'}}>
            <div style={{fontSize:"26px", color:"green"}}>
              Question Number: {this.state.currentQuestionNum} of {this.state.questions.length}
            </div>
            <Question onClick={this.saveAnswer} question={this.state.questions[this.state.currentQuestionNum]}/>
            <br /> 
            <div className={this.state.styleColor}>
              {this.state.message}
            </div>
          </div>
        );
      } else {
        //displays results
        return (
          <div>
            <div style={{fontSize:"26px", color:"green"}}>Completed!</div>
            <br />
            <div className={this.state.styleColor}>
              {this.state.message}
            </div>
            <div style={{fontSize:"50px", fontWeight:"bold"}}>
              {this.state.scoreMessage}
            </div>
            <div>
              {this.state.resultsMessage}
            </div>
            <ResultsMessage questions={this.state.questions} />
          </div>
        );
      }
    }
  }
  
  ReactDOM.render(<Root name='jsx test1'/>, document.getElementById("questionsApp"));