import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Home from '../components/Home'
import NoMatch from '../components/NoMatch'

const AppComponent = () => (
  <div id='application-container' className='app'>
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route component={NoMatch} />
        </Switch>
      </Suspense>
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

