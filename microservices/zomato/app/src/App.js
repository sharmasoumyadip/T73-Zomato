import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import './App.css';
import Loginscreen from './Loginscreen'
class App extends Component {
  constructor(props){
    super(props);
    this.state={
      loginPage:[],
      uploadScreen:[]
    }
  }
  componentWillMount(){
    var loginPage =[];
    loginPage.push(<Loginscreen parentContext={this}/>);
    this.setState({
                  loginPage:loginPage
                    })
  }
  render() {
    return (
      <div className="App">
        {this.state.loginPage}
        {this.state.uploadScreen}
      </div>
    );
  }
}

const style = {
  margin: 15,
};

export default App;
if(response.data.code == 200){
 console.log("Login successfull");
 var uploadScreen=[];
 uploadScreen.push(<UploadScreen appContext={self.props.appContext}/>)
 self.props.appContext.setState({loginPage:[],uploadScreen:uploadScreen})
 }
