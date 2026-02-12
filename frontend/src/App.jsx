import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Routes, Route } from "react-router";
import UserView from "@/pages/user/UserView.jsx";
import UserEdit from "@/pages/user/UserEdit.jsx";
import Home from "@/pages/Home.jsx";
import NotFound from "@/pages/NotFound.jsx";


const App = () => {
  const paths = [
    {path: "/", element: <Home />},
    {path: "/user_view", element: <UserView />},
    {path: "/user_edit", element: <UserEdit />},
    {path: "*", element: <NotFound />},
  ]
  return (
    <>
        <Routes>
          { paths?.map((v, i) => <Route key={i} path={v.path} element={v.element} />) }
        </Routes>
    </>
  )
}

export default App