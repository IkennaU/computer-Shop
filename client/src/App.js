import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./controls/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./controls/auth/Welcome";
import NoteLists from "./controls/notes/NoteLists";
import UsersLists from "./controls/users/UsersLists";
import EditNote from "./controls/notes/EditNote";
import NewUserForm from "./controls/users/NewUserForm";
import EditUser from "./controls/users/EditUser";
import NewNote from "./controls/notes/NewNote";
import Prefetch from "./controls/auth/Prefetch";
import PersistLogin from "./controls/auth/PersistLogin";
import RequireAuth from "./controls/auth/RequireAuth";
import { ROLES } from "./config/roles";
import useTitle from "./hooks/useTitle";

function App() {
  useTitle("HiroHito Repairs..");
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route index element={<Public />} />
          <Route path="login" element={<Login />} />

          <Route element={<PersistLogin />}>
            <Route
              element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
            >
              <Route element={<Prefetch />}>
                <Route path="dash" element={<DashLayout />}>
                  <Route index element={<Welcome />} />

                  <Route path="notes">
                    <Route index element={<NoteLists />} />
                    <Route path=":id" element={<EditNote />} />
                    <Route path="new" element={<NewNote />} />
                  </Route>
                  <Route
                    element={
                      <RequireAuth
                        allowedRoles={[ROLES.Manager, ROLES.Admin]}
                      />
                    }
                  >
                    <Route path="users">
                      <Route index element={<UsersLists />} />
                      <Route path=":id" element={<EditUser />} />
                      <Route path="new" element={<NewUserForm />} />
                    </Route>
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
