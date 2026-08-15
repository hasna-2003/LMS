import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

const USERS_KEY = 'learnhub_users';
const SESSION_KEY = 'learnhub_session';

const readUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
};

const isAuthenticated = () => {
  try {
    return Boolean(localStorage.getItem(SESSION_KEY));
  } catch {
    return false;
  }
};

const AuthPage = ({ mode = 'login' }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    const email = form.email.trim();
    const password = form.password.trim();

    if (!email || !password || (mode === 'register' && !form.name.trim())) {
      setError('Please fill in all required fields.');
      return;
    }

    const users = readUsers();

    if (mode === 'register') {
      const normalizedEmail = email.toLowerCase();
      const alreadyExists = users.some((user) => user.email.toLowerCase() === normalizedEmail);

      if (alreadyExists) {
        setError('An account with this email already exists. Please sign in instead.');
        return;
      }

      const newUser = {
        name: form.name.trim(),
        email: normalizedEmail,
        password,
      };

      localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
      localStorage.setItem(SESSION_KEY, JSON.stringify({ name: newUser.name, email: newUser.email }));
      navigate('/');
      return;
    }

    const matchedUser = users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password
    );

    if (!matchedUser) {
      setError('Invalid email or password. Please try again.');
      return;
    }

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ name: matchedUser.name, email: matchedUser.email })
    );
    navigate('/');
  };

  const isRegisterMode = mode === 'register';

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">LearnHub</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            {isRegisterMode ? 'Create an account' : 'Welcome back'}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {isRegisterMode
              ? 'Sign up to access your courses.'
              : 'Sign in to continue learning.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegisterMode && (
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white"
                placeholder="Your full name"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
          >
            {isRegisterMode ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          {isRegisterMode ? 'Already have an account?' : 'Need an account?'}{' '}
          <Link
            to={isRegisterMode ? '/login' : '/register'}
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            {isRegisterMode ? 'Sign in' : 'Create one'}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
