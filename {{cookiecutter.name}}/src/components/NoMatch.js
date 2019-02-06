import React from 'react'

const NoMatch = ({ location }) => (
  <div className='no-match'>Sorry. No match for <code>{location.pathname}</code> page.</div>
)

export default NoMatch

