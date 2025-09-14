import { LogIn, UserLock, ArrowLeft } from "lucide-react"
import { NavLink, useNavigate } from "react-router-dom"
import { useState } from "react";
import OTPInput from "../components/common/OTPInput";
import { useDispatch, useSelector } from "react-redux";
import { verifyOTP } from "../redux/slices/auth.slice";
import toast from "react-hot-toast";
import { otpSchema } from "../utils/zodSchema";

function VerifyOTP() {
    const [OTP, setOTP] = useState('')
    const [errors, setErrors] = useState({})

    const { otpInfo, otpRequired, loading } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleVerifyOTP = async (e) => {
        e?.preventDefault();

        const parsed = otpSchema.safeParse({ otpCode: OTP })
        if (!parsed.success) {
            const fieldErrors = {}
            parsed?.error?.issues?.map(err => {
                fieldErrors[err?.path[0]] = err?.message
            })
            setErrors(fieldErrors);
            return;
        }

        if (!otpRequired) return;
        if (OTP?.trim() === "") return;

        setErrors({})
        const resultAction = await dispatch(verifyOTP({ ...otpInfo, otpCode: OTP }))

        if (verifyOTP.fulfilled.match(resultAction)) {
            toast.success("OTP Verified")
            navigate('/dashboard', { replace: true })

        } else if (verifyOTP.rejected.match(resultAction)) {
            toast.error(resultAction.payload)
        }
    }


    return (
        <>
            <div className="w-full min-h-dvh bg-dark-blue relative overflow-hidden flex items-center justify-center">
                <div className="max-w-[1200px] h-full mx-auto flex flex-col items-center justify-center gap-8 p-2 pt-8 pb-12">
                    <div className="w-9/10 sm:w-88 min-h-[460px] bg-[rgba(255,255,255,0.1)] rounded-lg border border-[rgba(255,255,255,0.2)] flex flex-col items-center justify-center gap-3 p-4">
                        <div className="w-12 h-12 rounded-xl bg-light-blue-1 flex items-center justify-center">
                            <UserLock />
                        </div>
                        <h1 className="text-2xl font-poppins font-bold text-light-blue-1">Verify OTP</h1>
                        <p className="text-sm font-poppins text-gray text-center">We sent a 6-digit OTP to your registered email/phone.</p>

                        <div className="w-full flex flex-col items-center gap-2 mt-2">
                            <OTPInput
                                length={6}
                                onChange={setOTP}
                            />
                            {errors?.otpCode && <p className="text-red-500 text-xs -mt-1">{errors.otpCode}</p>}
                            <button
                                className="w-full rounded-md mt-8 text-md font-semibold p-1 bg-gradient-to-tl from-light-blue-1 to-light-blue-2 disabled:bg-light-blue-1/80 cursor-pointer" disabled={loading}
                                onClick={handleVerifyOTP}
                            >
                                {loading ? <Loader size={22} strokeWidth={1} className="animate-spin mx-auto" /> : "Verify OTP"}
                            </button>
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
            </div>
        </>
    )
}

export default VerifyOTP