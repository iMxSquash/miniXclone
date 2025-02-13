import Link from "next/link";
import { URL } from '../../utils/constant/utls';
import withAuth from "@/app/components/withAuth";

const getUser = async (id) => {
    const response = await fetch(`${URL.USER_GET}/${id}`);

    if (!response.ok) {
        throw new Error('Failed to fetch user');
    }

    return response.json();
}

const UserId = async ({ params }) => {
    try {
        const { id } = params;
        const user = await getUser(id);

        return (
            <div className="user-info">
            <h1>User Information</h1>
            {user.user &&
                Object.entries(user.user).map(([key, value]) => (
                <div key={key} className="info-item">
                    <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value}
                </div>
                ))
            }
            </div>
        );
    } catch (error) {
        return (
            <div>
                <p>Error fetching user: {error.message}</p>
            </div>
        );
    }
}

export default UserId;