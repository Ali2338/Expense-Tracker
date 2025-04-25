
/*import { use } from "react";
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";


export const useUserAuth = () => {
    const {user, updateUser, clearUser} = useContext(UserContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (user) return;
        let mounted = true;
        const fetchUserInfo = async () => {
            try{
                const response = await axiosInstance.get(API_PATHS.AUTH.USER_INFO);
                if (isMounted && response.data) {
                    updateUser(response.data);
                }
            }catch (error) {
                console.error("Error fetching user info:", error);
import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const useUserAuth = () => {
    const {user, updateUser, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) return;

        let isMounted = true;

        const fetchUserInfo = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);

                if (isMounted && response.data) {
                    updateUser(response.data);
                }
            } catch(error) {
                console.error("Failed to fetch user info:", error);
>>>>>>> dab3eb1f6d026cdb223b004e4ef741794c16d2db
                if(isMounted) {
                    clearUser();
                    navigate("/login");
                }
            }
        };
<<<<<<< HEAD
        fetchUserInfo();
        return () => {
            mounted = false;
        };
    },[user, updateUser, clearUser, navigate]);
};*/
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const useUserAuth = () => {
  const { user, updateUser, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) return; // If the user is already logged in, skip fetching the user info.

    let isMounted = true;  // Track whether the component is mounted

    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
        if (isMounted && response.data) {
          updateUser(response.data); // Update user context with fetched user data
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        if (isMounted) {
          clearUser();  // Clear user context
          navigate("/login");  // Redirect to login if error occurs
        }
      }
    };

    fetchUserInfo();

    return () => {
      isMounted = false;  // Cleanup flag when component is unmounted
    };
  }, [updateUser, clearUser, navigate]);  // Dependencies array
};