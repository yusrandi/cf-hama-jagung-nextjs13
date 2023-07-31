'use client'
import React, { createContext, Dispatch, ReactNode, useContext, useReducer } from 'react';

export interface User {
    name: string;
    age: number;
    image: string;
}

type Users = Record<string, User>;

interface UserState {
    users: Users;
}

type UserAction =
    | { type: 'UPDATE_USER'; userId: string; userData: Partial<User> }
    | { type: 'RESET_USERS' };

interface UserContextType {
    users: Users;
    dispatch: Dispatch<UserAction>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const userReducer = (state: UserState, action: UserAction): UserState => {
    switch (action.type) {
        case 'UPDATE_USER': {
            const { userId, userData } = action;
            return {
                ...state,
                users: {
                    ...state.users,
                    [userId]: { ...state.users[userId], ...userData }
                }
            };
        }
        case 'RESET_USERS': {
            return {
                ...state,
                users: {}
            };
        }
        default:
            return state;
    }
};
interface UserProviderProps {
    children: ReactNode
}
const UserProvider = ({ children }: UserProviderProps) => {
    const [state, dispatch] = useReducer(userReducer, {
        users: {
            // john: { name: 'John Doe', age: 25 },
            // jane: { name: 'Jane Smith', age: 30 },
            // mike: { name: 'Mike Johnson', age: 35 }
        }
    });

    return (
        <UserContext.Provider value={{ users: state.users, dispatch }}>
            {children}
        </UserContext.Provider>
    );
};

const useUserContext = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};

function getKeysWithMaxValue(obj: any) {
    const values: number[] = Object.values(obj);
    const max = Math.max(...values);
    return Object.keys(obj).filter(key => obj[key] === max);
}

export { UserProvider, useUserContext };
