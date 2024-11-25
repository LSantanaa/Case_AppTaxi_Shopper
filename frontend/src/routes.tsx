import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import RequestTravel from "./components/pages/RequestTravel";

const AppRoutes = ()=>{
  return(
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={App}>
            <Route index Component={RequestTravel}/>
           
          </Route>
        </Routes>
      </BrowserRouter>
    )
}

export default AppRoutes;