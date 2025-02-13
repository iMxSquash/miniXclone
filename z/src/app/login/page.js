import LoginForm from '../components/container/loginform';
import logo from '../../../public/logo-w.svg';
import Image from 'next/image';

const LoginPage = () => {
  return (
    <div className='w-full h-[100dvh] flex items-center'>
      <div className='flex flex-col gap-8 w-full px-12 md:flex-row md:justify-between md:items-center md:max-w-5xl mx-auto'>
        <Image src={logo} alt='logo' className='w-[5vh] md:w-[15vw] fill-foreground' />
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;