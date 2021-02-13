import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import ChartVisualization from './components/ChartVisualization'
import NavBar from './components/NavBar'
import DataTable from './components/DataTable'
import MapVisualization from './components/MapVisualization'
class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className='outer-wrapper'>
          <NavBar />
          <Switch>
            <Route exact path='/' component={ChartVisualization} />
            <Route exact path='/chart' component={ChartVisualization} />
            <Route exact path='/table' component={DataTable} />
            <Route exact path='/map' component={MapVisualization} />
            <Route render={() => <Redirect to="/" />} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
