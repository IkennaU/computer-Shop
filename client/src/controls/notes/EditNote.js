import React from "react";
import { useParams } from "react-router-dom";
import EditNoteForm from "./EditNoteForm";
import Loader from "../../components/Loader";
import { useGetNotesQuery } from "./notesApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";
import { useAuth } from "../../hooks/useAuth";

const EditNote = () => {
  const { id } = useParams();
  const { isManager, isAdmin, username } = useAuth();
  const { note } = useGetNotesQuery("noteLists", {
    selectFromResult: ({ data }) => ({ note: data?.entities[id] }),
  });
  const { users } = useGetUsersQuery("usersLists", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });
  if (!note || !users?.length) {
    return (
      <>
        Loading...
        <Loader />
      </>
    );
  }
  if (!isManager && !isAdmin) {
    if (note.username !== username) {
      return <p className="errmsg">No Access</p>;
    }
  }
  const content = <EditNoteForm note={note} users={users} />;

  return content;
};

export default EditNote;
