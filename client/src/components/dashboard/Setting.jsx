import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Pencil, Trash, CheckCheck, X, Loader } from 'lucide-react'
import { changePasswordSchema, deleteAccountSchema, changeProfileSchema } from '../../utils/zodSchema';
import toast from 'react-hot-toast'
import { changePassword, changeProfile, deleteAccount } from '../../redux/slices/auth.slice';
import Modal from '../common/Modal';

function Setting() {
    const [profileEdit, setProfileEdit] = useState(false)
    const [name, setName] = useState('')
    const [profileErrors, setProfileErrors] = useState({})
    const [profileLoading, setProfileLoading] = useState(false)

    const [passwordEdit, setPasswordEdit] = useState(false)
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [passErrors, setPassErrors] = useState({})
    const [passLoading, setPassLoading] = useState(false)

    const [openModal, setOpenModal] = useState(false)
    const [deletePassword, setDeletePassword] = useState("")
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [deleteErrors, setDeleteErrors] = useState({})

    const { user, loading } = useSelector(state => state.auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleProfileChange = async () => {
        const parsed = changeProfileSchema.safeParse({ name })
        if (!parsed.success) {
            const fieldErrors = {}
            parsed.error.issues?.map((err) => {
                fieldErrors[err.path[0]] = err?.message
            })
            setProfileErrors(fieldErrors)
            return;
        }
        setPassErrors({})
        if (name !== "" && name === user?.name) {
            setProfileErrors((prev) => ({
                ...prev, name: "Make some change to update"
            }))
            return;
        }

        setProfileLoading(true)
        const resultAction = await dispatch(changeProfile({ name }))
        if (changeProfile.fulfilled.match(resultAction)) {
            setProfileErrors({})
            setProfileEdit(false)
            toast.success("Profile Update Successfully")
        } else {
            toast.error("Something Went Wrong")
        }
        setProfileLoading(false)
    }

    const handlePasswordChange = async () => {
        const parsed = changePasswordSchema.safeParse({ oldPassword, newPassword })
        if (!parsed.success) {
            const fieldErrors = {}
            parsed.error.issues?.map((err) => {
                fieldErrors[err.path[0]] = err?.message
            })
            setPassErrors(fieldErrors)
            return;
        }
        setPassErrors({})
        if (oldPassword !== "" && oldPassword === newPassword) {
            setPassErrors((prev) => ({
                ...prev, newPassword: "New password can't be same as old password"
            }))
            return;
        }

        setPassLoading(true)
        const resultAction = await dispatch(changePassword({ oldPassword, newPassword }))
        if (changePassword.fulfilled.match(resultAction)) {
            setOldPassword('')
            setNewPassword('')
            setPassErrors({})
            toast.success("Password changed successfully. Please log in again.")
            navigate('/login', { replace: true })
        }
        else if (changePassword.rejected.match(resultAction)) {
            let errorMsg;
            if (resultAction?.payload?.startsWith("TOAST")) errorMsg = resultAction?.payload?.split(':')[1]
            else errorMsg = resultAction?.payload

            toast.error(errorMsg)
        }
        setPassLoading(false)
    }

    const handleAccountDelete = async () => {
        const parsed = deleteAccountSchema.safeParse({ password: deletePassword })
        if (!parsed.success) {
            const fieldErrors = {}
            parsed.error.issues?.map((err) => {
                fieldErrors[err.path[0]] = err?.message
            })
            setDeleteErrors(fieldErrors)
            return;
        }
        setDeleteErrors({})

        setDeleteLoading(true)
        const resultAction = await dispatch(deleteAccount({ password: deletePassword }))
        if (deleteAccount.fulfilled.match(resultAction)) {
            toast.success("Account Deleted")
            navigate('/', { replace: true })
        } else {
            toast.error(resultAction?.payload)
        }
        setDeleteLoading(false)
    }

    useEffect(() => {
        if (!loading) {
            setName(user?.name)
        }
    }, [user])

    return (
        <>
            <div className='w-full h-full flex flex-col relative p-4 overflow-x-hidden overflow-y-scroll'>
                <div className='mb-8'>
                    <h1 className='text-white font-poppins font-semibold text-2xl'>Settings</h1>
                    <p className='font-poppins text-sm text-light text-gray'>Manage your account settings and preferences</p>
                </div>

                {/* profile info */}
                <div className='p-6 rounded-lg max-w-[720px] bg-black/70'>
                    <h1 className='text-white font-poppins text-lg'>Profile Information</h1>
                    <p className='font-poppins text-xs text-light text-gray'>Update your name and email address</p>

                    <div className="flex flex-col gap-4 mt-6">
                        <div className='flex flex-col gap-2'>
                            <p className="font-poppins text-xs text-white font-light">Name</p>
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e?.target?.value)}
                                className="border border-[#303032] rounded-md text-sm py-[6px] px-2 text-gray disabled:opacity-40 disabled:cursor-not-allowed !outline-0"
                                disabled={!profileEdit}
                            />
                            {profileErrors.name && <p className="text-red-500 text-xs -mt-1">{profileErrors.name}</p>}
                        </div>

                        <div className='flex flex-col gap-2'>
                            <p className="font-poppins text-xs text-white font-light">Email</p>
                            <input
                                type="text"
                                placeholder="Email"
                                value={user?.email}
                                className="border border-[#303032] rounded-md text-sm py-[6px] px-2 text-gray disabled:opacity-40 disabled:cursor-not-allowed !outline-0"
                                disabled={true}
                            />
                        </div>

                        {
                            !profileEdit &&
                            <button className='flex gap-2 items-center bg-white text-black font-semibold py-[6px] px-4 text-sm w-fit rounded-md mt-4 cursor-pointer'
                                onClick={() => setProfileEdit(!profileEdit)}
                            >
                                <Pencil size={15} />
                                Edit Profile
                            </button>
                        }
                        {
                            profileEdit &&
                            <div className='flex gap-2 items-center justify-end'>
                                <button
                                    className='flex gap-2 items-center bg-white text-black font-semibold py-[6px] px-4 text-sm w-fit rounded-md mt-4 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'
                                    onClick={handleProfileChange}
                                    disabled={profileLoading}
                                >
                                    <CheckCheck size={15} />
                                    Save
                                </button>
                                <button
                                    className='flex gap-2 items-center bg-white text-black font-semibold py-[6px] px-4 text-sm w-fit rounded-md mt-4 cursor-pointer'
                                    onClick={() => {
                                        setName(user?.name)
                                        setProfileErrors({})
                                        setProfileEdit(false)
                                    }}
                                >
                                    <X size={15} />
                                    Cancel
                                </button>
                            </div>
                        }
                    </div>
                </div>

                {/* password info */}
                <div className='p-6 rounded-lg mt-8 max-w-[720px] bg-black/70'>
                    <h1 className='text-white font-poppins text-lg'>Security</h1>
                    <p className='font-poppins text-xs text-light text-gray'>Update your password to keep your account secure</p>

                    <div className="flex flex-col gap-4 mt-6">
                        <div className='flex flex-col gap-2'>
                            <p className="font-poppins text-xs text-white font-light">Old Password</p>
                            <input
                                type="text"
                                placeholder="Old Password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e?.target?.value)}
                                className="border border-[#303032] rounded-md text-sm py-[6px] px-2 text-gray  disabled:opacity-40 disabled:cursor-not-allowed !outline-0"
                                disabled={!passwordEdit}
                            />
                            {passErrors.oldPassword && <p className="text-red-500 text-xs -mt-1">{passErrors.oldPassword}</p>}
                        </div>

                        <div className='flex flex-col gap-2'>
                            <p className="font-poppins text-xs text-white font-light">New Password</p>
                            <input
                                type="text"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e?.target?.value)}
                                className="border border-[#303032] rounded-md text-sm py-[6px] px-2 text-gray  disabled:opacity-40 disabled:cursor-not-allowed !outline-0"
                                disabled={!passwordEdit}
                            />
                            {passErrors.newPassword && <p className="text-red-500 text-xs -mt-1">{passErrors.newPassword}</p>}
                        </div>

                        {
                            !passwordEdit &&
                            <button className='flex gap-2 items-center bg-white text-black font-semibold py-[6px] px-4 text-sm w-fit rounded-md mt-4 cursor-pointer'
                                onClick={() => setPasswordEdit(!passwordEdit)}
                            >
                                <Pencil size={15} />
                                Change Password
                            </button>
                        }
                        {
                            passwordEdit &&
                            <div className='flex gap-2 items-center justify-end'>
                                <button
                                    className='flex gap-2 items-center bg-white text-black font-semibold py-[6px] px-4 text-sm w-fit rounded-md mt-4 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'
                                    onClick={handlePasswordChange}
                                    disabled={passLoading}
                                >
                                    <CheckCheck size={15} />
                                    Save
                                </button>
                                <button
                                    className='flex gap-2 items-center bg-white text-black font-semibold py-[6px] px-4 text-sm w-fit rounded-md mt-4 cursor-pointer'
                                    onClick={() => {
                                        setNewPassword("")
                                        setOldPassword("")
                                        setPassErrors({})
                                        setPasswordEdit(false)
                                    }}
                                >
                                    <X size={15} />
                                    Cancel
                                </button>
                            </div>
                        }
                    </div>
                </div>

                {/* account info */}
                <div className='p-6 border border-red-500 rounded-lg mt-8 max-w-[720px] mb-12'>
                    <h1 className='text-red-500 font-poppins text-lg'>Danger Zone</h1>
                    <p className='font-poppins text-xs text-light text-gray'>Permanently delete your account and all data</p>

                    <button
                        className='flex gap-2 items-center bg-red-500 text-white py-[6px] px-4 text-sm rounded-md mt-8 cursor-pointer'
                        onClick={() => setOpenModal(true)}>
                        <Trash size={15} />
                        Delete Account
                    </button>
                </div>

                {/* blue circle */}
                <div className="absolute w-32 h-32 rounded-full bg-light-blue-1 backdrop-blur-xl opacity-5 shadow-[0px_0px_60px_120px_#3c83f6] top-1/3 left-2/3 random-animate"></div>
                <div className="absolute w-32 h-32 rounded-full bg-light-blue-1 backdrop-blur-xl opacity-5 shadow-[0px_0px_60px_120px_#3c83f6] top-[7%] left-[17%] random-animate-1"></div>

                {/* alter box for delete */}
                <Modal
                    open={openModal}
                    setOpen={setOpenModal}
                    heightFit={true}
                    headerTitle="Are you absolutely sure?"
                    subHeaderTitle="This action cannot be undone. This will permanently delete your account and remove all your data from our servers."
                >
                    <div>
                        <div className='flex flex-col gap-2 mt-2'>
                            <p className="font-poppins text-xs text-white font-light">Verify Password to delete Account</p>
                            <input
                                type="text"
                                placeholder="Password"
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e?.target?.value)}
                                className="border border-[#303032] rounded-md text-sm py-[6px] px-2 text-gray disabled:opacity-40 disabled:cursor-not-allowed !outline-0"
                            />
                            {deleteErrors.password && <p className="text-red-500 text-xs -mt-1">{deleteErrors.password}</p>}
                        </div>
                        <div className="w-full flex items-center gap-2 justify-end">
                            <button
                                className='flex gap-2 items-center bg-red-500 text-white py-[6px] px-4 text-sm rounded-md mt-4 cursor-pointer'
                                onClick={() => {
                                    setDeletePassword('')
                                    setOpenModal(false)
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className='flex gap-2 items-center bg-red-500 text-white py-[6px] px-4 text-sm rounded-md mt-4 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'
                                disabled={deletePassword.trim() === "" || (deletePassword.trim() !== "" && deleteLoading)}
                                onClick={handleAccountDelete}
                            >
                                Delete Account
                                {deleteLoading && <Loader size={16} className='animate-spin' />}
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    )
}

export default Setting;