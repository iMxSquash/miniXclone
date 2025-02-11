'use client'

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
      <h1>Login</h1>
      <form onSubmit={handleSignup} className='flex flex-col gap-4'>
        <input type="text" name="name" required />
        <input type="email" name="email" required />
        <input type="password" name="password" required />
        <button type="submit">Sign up</button>
      </form>
    </div>
  );
}
