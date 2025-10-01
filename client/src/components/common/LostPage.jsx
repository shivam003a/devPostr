import { NavLink } from "react-router-dom";
import { Code } from "lucide-react";

export default function LostPage() {
    return (
        <div
            className="min-h-screen flex items-center justify-center bg-dark-blue font-poppins text-white"
        >
            <div className="bg-light-blue rounded-2xl shadow-2xl w-[90%] max-w-2xl overflow-hidden">
                {/* Header bar with logo */}
                <div className="flex items-center justify-between px-4 py-3 bg-dark-blue">
                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-cs-red"></span>
                        <span className="h-3 w-3 rounded-full bg-cs-yellow"></span>
                        <span className="h-3 w-3 rounded-full bg-cs-green"></span>
                    </div>
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
                <div className="px-8 py-16 text-center">
                    <h1 className="text-6xl font-bold bg-gradient-to-r from-light-blue-1 to-light-blue-2 bg-clip-text text-transparent">
                        404
                    </h1>
                    <p className="mt-4 text-lg text-gray">Are you lost?</p>
                    <p className="mt-2 text-sm font-poppins text-gray">
                        The page you are looking for doesn’t exist or has been moved.
                    </p>

                    <NavLink
                        to="/"
                        className="mt-8 inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-light-blue-1 to-light-blue-2 hover:scale-105 transition-transform duration-300 font-medium"
                    >
                        Go Home
                    </NavLink>
                </div>
            </div>
        </div>
    );
}
