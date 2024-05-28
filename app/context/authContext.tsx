'use client'
import { ReactNode, createContext, useEffect, useReducer, useCallback } from "react";
import useLocalStorage from "../hook/useLocalStorage";
import axios from 'axios'

type AuthState = {
    isAuthenticated: boolean | null;
    token: string | null;
    roles: string | null;
}


type AuthContextType = {
    isAuthenticated: boolean | null;
    token: string | null;
    roles: string | null;
    loginState: (token: string, roles: string) => void;
    logoutState: () => void;
}

const initialState = {
    isAuthenticated: null,
    token: null,
    roles: null
}

export const AuthContext = createContext<AuthContextType>({
    ...initialState,
    loginState: () => { },
    logoutState: () => { },
});

const reducer = (state: AuthState, action: { type: string, payload: any }) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                isAuthenticated: true,
                roles: action.payload.roles,
                token: action.payload.token,
            }
        case 'LOGOUT':
            return {
                isAuthenticated: false,
                roles: null,
                token: null,
            }
        case 'LOADING':
            return {
                isAuthenticated: null,
                roles: null,
                token: null,
            }
        default:
            return state;
    }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [accessToken, setToken, clearToken] = useLocalStorage('accessToken', ' ');
    const [roles, setRoles, clearRoles] = useLocalStorage('roles', ' ')
    const [state, dispatch] = useReducer(reducer, initialState);

    const loginState = useCallback((token: string, roles: string) => {
        setToken(token);
        setRoles(roles);
        dispatch({
            type: 'LOGIN',
            payload: { token, roles },
        })
    }, [setToken, setRoles])

    const logoutState = useCallback(() => {
        clearToken();
        clearRoles();
        dispatch({
            type: 'LOGOUT',
            payload: { token: null, roles: null },
        })
    }, [clearToken, clearRoles])

    useEffect(() => {
        if (accessToken) {
            dispatch({
                type: 'LOGIN',
                payload: { token: accessToken, roles },
            })
        } else {
            dispatch({
                type: 'LOGOUT',
                payload: { token: null, roles: null },
            })
        }
    }, [accessToken, roles])

    useEffect(() => {
        const revalidateToken = async () => {
            try {
                await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/validate`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
            } catch (error: any) {
                try {
                    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/refresh`, {}, {
                        withCredentials: true,
                    });
                    loginState(response.data.accessToken, response.data.roles);
                } catch (error: any) {
                    logoutState();
                }
            }
        }
        if (state.isAuthenticated) revalidateToken();
    }, [state.isAuthenticated, accessToken, loginState, logoutState])

    return (
        <AuthContext.Provider value={{ ...state, loginState, logoutState }}>
            {children}
        </AuthContext.Provider>
    )
}
