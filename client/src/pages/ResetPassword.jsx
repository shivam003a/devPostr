import { Key, Lock, Eye, EyeOff, ArrowLeft, AlertTriangle, Loader } from "lucide-react"
import { useState } from "react"
import { NavLink, useNavigate, useSearchParams } from "react-router-dom"
import { resetPasswordSchema } from "../utils/zodSchema"
import api from '../lib/axiosInstance'
import toast from "react-hot-toast"

export default function ResetPassword() {
    const [showPassword, setShowPassword] = useState(false)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")

    const navigate = useNavigate()


    const handlePasswordChange = async (e) => {
        e?.preventDefault();
        setLoading(true)
        try {
            const parsed = resetPasswordSchema.safeParse({ password, confirmPassword })
            if (!parsed.success) {
                const fieldErrors = {}
                parsed.error.issues?.map((err) => {
                    fieldErrors[err.path[0]] = err?.message
                })
                setErrors(fieldErrors)
                return;
            }
            setErrors({})

            const response = await api.post('/api/auth/reset-password', {
                password,
                token
            })
            toast.success(response.data.message)
            setPassword("")
            setConfirmPassword("")
            setErrors(false)
            navigate("/login", { replace: true })

        } catch (err) {
            const errorMsg = err.response.data.message;
            toast.error(errorMsg)
        } finally {
            setLoading(false)
        }
    }

    if (!token) {
        return (
            <div className="w-full min-h-dvh bg-dark-blue flex flex-col items-center justify-center px-4">
                <AlertTriangle className="text-red-500 w-16 h-16 mb-4" />
                <h1 className="font-poppins text-2xl text-gray-200 text-center mb-2">
                    Invalid Reset Link
                </h1>
                <p className="text-gray-400 text-center mb-6">
                    The password reset link you used is invalid or has expired.
                </p>
                <a
                    href="/login"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                    Go to Login
                </a>
            </div>
        )
    }

    return (
        <div className="w-full min-h-dvh bg-dark-blue relative overflow-hidden flex items-center justify-center">
            <div className="max-w-[1200px] h-full mx-auto flex flex-col items-center justify-center gap-8 p-2 pt-8 pb-12">
                <div className="w-9/10 sm:w-88 min-h-[460px] bg-[rgba(255,255,255,0.1)] rounded-lg border border-[rgba(255,255,255,0.2)] flex flex-col items-center justify-center gap-3 p-4">
                    <div className="w-12 h-12 rounded-xl bg-light-blue-1 flex items-center justify-center">
                        <Key />
                    </div>
                    <h1 className="text-2xl font-poppins font-bold text-light-blue-1">Reset Your Password</h1>
                    <p className="text-sm font-poppins text-gray text-center">Enter a new password for your devPostr account. Make sure it's strong and unique. This link will expire in 10 minutes.</p>

                    <form className="w-full flex flex-col items-center gap-2 mt-2" onSubmit={handlePasswordChange}>
                        <div className="w-full flex flex-col gap-1">
                            <div className="flex items-center gap-2 bg-gray w-full px-2 py-1 rounded-md relative">
                                <Lock size={14} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="text-md p-1 w-full auth-input !outline-0 !border-0"
                                    name="password"
                                    autoComplete="off"
                                    value={password}
                                    onChange={(e) => setPassword(e?.target?.value)}
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
                        <div className="w-full flex flex-col gap-1">
                            <div className="flex items-center gap-2 bg-gray w-full px-2 py-1 rounded-md relative">
                                <Lock size={14} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Confirm password"
                                    className="text-md p-1 w-full auth-input !outline-0 !border-0"
                                    name="confirmPassword"
                                    autoComplete="off"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e?.target?.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-300 cursor-pointer"
                                >
                                    {showPassword ? <EyeOff size={16} color="#000" /> : <Eye size={16} color="#000" />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-red-500 text-xs -mt-1">{errors?.confirmPassword}</p>}
                        </div>

                        <button className="w-full rounded-md mt-4 text-md font-semibold p-1 bg-gradient-to-tl from-light-blue-1 to-light-blue-2 disabled:bg-light-blue-1/80 cursor-pointer" disabled={loading}>{loading ? <Loader size={22} strokeWidth={1} className="animate-spin mx-auto" /> : "Reset Password"}</button>
                    </form>
                </div>
            </div>

            {/* bg elements */}
            <div className="absolute top-0 left-1/4 w-30 h-30 rounded-full bg-light-blue-1 opacity-5 shadow-[0px_0px_20px_120px_#3c83f6] random-animate"></div>
            <div className="absolute top-1/2 left-3/4 w-30 h-30 rounded-full bg-light-blue-1 opacity-10 shadow-[0px_0px_50px_160px_#3c83f6] random-animate-1"></div>

            {/* navigate back */}
            <NavLink to={'/'} className="absolute top-4 left-4 cursor-pointer border border-[rgba(255,255,255,0.2)] w-10 h-10 rounded-full flex items-center justify-center bg-[rgba(255,255,255,0.1)]">
                <ArrowLeft size={16} color="#fff" />
            </NavLink>
        </div>
    )
}