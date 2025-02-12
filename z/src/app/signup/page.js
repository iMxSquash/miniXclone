import Link from "next/link";
import { URL } from '../utils/constant/utls';
import SignupForm from "../components/container/signupform";

const Signup = () => {

  return (
    <>
      <div className="bg-blue-600">
      <SignupForm />
      </div>
    </>
  );
}

export default Signup;