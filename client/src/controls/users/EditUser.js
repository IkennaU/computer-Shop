import React from "react";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import EditUserForm from "./EditUserForm";
import { useGetUsersQuery } from "./usersApiSlice";

const EditUser = () => {
  const { id } = useParams();
  const { user } = useGetUsersQuery("usersLists", {
    selectFromResult: ({ data }) => ({ user: data?.entities[id] }),
  });
  const content = user ? (
    <EditUserForm user={user} />
  ) : (
    <>
      Loading...
      <Loader />
    </>
  );

  return content;
};

export default EditUser;
