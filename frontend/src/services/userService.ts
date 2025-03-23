export interface User {
    id?: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    password?: string;
    photo: string;
}

const fakeUsers: User[] = [{
    id: 1,
    name: "João da Silva",
    email: "joao@silva.com",
    phone: "(15)9998877-6655",
    address: "Rua da Bromélias, 199",
    password: "senhaHashed",
    photo: "user.png"
}, {
    id: 2,
    name: "José da Silva",
    email: "joao@silva.com",
    phone: "(15)9998877-6655",
    address: "Rua da Bromélias, 199",
    password: "senhaHashed",
    photo: "user.png"
}]

const userService = {
    async getUsers() : Promise<User[]> {
        return fakeUsers
    }
}

export default userService;