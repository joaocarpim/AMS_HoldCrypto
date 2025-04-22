import Link from 'next/link';

const HomePage = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-4xl font-bold">Bem-vindo à AMS Trade</h1>
                <p className="mt-4">Faça login ou registre-se para começar.</p>
                <div className="mt-6 space-x-4">
                    <Link href="/login" className="bg-blue-500 text-white px-4 py-2 rounded">
                        Login
                    </Link>
                    <Link href="/register" className="bg-green-500 text-white px-4 py-2 rounded">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;