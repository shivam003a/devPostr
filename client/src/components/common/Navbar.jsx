import { Code } from 'lucide-react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

function Navbar({ showNav = true }) {
    const { isAuthenticated } = useSelector((state) => state.auth)

    return (
        <div className="bg-dark-blue backdrop-blur-lg p-2 h-[64px] sticky top-0 left-0 right-0 z-100">
            <div className="max-w-[1200px] h-full mx-auto flex flex-row justify-between items-center gap-2">

                {/* Logo */}
                <NavLink to='/'>
                    <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-tr from-light-blue-1 to-light-blue-2 p-2 rounded-lg">
                            <Code size={18} color="#ffffff" />
                        </div>
                        <span className="text-white font-poppins text-2xl font-semibold">devPostr</span>
                    </div>
                </NavLink>

                {/* Button */}
                {showNav &&
                    <div>
                        <NavLink to={isAuthenticated ? "/dashboard" : "/login"} className="py-2 px-6 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] text-white text-lg rounded-lg flex items-center gap-4 cursor-pointer hover:bg-light-blue-1 hover:text-black transition-all duration-200">
                            <span className="text-sm font-poppins font-semibold">{isAuthenticated ? "Dashboard" : "Login"}</span>
                        </NavLink>
                    </div>
                }
            </div>
        </div>
    )
}


export default Navbar