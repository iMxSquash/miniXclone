'use client'

import Link from 'next/link';
import { loginUser } from '../../utils/auth';

export default function LoginForm() {
  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    await loginUser(email, password);
  };

  return (
    <div className='text-black'>
      <h1>Login</h1>
      <form onSubmit={handleLogin} className='flex flex-col gap-4'>
        <input type="email" name="email" required />
        <input type="password" name="password" required />
        <button type="submit">Login</button>
      </form>
      <Link href='/signup'>signup</Link>
    </div>
  );
}
