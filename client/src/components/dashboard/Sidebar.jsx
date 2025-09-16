import { Code, Loader, LogOut, PanelRight, Search, SquarePlus, Trash, EllipsisVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getBatches } from "../../redux/slices/dashboard.slice.js";
import { logout, setUser } from '../../redux/slices/auth.slice.js'
import toast from 'react-hot-toast'
import api from "../../lib/axiosInstance.js";
import * as Popover from '@radix-ui/react-popover'
import Modal from '../common/Modal.jsx'

function Sidebar() {
    const [showSidebar, setShowSidebar] = useState(false)
    const [batchLoading, setBatchLoading] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [open, setOpen] = useState(false)
    const [searchBatches, setSearchBatches] = useState([])

    const { batches } = useSelector((state) => state.dashboard)
    const { user } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    const hnadleLogout = async (e) => {
        const resultAction = await dispatch(logout())

        if (logout.fulfilled.match(resultAction)) {
            toast.success("Logged Out")
            navigate('/login', { replace: true })
        }
        else if (logout.rejected.match(resultAction)) {
            toast.error(resultAction.payload)
            navigate('/login', { replace: true })
        }
    }

    const handleDeleteBatch = async (e, batchId) => {
        e?.stopPropagation()

        const toastId = toast.loading("Deleting...")

        try {
            const response = await api.delete(`/api/batch/${batchId}`)

            dispatch(getBatches())
            if (response?.data?.success) {

                toast.dismiss(toastId)
                if (batchId === location.pathname.split('/')?.[2]) {
                    navigate("/dashboard")
                    toast.success(response?.data?.message)
                }
            }
            else {
                toast.dismiss(toastId)
                toast.error("Something Went Wrong")
            }

        } catch (e) {
            toast.dismiss(toastId)
            toast.error("Something Went Wrong!")
        }
    }

    const handleTwiiterAuth = async () => {
        try {
            const response = await api.get('/api/twitter/request_token')
            window.location.href = response?.data?.data?.url;

        } catch (e) {
            toast.error(e?.response?.data?.message)
        }
    }

    const handleTwiiterAuthDisconnect = async () => {
        try {
            const response = await api.post('/api/twitter/disconnect')

            dispatch(setUser({ ...user, isTwitterConnected: false, }))
            toast.success("Twiiter Disconnected!")
            window.open('https://x.com/settings/connected_apps', '_blank', 'noopener,noreferrer')

        } catch (e) {
            toast.error(e?.response?.data?.message)
        }
    }

    useEffect(() => {
        setBatchLoading(true)
        const getBatchesList = async () => {
            const resultAction = await dispatch(getBatches())

            if (getBatches.rejected.match(resultAction)) {
                toast.error("Failed to Fetch")
            }
        }

        getBatchesList()
        setBatchLoading(false)
    }, [])

    useEffect(() => {
        const timerId = setTimeout(() => {
            const filterBatches = batches?.filter((batch) => (
                batch?.prompt?.toLowerCase().includes(searchText.toLowerCase())
            ))
            setSearchBatches(filterBatches)
        }, 300)

        return () => {
            clearTimeout(timerId)
        }
    }, [searchText, batches])

    useEffect(() => {
        const getDeviceWidth = (e) => {
            const width = e?.target?.innerWidth || window.innerWidth;
            if (width <= 672) {
                setShowSidebar(false)
            } else {
                setShowSidebar(true)
            }
        }

        getDeviceWidth();
        window.addEventListener('resize', getDeviceWidth)

        return () => {
            window.removeEventListener('resize', getDeviceWidth)
        }
    }, [])

    return (
        <>
            <div className={`bg-dark-blue h-dvh ${showSidebar ? "!w-[230px]" : "!w-[40px]"} h-full flex flex-col items-start justify-start py-3 cursor-pointer transition-all ease-linear duration-200`}>
                {/* branding */}
                <div className={`w-full flex items-center px-2 ${showSidebar ? "justify-between" : "justify-center"}`}>
                    {
                        showSidebar &&
                        <NavLink to={'/'} className="flex items-center gap-1">
                            <div className="bg-gradient-to-tr from-light-blue-1 to-light-blue-2 p-1 rounded-lg">
                                <Code size={16} color="#ffffff" />
                            </div>
                            <span className="text-white font-poppins text-md font-semibold">devPostr</span>
                        </NavLink>
                    }
                    <div
                        onClick={() => setShowSidebar((prev) => !prev)}
                    >
                        <PanelRight size={20} color="#fff" />
                    </div>
                </div>

                {/* functions */}
                <div className="flex flex-col gap-3 px-2 justify-center items-center w-full mt-12">
                    <div
                        className="w-full flex items-center justify-start gap-2 rounded-md"
                        onClick={() => navigate('/dashboard')}
                    >
                        <SquarePlus size={20} color="#fff" />
                        {
                            showSidebar &&
                            <span className="font-poppins text-sm font-light text-white">New</span>
                        }
                    </div>
                    <div className={`w-full flex items-center justify-start gap-2 rounded-md`}
                        onClick={() => setOpen(!open)}
                    >
                        <Search size={20} color="#fff" />
                        {
                            showSidebar &&
                            <span className="font-poppins text-sm font-light text-white">Search</span>
                        }
                    </div>
                </div>

                {/* batches */}
                {
                    showSidebar &&
                    <div className="w-full h-full flex flex-col justify-start items-start gap-2 mt-6 overflow-hidden">
                        <span className="text-sm font-poppins font-light text-gray px-2">Batches</span>
                        <div className="w-full h-full flex-1 flex flex-col justify-start items-start px-2 gap-2 overflow-x-hidden overflow-y-auto">
                            {
                                batchLoading ? (<Loader color="#94a3b8" size={20} className="animate-spin" />) : (
                                    batches && batches?.length > 0 && batches.map((batch) => {
                                        const title = batch?.langauge + "-" + batch.prompt;
                                        return (
                                            <div
                                                className="flex-shrink-0 flex gap-1 items-center justify-between w-full rounded-md text-white text-[13px] p-1 bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] overflow-hidden whitespace-nowrap"
                                                key={batch?._id}
                                                onClick={() => navigate(`/dashboard/${batch?._id}`)}
                                                style={location?.pathname?.split('/')[2] === batch?._id ? { backgroundColor: " #3c83f6", color: "#000" } : {}}
                                            >
                                                <span>{title?.length > 30 ? title?.slice(0, 30) : title}</span>
                                                <div
                                                    onClick={(e) => handleDeleteBatch(e, batch?._id)}
                                                >
                                                    <Trash size={16} strokeWidth={1} />
                                                </div>
                                            </div>
                                        )
                                    })
                                )
                            }
                        </div>
                    </div>
                }

                {/* actions */}
                <div
                    className="w-full flex items-center justify-between gap-2 mt-3 rounded-md"
                >
                    <div className="flex items-center justify-center gap-2 px-2">
                        <Popover.Root>
                            <Popover.Trigger>
                                <span className="w-6 h-6 text-sm text-dark-blue font-semibold bg-white rounded-full !aspect-square flex items-center justify-center cursor-pointer">{user?.name[0]}</span>
                            </Popover.Trigger>
                            <Popover.Content
                                avoidCollisions={true}
                                side="top"
                                sideOffset={6}
                                align="start"
                                alignOffset={2}
                            >
                                <div className="bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] backdrop-blur-xl flex flex-col p-1 rounded-md">
                                    <button
                                        className="w-full text-white text-sm hover:bg-dark-blue p-2 rounded-md cursor-pointer disabled:cursor-not-allowed"
                                        onClick={handleTwiiterAuth}
                                        disabled={user?.isTwitterConnected}
                                    >
                                        {user?.isTwitterConnected ? "Twitter Connected" : "Connect Twitter"}
                                    </button>
                                    {user?.isTwitterConnected &&
                                        <button
                                            className="w-full text-white text-sm hover:bg-dark-blue p-2 rounded-md cursor-pointer"
                                            onClick={handleTwiiterAuthDisconnect}
                                        >
                                            Disconnect Twitter
                                        </button>
                                    }
                                    <div className="w-full border-b-1 border-[rgba(255,255,255,0.2)]"></div>
                                    <div className="w-full text-white text-sm p-2 rounded-md cursor-pointer hover:bg-dark-blue" onClick={hnadleLogout}>Logout</div>
                                </div>
                            </Popover.Content>
                        </Popover.Root>
                        {
                            showSidebar &&
                            <span className="text-white text-sm">{user?.name}</span>
                        }

                    </div>
                </div>

                <Modal
                    headerTitle={'Search'}
                    subHeaderTitle={"Type a batch name or keyword to get started"}
                    open={open}
                    setOpen={setOpen}
                    verticalAlign='items-start pt-20'
                >
                    <div className='flex flex-col h-full'>
                        <input
                            name='search'
                            placeholder='Search Batches'
                            className='py-2 px-2 bg-[rgba(255,255,255,0.1)] w-full border border-[rgba(255,255,255,0.2)] outline-0 text-gray text-sm search-input mb-2 rounded-lg'
                            value={searchText}
                            onChange={(e) => setSearchText(e?.target?.value)}
                        />

                        <div className='flex-1 flex flex-col h-full gap-2 overflow-x-hidden overflow-y-auto style-scrollbar pb-3 mt-2'>
                            {Array.isArray(searchBatches) && searchBatches.length > 0 ? (
                                searchBatches.map((batch) => (
                                    <div
                                        className="bg-[rgba(255,255,255,0.1)] hover:bg-light-blue-1 p-2 rounded-lg text-white font-poppins text-xs cursor-pointer"
                                        onClick={() => {
                                            setOpen(false);
                                            navigate(`/dashboard/${batch?._id}`);
                                        }}
                                        key={batch?._id}
                                    >
                                        {batch?.prompt}
                                    </div>
                                ))
                            ) : (
                                <div className="text-off-white font-poppins text-xs opacity-60">
                                    No chats found
                                </div>
                            )}

                        </div>
                    </div>
                </Modal>
            </div>
        </>
    )
}

export default Sidebar;