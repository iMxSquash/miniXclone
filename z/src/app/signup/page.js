import Link from "next/link";
import { URL } from '../utils/constant/utls';
import SignupForm from "../components/container/signupform";

export default async function Signup() {

  return (
    <>
      <div className="bg-blue-600">
      <SignupForm />
      </div>
    </>
  );
}