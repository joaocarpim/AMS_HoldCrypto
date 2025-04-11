"use client";
import { useEffect, useState } from "react";
import userService, { User } from "@/services/userService";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const data = await userService.getUsers();
                setUsers(data);
            } catch (error) {
                console.log("Erro ao buscar usuários", error);
            }
        }
        fetchUsers();
    }, []);

    return (
        <div>
            <h1>Lista de Usuários</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}