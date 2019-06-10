import React from 'react'
import { render } from 'react-dom'
import configureStore from './store/configureStore'
import { Provider } from 'react-redux'
import App from './containers/App'

import './styles/main.scss'

const store = configureStore()

const Main = () => (
  <Provider store={ store }>
    <App />
  </Provider>
)

render(<Main />, document.getElementById('application-container'))
