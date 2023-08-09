import { Routes, Route } from "react-router-dom"
import Home from "./Pages/Home"

import Result from "./Pages/Result/Result"
import Vote from "./Pages/Vote/Vote"




function App() {
  return (
    <div className="App">    
   
      <Routes>     
        {/* nav routes  */}
        <Route path="/" element={ <Home/> } />
        <Route path="/vote" element={ <Vote/> } />
        <Route path="/result" element={ <Result/> } />
 

        {/* pages */}
        {/* <Route path="/visiting-card" element={ <VistingTypes/>} /> */}

      </Routes>
    </div>
  )
}

export default App