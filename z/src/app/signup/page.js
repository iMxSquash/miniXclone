import SignupForm from "../components/container/signupform";
import Image from "next/image";
import logo from '../../../public/logo-w.svg';


const Signup = async () => {

  return (
    <div className='w-full h-[100dvh] flex items-center'>
      <div className='flex flex-col gap-8 w-full px-12 md:flex-row md:justify-between md:items-center md:max-w-5xl mx-auto'>
        <Image src={logo} alt='logo' className='w-[5vh] md:w-[15vw] fill-foreground' />
        <SignupForm />
      </div>
    </div>
  );
}

export default Signup;