// import Navbar from './components/Navbar'
import { BrowserRouter as Router, Route} from 'react-router-dom'
import Home from './pages/Home/index'

function App() {
  return (
    <Router>
      <div className="App">
        <Route path="/" component={Home}></Route>
      </div>
    </Router>
  )
}

export default App
