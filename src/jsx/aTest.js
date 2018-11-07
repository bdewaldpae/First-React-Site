import React from 'react';
import ReactDOM from 'react-dom';

class Root extends React.Component {
    //state = { name : "--JSX TEST--"};
  
    render() {
      return (
        <div>
          <h1>Test JSX</h1>
          <p>Hello {this.props.name}</p>
        </div>
      );
    }
  }
  
  ReactDOM.render(<Root name='jsx test'/>, document.getElementById("questionsApp"));