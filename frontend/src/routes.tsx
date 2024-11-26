import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import RequestTravel from "./components/pages/RequestTravel";
import TravelsHistory from "./components/pages/TravelsHistory";

const AppRoutes = ()=>{
  return(
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={App}>
            <Route index Component={RequestTravel}/>
            <Route path="history" Component={TravelsHistory}/>
          </Route>
        </Routes>
      </BrowserRouter>
    )
}

export default AppRoutes;