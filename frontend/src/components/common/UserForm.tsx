import { useState } from 'react';

interface UserFormProps {
    onSubmit: (data: any) => void;
    initialData?: any;
}

const UserForm = ({ onSubmit, initialData }: UserFormProps) => {
    const [formData, setFormData] = useState(initialData || { name: '', email: '', password: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full p-2 border rounded"
            />
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-2 border rounded"
            />
            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full p-2 border rounded"
            />
            <button type="submit" className="bg-secondary text-light px-4 py-2 rounded">
                Submit
            </button>
        </form>
    );
};

export default UserForm;