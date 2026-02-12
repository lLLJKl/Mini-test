import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Routes, Route } from "react-router";
import UserView from "@/pages/user/UserView.jsx";
import UserEdit from "@/pages/user/UserEdit.jsx";
import Home from "@/pages/Home.jsx";
import NotFound from "@/pages/NotFound.jsx";
import Nav from '@pages/Nav.jsx'
import Login from '@pages/login.jsx'
import Signup from "@pages/signup.jsx";

const App = () => {
  const paths = [
    {path: "/", element: <Home />},
    {path: "/userview", element: <UserView />},
    {path: "/useredit", element: <UserEdit />},
    {path: "/signup", element: <Signup />},
    {path: "/login", element: <Login />},
    {path: "*", element: <NotFound />},
    // {path: "board_edit", element: <Board_edit />},
    // {path: "board_view", element: <Board_view />},
    
  ]
  return (
    <>
        <Nav />
        <Routes>
          { paths?.map((v, i) => <Route key={i} path={v.path} element={v.element} />) }
        </Routes>
    </>
  )
}

export default App