import Image from "next/image";
import logo from "../../public/logo-w.svg";

const Loading = () => {

    return (
        <>
            <div className="w-full py-[25vh] flex items-center justify-center">
                <Image src={logo} alt='logo' className='w-[5vw] pulse' />
            </div>
        </>
    );
};

export default Loading;