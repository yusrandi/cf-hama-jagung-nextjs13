import { Role, User } from "prisma/prisma-client";


export const UserService = {
    async getData() {
        return await fetch('/api/user', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json());
    },
    async createData(user: User) {
        return await fetch('/api/user',
            {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json'

                },
                method: 'POST',
                body: JSON.stringify({
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    role: user.role,
                }),
            }

        )
            .then((res) => res.json());
    },
    async updateData(user: User) {
        return await fetch(`/api/user/${user.id}`,
            {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json'

                },
                method: 'PATCH',
                body: JSON.stringify({
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    role: user.role,
                }),
            }

        )
            .then((res) => res.json());
    },

    async deleteData(user: User) {
        return await fetch(`/api/user/${user.id}`,
            {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json'

                },
                method: 'DELETE'
            }

        )
            .then((res) => res.json());
    },
    async registerUser(name: string, email: string, password: string) {
        return await fetch('/api/register',
            {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json'

                },
                method: 'POST',
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                    role: Role.USER,
                }),
            }

        )
            .then((res) => res.json());
    },
    async loginUser(username: string, password: string) {
        return await fetch('/api/login',
            {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json'

                },
                method: 'POST',
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            }

        )
            .then((res) => res.json());
    },
    
    
}