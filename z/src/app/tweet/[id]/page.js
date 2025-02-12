import Link from "next/link";
import { URL } from '../../utils/constant/utls';

const TweetId = () => {

    return (
        <>
            <div className="bg-blue-600">
                <p>TweetId work</p>
            </div>
        </>
    );
}

export default withAuth(TweetId);