import Link from "next/link";
import { URL } from '../utils/constant/utls';
import withAuth from "../components/withAuth";

const Messages = () => {

  return (
    <>
      <div className="bg-blue-600">
      <p>Message work</p>
      </div>
    </>
  );
}

export default withAuth(Messages);