import ProfilUser from "@/app/components/user/profilUser";
import { URL } from "../../utils/constant/utls";

const getUser = async (id) => {
    const response = await fetch(`${URL.USER_GET}/${id}`);

    if (!response.ok) {
        throw new Error("Failed to fetch user");
    }

    return response.json();
};

const UserId = async ({ params }) => {
    try {
        const { id } = await params;
        const userGeted = await getUser(id);

        return (
            <>
                <ProfilUser userGeted={userGeted} />
            </>
        );
    } catch (error) {
        return (
            <div>
                <p>Error fetching user: {error.message}</p>
            </div>
        );
    }
};

export default UserId;
