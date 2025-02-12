import LoginForm from '../components/container/loginform';
import logo from '../../../public/logo-w.svg';
import Image from 'next/image';

const LoginPage = () => {
  return (
    <div className='w-full h-[95dvh]'>
      <div className='flex justify-between items-center max-w-5xl mx-auto h-full'>
        <Image src={logo} alt='logo' className='w-[15vw] fill-foreground' />
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;