import { useState } from "react"
import Modal from './Modal'
import { forgotPasswordEmailSchema } from "../../utils/zodSchema"
import api from '../../lib/axiosInstance'
import toast from 'react-hot-toast'
import { Loader } from 'lucide-react'

export default function ForgotPasswordModal({ forgotPass, setForgotPass }) {

    const [email, setEmail] = useState('')
    const [forgotPassErrors, setForgotPassErrors] = useState({})
    const [forgotLoading, setForgotLoading] = useState(false)


    const handleForgotPassword = async () => {

        setForgotLoading(true)
        try {
            const parsed = forgotPasswordEmailSchema.safeParse({ email })
            if (!parsed.success) {
                const fieldErrors = {}
                parsed.error.issues?.map((err) => {
                    fieldErrors[err.path[0]] = err?.message
                })
                setForgotPassErrors(fieldErrors)
                return;
            }
            setForgotPassErrors({})

            const response = await api.post('/api/auth/forgot-password', {
                email
            })
            toast.success(response.data.message, { duration: 3000 })
            setEmail("")
            setForgotPass(false)

        } catch (err) {
            const errorMsg = err.response.data.message;
            toast.error(errorMsg, { duration: 3000 })
            setEmail("")
            setForgotPass(false)

        } finally {
            setForgotLoading(false)
        }
    }

    return (
        <Modal
            open={forgotPass}
            setOpen={setForgotPass}
            heightFit={true}
            headerTitle="Forgot your password?"
            subHeaderTitle="Enter your email address and we'll send you a link to reset your password. The link will expire in 10 minutes."
        >
            <div>
                <div className='flex flex-col gap-2 mt-2'>
                    <p className="font-poppins text-xs text-white font-light">Enter e-mail</p>
                    <input
                        type="text"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e?.target?.value)}
                        className="border border-[#303032] rounded-md text-sm py-[6px] px-2 text-gray disabled:opacity-40 disabled:cursor-not-allowed !outline-0"
                    />
                    {forgotPassErrors.email && <p className="text-red-500 text-xs -mt-1">{forgotPassErrors.email}</p>}
                </div>
                <div className="w-full flex items-center gap-2 justify-end">
                    <button
                        className='flex gap-2 items-center bg-red-500 text-white py-[6px] px-4 text-sm rounded-md mt-4 cursor-pointer'
                        onClick={() => {
                            setEmail('')
                            setForgotPass(false)
                            setForgotPassErrors(false)
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        className='flex gap-2 items-center bg-red-500 text-white py-[6px] px-4 text-sm rounded-md mt-4 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'
                        disabled={email.trim() === "" || (email.trim() !== "" && forgotLoading)}
                        onClick={handleForgotPassword}
                    >
                        Reset Password
                        {forgotLoading && <Loader size={16} className='animate-spin' />}
                    </button>
                </div>
            </div>
        </Modal>
    )
}