import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from '../components/Home'
import NoMatch from '../components/NoMatch'


const AppComponent = () => (
  <div className='app__router-container'>
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route component={NoMatch} />
      </Switch>
    </Router>
  </div>
)

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

const App = connect(
  mapStateToProps, mapDispatchToProps
)(AppComponent)

export default App

