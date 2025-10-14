import { LogIn, Mail, Lock, ArrowLeft, CircleUser, Eye, EyeOff } from "lucide-react"
import { NavLink, useNavigate } from "react-router-dom"
import { useState } from "react";
import { register } from "../redux/slices/auth.slice";
import { useDispatch, useSelector } from "react-redux";
import toast from 'react-hot-toast'
import { registerSchema } from "../utils/zodSchema";
import ForgotPasswordModal from "../components/common/ForgotPasswordModal";

function Register() {
    const [user, setUser] = useState({ name: '', email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({})
    const [forgotPass, setForgotPass] = useState(false)

    const { loading } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleUserInput = (e) => {
        const { name, value } = e?.target;

        setUser(prev => ({
            ...prev, [name]: value
        }))
    }

    const handleRegister = async (e) => {
        e?.preventDefault()

        const parsed = registerSchema.safeParse(user)
        if (!parsed.success) {
            const fieldErrors = {}
            parsed.error.issues?.map((err) => {
                fieldErrors[err.path[0]] = err?.message
            })
            setErrors(fieldErrors)
            return;
        }

        setErrors({})
        const resultAction = await dispatch(register(user))

        if (register.fulfilled.match(resultAction)) {
            toast.success('OTP Sent!')
            navigate('/verify-otp')

        }
        else if (register.rejected.match(resultAction)) {
            toast.error(resultAction.payload)
        }
    }


    return (
        <>
            <div className="w-full min-h-dvh bg-dark-blue relative overflow-hidden flex items-center justify-center">
                <div className="max-w-[1200px] h-full mx-auto flex flex-col items-center justify-center gap-8 p-2 pt-8 pb-12">
                    <div className="w-9/10 sm:w-88 min-h-[460px] bg-[rgba(255,255,255,0.1)] rounded-lg border border-[rgba(255,255,255,0.2)] flex flex-col items-center justify-center gap-3 p-4">
                        <div className="w-12 h-12 rounded-xl bg-light-blue-1 flex items-center justify-center">
                            <LogIn />
                        </div>
                        <h1 className="text-2xl font-poppins font-bold text-light-blue-1">Sign up with email</h1>
                        <p className="text-sm font-poppins text-gray text-center">Join devPostr to create, share, and explore beautiful code snippets.</p>

                        <form className="w-full flex flex-col items-center gap-2 mt-2" onSubmit={handleRegister}>
                            <div className="w-full flex flex-col gap-1">
                                <div className="flex items-center gap-2 bg-gray w-full px-2 py-1 rounded-md">
                                    <CircleUser size={14} />
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        className="text-sm p-1 w-full auth-input !outline-0 !border-0"
                                        name="name"
                                        autoComplete="off"
                                        value={user?.name}
                                        onChange={handleUserInput}
                                    />
                                </div>
                                {errors.name && <p className="text-red-500 text-xs -mt-1">{errors.name}</p>}
                            </div>
                            <div className="w-full flex flex-col gap-1">
                                <div className="flex items-center gap-2 bg-gray w-full px-2 py-1 rounded-md">
                                    <Mail size={14} />
                                    <input
                                        type="text"
                                        placeholder="Email"
                                        className="text-sm p-1 w-full auth-input !outline-0 !border-0"
                                        name="email"
                                        autoComplete="off"
                                        value={user?.email}
                                        onChange={handleUserInput}
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-xs -mt-1">{errors.email}</p>}
                            </div>
                            <div className="w-full flex flex-col gap-1">
                                <div className="flex items-center gap-2 bg-gray w-full px-2 py-1 rounded-md relative">
                                    <Lock size={14} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        className="text-sm p-1 w-full auth-input !outline-0 !border-0"
                                        name="password"
                                        autoComplete="off"
                                        value={user?.password}
                                        onChange={handleUserInput}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-300 cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff size={16} color="#000" /> : <Eye size={16} color="#000" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs -mt-1">{errors.password}</p>}
                            </div>

                            <button className="w-full rounded-md mt-4 text-md font-semibold p-1 bg-gradient-to-tl from-light-blue-1 to-light-blue-2 disabled:bg-light-blue-1/80 cursor-pointer" disabled={loading}>{loading ? <Loader size={22} strokeWidth={1} className="animate-spin mx-auto" /> : "Register"}</button>
                        </form>
                        <p
                            className="w-full text-end text-light-blue-1 font-light text-[10px] font-poppins -mt-2 hover:underline cursor-pointer"
                            onClick={() => setForgotPass(true)}
                        >
                            Forgot password?
                        </p>

                        <p className="text-gray-400 text-sm text-center mt-4">
                            Already have an account?{" "}
                            <NavLink to="/login" className="text-light-blue-1 hover:text-light-blue-2">
                                Login
                            </NavLink>
                        </p>
                    </div>
                </div>

                {/* bg elements */}
                <div className="absolute top-0 left-1/4 w-30 h-30 rounded-full bg-light-blue-1 opacity-5 shadow-[0px_0px_20px_120px_#3c83f6] random-animate"></div>
                <div className="absolute top-1/2 left-3/4 w-30 h-30 rounded-full bg-light-blue-1 opacity-10 shadow-[0px_0px_50px_160px_#3c83f6] random-animate-1"></div>

                {/* navigate back */}
                <NavLink to={'/'} className="absolute top-4 left-4 cursor-pointer border border-[rgba(255,255,255,0.2)] w-10 h-10 rounded-full flex items-center justify-center bg-[rgba(255,255,255,0.1)]">
                    <ArrowLeft size={16} color="#fff" />
                </NavLink>

                <ForgotPasswordModal
                    forgotPass={forgotPass}
                    setForgotPass={setForgotPass}
                />
            </div>
        </>
    )
}

export default Register