'use client'

import Link from 'next/link';
import { registerUser } from '../../utils/auth';

export default function SignupForm() {
  const handleSignup = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    await registerUser(name, email, password);
  };

  return (
    <div className='w-full md:w-[30vw] lg:w-[20vw] flex flex-col gap-8'>
      <h1 className='font-black text-2xl'>Inscrivez-vous à Z.</h1>
      <form onSubmit={handleSignup} className='flex flex-col gap-4'>
        <div className='relative'>
          <input
            id="name"
            type="text"
            name="name"
            autoComplete="off"
            placeholder='Votre pseudo'
            required
            className='peer bg-transparent text-secondary-light w-full rounded-sm pb-2 pt-6 px-4 border border-secondary transition-all focus:outline-none focus:border-primary focus:ring-primary placeholder:invisible'
          />
          <label
            htmlFor="name"
            className='absolute left-4 transition-all translate-y-2 peer-focus:translate-y-2 text-xs peer-placeholder-shown:translate-y-4 peer-placeholder-shown:text-base peer-focus:text-primary peer-focus:text-xs'
          >
            Pseudo
          </label>
        </div>
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
          Sign up
        </button>
      </form>
      <div className='w-full flex flex-col gap-4'>
        <h3 className='font-bold'>Vous avez déjà un compte ?</h3>
        <Link
          href='/login'
          className='text-primary w-full flex justify-center border border-primary-light py-2 font-bold rounded-full transition-all hover:bg-primary-light/10'
        >
          Login
        </Link>
      </div>
    </div>
  );
}
