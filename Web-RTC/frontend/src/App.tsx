import { BrowserRouter , Routes , Route  } from "react-router-dom"
import Home from "./pages/Home";
import Room from "./pages/Room";
import Info from "./pages/Info";


const App = () => {


return (

  <div>

 <BrowserRouter>
 <Routes>


 <Route path="/"  element={<Home/>} />
 <Route path="/room/:id"  element={<Room/>} />
 <Route path="/info"  element={<Info/>} />


 </Routes>
  
 </BrowserRouter>

  </div>
)


}

export default App;