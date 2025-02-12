import SignupForm from "../components/container/signupform";
import Image from "next/image";
import logo from '../../../public/logo-w.svg';


const Signup = async () => {

  return (
    <div className='w-full h-[100dvh]'>
      <div className='flex justify-between items-center max-w-5xl mx-auto h-full'>
        <Image src={logo} alt='logo' className='w-[15vw] fill-foreground' />
        <SignupForm />
      </div>
    </div>
  );
}

export default Signup;