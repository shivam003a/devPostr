import { NavLink } from "react-router-dom";
import { Code } from "lucide-react";

export default function LostPage() {
    return (
        <div
            className="h-screen w-full flex items-center justify-center bg-dark-blue font-poppins text-white relative"
        >
            <div className="w-full h-full bg-light-blue shadow-2xl overflow-hidden">
                {/* Header bar with logo */}
                <div className="flex items-center justify-between p-4 bg-dark-blue">
                    <NavLink to='/'>
                        <div className="flex items-center gap-2">
                            <div className="bg-gradient-to-tr from-light-blue-1 to-light-blue-2 p-2 rounded-lg">
                                <Code size={18} color="#ffffff" />
                            </div>
                            <span className="text-white font-poppins text-2xl font-semibold">
                                devPostr
                            </span>
                        </div>
                    </NavLink>
                </div>

                {/* Body */}
                <div className="w-full h-full px-8 py-16 text-center flex flex-col justify-center items-center">
                    <h1 className="text-6xl font-bold bg-gradient-to-r from-light-blue-1 to-light-blue-2 bg-clip-text text-transparent">
                        404
                    </h1>
                    <p className="mt-4 text-xl text-gray">Are you lost?</p>
                    <p className="mt-2 text-xs font-poppins text-gray">
                        The page you are looking for doesn’t exist or has been moved.
                    </p>

                    <NavLink
                        to="/"
                        className="mt-8 inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-light-blue-1 to-light-blue-2 hover:scale-105 transition-transform duration-300 font-medium"
                    >
                        Go Home
                    </NavLink>
                </div>

                {/* blue circle */}
                <div className="absolute w-32 h-32 rounded-full bg-light-blue-1 backdrop-blur-xl opacity-5 shadow-[0px_0px_60px_120px_#3c83f6] top-1/3 left-2/3 random-animate"></div>
                <div className="absolute w-32 h-32 rounded-full bg-light-blue-1 backdrop-blur-xl opacity-5 shadow-[0px_0px_60px_120px_#3c83f6] top-[7%] left-[17%] random-animate-1"></div>
            </div>
        </div>
    );
}
