import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";

const Logout = () => {
    const { loggedOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (loggedOut) {
            navigate("/login");
        }
    }, [loggedOut, navigate]);

    return null;
};

export default Logout;
