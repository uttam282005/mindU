// components/SignIn.tsx
'use client'
import { useState } from 'react';
import { signUp, login, logout } from '@/lib/auth'

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await signUp(email, password);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSignIn}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p>{error}</p>}
      <button type="submit">Sign In</button>
    </form>
  );
};

export default SignIn;
