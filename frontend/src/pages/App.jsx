import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Routes, Route } from "react-router";
import Home from '@pages/Home.jsx'
import Nav from '@pages/Nav.jsx'
import Login from '@pages/login.jsx'
import Signup from "@pages/signup.jsx";

const NotFound = () => {
  return (
    <div className="text-center">
      <h1>404</h1>
      <p>페이지를 찾을 수 없습니다.</p>
    </div>
  )
}

const App = () => {
  const paths = [
    {path: "/", element: <Home />},
    {path: "/signup", element: <Signup />},
    {path: "/login", element: <Login />},
    {path: "*", element: <NotFound />},
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