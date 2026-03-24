import { BrowserRouter } from "react-router-dom"
import Containers from "./Containers"
import "./App.css"
import { ResultDataProvider } from "./context/ResultDataContext"

function App() {
  return (
    <BrowserRouter>
      <ResultDataProvider>
        <Containers />
      </ResultDataProvider>
    </BrowserRouter>
  )
}

export default App
