import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginPageProp = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/api/v1/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const result = await response.text();
                throw new Error(result);
            }

            const result = await response.json();
            setUser(result.user);
            setMessage('Login successful!');
            navigate('/');
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    const handleLogout = () => {
        setUser(null);
        setMessage('Logout successful!');
    };

    return (
        <div className="min-h-screen flex items-start justify-start md:bg-cover bg-center bg-loginBg">
            <div className="scale-105 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-10 w-full md:w-1/4 shadow-lg ml-10 md:mt-48">
                <h2 className="font-bold text-3xl text-white mb-12">{user ? 'Welcome' : 'Login Page'}</h2>
                {message && <p className="text-red-600 mb-4">{message}</p>}
                {user ? (
                    <div>
                        <p className="text-white">Logged in as: {user.email}</p>
                        <button
                            onClick={handleLogout}
                            className="w-full py-2 px-4 bg-red-700 text-white font-bold rounded hover:bg-red-800"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-wrap scale-105 text-2xl">
                            <div className="w-full px-4">
                                <div className="mb-4">
                                    <label className="block text-white">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full p-2 mt-1 rounded border border-gray-300 bg-transparent text-white"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-white">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full p-2 mt-1 rounded border border-gray-300 bg-transparent text-white"
                                        required
                                    />
                                </div>
                                <div className='text-center w-full text-white m-1 mb-3'>
                                    <Link to="/loginOtp">Click here to Login Via OTP</Link>
                                </div>
                                <div className='text-center w-full text-white m-1 mb-3'>
                                    <Link to="/reg">Click here to Register</Link>
                                </div>
                                <div className="mb-4">
                                    <button
                                        type="submit"
                                        className="w-full py-2 px-4 bg-blue-700 text-white font-bold rounded hover:bg-blue-800"
                                    >
                                        Login
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginPageProp;
