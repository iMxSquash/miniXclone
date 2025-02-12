import Link from "next/link";
import { URL } from '../../utils/constant/utls';

const UserId = () => {
    return (
        <>
            <div className="bg-blue-600">
                <p>UserId work</p>
            </div>
        </>
    );
}

export default withAuth(UserId);