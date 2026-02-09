import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in as admin, redirect to admin
  if (user?.isAdmin) {
    navigate('/admin', { replace: true });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Anmeldung fehlgeschlagen';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-chnebel-gray flex items-center justify-center p-8">
      <div className="bg-white rounded-lg p-10 w-full max-w-md shadow-md">
        <h1 className="text-chnebel-black text-3xl font-semibold text-center mb-2">GemschiHub</h1>
        <p className="text-gray-500 text-center mb-8 text-sm">Captain Login</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <div className="bg-red-100 text-red-700 px-3 py-3 rounded text-sm">
              {error}
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-chnebel-black text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="px-3 py-3 border border-gray-300 rounded text-base transition-colors focus:outline-none focus:border-chnebel-red disabled:bg-chnebel-gray disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-chnebel-black text-sm font-medium">Passwort</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
              className="px-3 py-3 border border-gray-300 rounded text-base transition-colors focus:outline-none focus:border-chnebel-red disabled:bg-chnebel-gray disabled:cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            className="bg-chnebel-red text-white border-none px-3 py-3 rounded text-base font-semibold cursor-pointer transition-colors hover:bg-[#c4161e] mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Laden...' : 'Anmelden'}
          </button>
        </form>

        <p className="text-gray-400 text-xs text-center mt-6">
          Nur für den Captain. Öffentliche Inhalte sind ohne Login zugänglich.
        </p>
      </div>
    </div>
  );
};
