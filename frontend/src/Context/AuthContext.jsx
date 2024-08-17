/* eslint-disable react/prop-types */
import { createContext, useReducer } from "react";

const initialState = {
    token: localStorage.getItem("token") || null,
    userData : JSON.parse(localStorage.getItem("userData")) || null
};

// Create context
export const AuthContext = createContext(initialState);

// Reducer function to handle state changes based on action type
const reducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            // console.log(action.payload.userData)
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("userData",JSON.stringify(action.payload.userData))
            return {
                ...state,
                token: action.payload.token,
                userData :action.payload.userData
            };
        case "LOGOUT":
            localStorage.removeItem("token");
            localStorage.removeItem("userData")
            return {
                ...state,
                token: null,
                userData:null
            };
        default:
            return state;
    }
};

// Context Provider component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};
