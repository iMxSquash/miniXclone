'use client'

import Link from 'next/link';
import { registerUser } from '../../utils/auth';

export default function SignupForm() {
  const handleSignup = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    console.log(name);
    await registerUser(name, email, password);
  };

  return (
    <div className='text-black'>
      <h1>Signup</h1>
      <form onSubmit={handleSignup} className='flex flex-col gap-4'>
        <label htmlFor="name">Pseudo</label>
        <input type="text" name="name" placeholder='Votre pseudo' required />
        <label htmlFor="email">Email</label>
        <input type="email" name="email" placeholder='Votre email' required />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" placeholder='Votre mot de passe' required />
        <button type="submit">Sign up</button>
      </form>
      <Link href='/login'>login</Link>
    </div>
  );
}
