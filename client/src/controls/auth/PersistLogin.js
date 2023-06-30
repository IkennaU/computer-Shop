import React, { useState, useRef, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { useRefreshMutation } from "./authApiSlice";
import { usePersists } from "../../hooks/usePersists";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";
import Loader from "../../components/Loader";

const PersistLogin = () => {
  const [persist] = usePersists();
  const token = useSelector(selectCurrentToken);
  const effectRan = useRef(false);

  const [trueSuccess, setTrueSuccess] = useState(false);
  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation();

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      const verifyRefreshToken = async () => {
        console.log("verify refresh token");
        try {
          await refresh();
          setTrueSuccess(true);
        } catch (error) {
          console.error(error);
        }
      };
      if (!token && persist) {
        verifyRefreshToken();
      }
    }
    return () => {
      effectRan.current = true;
    };
    // eslint-disable-next-line
  }, []);

  let content;
  if (!persist) {
    console.log("no persist");
    content = <Outlet />;
  } else if (isLoading) {
    console.log("loading");
    content = <Loader />;
  } else if (isError) {
    console.log("error");
    content = (
      <p className="errmsg">
        {error?.data?.message} <Link to="/login">Please Login Again</Link>
      </p>
    );
  } else if (isSuccess && trueSuccess) {
    console.log("success");
    content = <Outlet />;
  } else if (token && isUninitialized) {
    console.log("token and uninit");
    console.log(isUninitialized);
    content = <Outlet />;
  }

  return content;
};

export default PersistLogin;
