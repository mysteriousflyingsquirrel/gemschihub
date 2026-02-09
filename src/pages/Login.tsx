import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!invitationCode.trim()) {
          setError('Invitation code is required');
          setLoading(false);
          return;
        }
        await signup(email, password, invitationCode);
      } else {
        await login(email, password);
      }
      navigate('/events');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-chnebel-gray flex items-center justify-center p-8">
      <div className="bg-white rounded-lg p-10 w-full max-w-md shadow-md">
        <h1 className="text-chnebel-black text-3xl font-semibold text-center mb-8">GemschiHub</h1>
        <div className="flex gap-2 mb-8 border-b-2 border-chnebel-gray">
          <button
            className={`flex-1 py-3 border-none bg-transparent text-gray-600 text-base cursor-pointer border-b-2 -mb-[2px] transition-all hover:text-chnebel-black ${
              !isSignUp ? 'text-chnebel-red border-b-chnebel-red font-semibold' : 'border-transparent'
            }`}
            onClick={() => setIsSignUp(false)}
            type="button"
          >
            Login
          </button>
          <button
            className={`flex-1 py-3 border-none bg-transparent text-gray-600 text-base cursor-pointer border-b-2 -mb-[2px] transition-all hover:text-chnebel-black ${
              isSignUp ? 'text-chnebel-red border-b-chnebel-red font-semibold' : 'border-transparent'
            }`}
            onClick={() => setIsSignUp(true)}
            type="button"
          >
            Sign Up
          </button>
        </div>

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
            <label htmlFor="password" className="text-chnebel-black text-sm font-medium">Password</label>
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

          {isSignUp && (
            <div className="flex flex-col gap-2">
              <label htmlFor="invitationCode" className="text-chnebel-black text-sm font-medium">Invitation Code</label>
              <input
                id="invitationCode"
                type="text"
                value={invitationCode}
                onChange={(e) => setInvitationCode(e.target.value)}
                required
                disabled={loading}
                placeholder="Enter your invitation code"
                className="px-3 py-3 border border-gray-300 rounded text-base transition-colors focus:outline-none focus:border-chnebel-red disabled:bg-chnebel-gray disabled:cursor-not-allowed"
              />
            </div>
          )}

          <button
            type="submit"
            className="bg-chnebel-red text-white border-none px-3 py-3 rounded text-base font-semibold cursor-pointer transition-colors hover:bg-[#c4161e] mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

