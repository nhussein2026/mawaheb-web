import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Login from "./Login";
import Waiting from "./Waiting";
import { homePathFor } from "../utils/roles";

// "/" sends signed-in users to their own home; users whose role has not been
// assigned yet see the waiting page; everyone else signs in.
const Home = () => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  if (!token) return <Login />;
  const home = homePathFor(user);
  if (home === "/") return <Waiting />;
  return <Navigate to={home} replace />;
};

export default Home;
