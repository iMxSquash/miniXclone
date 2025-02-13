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
    <div className='w-full md:w-[30vw] lg:w-[20vw] flex flex-col gap-8'>
      <h1 className='font-black text-2xl'>Connectez-vous à Z.</h1>
      <form onSubmit={handleLogin} className='flex flex-col gap-4'>
        <div className='relative'>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="off"
            placeholder='Votre email'
            required
            className='peer bg-transparent text-secondary-light w-full rounded-sm pb-2 pt-6 px-4 border border-secondary transition-all focus:outline-none focus:border-primary focus:ring-primary placeholder:invisible'
          />
          <label
            htmlFor="email"
            className='absolute left-4 transition-all translate-y-2 peer-focus:translate-y-2 text-xs peer-placeholder-shown:translate-y-4 peer-placeholder-shown:text-base peer-focus:text-primary peer-focus:text-xs'
          >
            Email
          </label>
        </div>
        <div className='relative'>
          <input
            id="password"
            type="password"
            name="password"
            autoComplete="off"
            placeholder='Votre mot de passe'
            required
            className='peer bg-transparent text-secondary-light w-full rounded-sm pb-2 pt-6 px-4 border border-secondary transition-all focus:outline-none focus:border-primary focus:ring-primary placeholder:invisible'
          />
          <label
            htmlFor="password"
            className='absolute left-4 transition-all translate-y-2 peer-focus:translate-y-2 text-xs peer-placeholder-shown:translate-y-4 peer-placeholder-shown:text-base peer-focus:text-primary peer-focus:text-xs'
          >
            Mot de passe
          </label>
        </div>
        <button
          type="submit"
          className='w-full font-bold text-sm text-background-light bg-primary py-2 rounded-full transition-all hover:bg-primary-dark'
        >
          Login
        </button>
      </form>
      <div className='w-full flex flex-col gap-4'>
        <h3 className='font-bold'>Vous n'avez pas de compte ?</h3>
        <Link
          href='/signup'
          className='text-primary w-full flex justify-center border border-primary-light py-2 font-bold rounded-full transition-all hover:bg-primary-light/10'
        >
          S'inscrire
        </Link>
      </div>
    </div>
  );
}
