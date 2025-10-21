import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#ffffff");
    }, []);


    const handleLogin = async (e) => {
        e.preventDefault();
        //setLoading(true);
        //setError(null);
        navigate('/dashboard')
    };

    return (
        <div className="h-screen flex items-center justify-center relative lg:bg-gray-100">
            <div className="bg-white bg-opacity-80 p-10 max-w-[400px] w-full z-10 relative lg:shadow-lg lg:rounded-md">
                <div className="text-left mb-6">
                    <h2 className="text-3xl font-semibold text-gray-800">Login to ServicePro</h2>
                    <p className="text-sm mt-2 text-gray-500">Access job records, manage engineers, and submit reports.</p>
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 mt-2 border bg-gray-100 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 mt-2 border bg-gray-100 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" id="remember" className="h-4 w-4 text-blue-500" />
                            <label htmlFor="remember" className="text-sm text-gray-600">Remember me</label>
                        </div>
                        <Link to="/reset" className="text-sm text-blue-500 hover:underline">Forgot Password?</Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-3 rounded-md"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
