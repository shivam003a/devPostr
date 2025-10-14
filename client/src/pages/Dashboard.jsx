import { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import SidebarMobile from "../components/dashboard/SidebarMobile";
import { Outlet } from "react-router-dom";
import { NavLink } from 'react-router-dom'
import { PanelRight } from 'lucide-react'

function Dashboard() {
    const [isMobile, setIsMobile] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false)

    useEffect(() => {
        const getDeviceWidth = (e) => {
            const width = e?.target?.innerWidth || window.innerWidth;
            if (width <= 672) {
                setIsMobile(true)
            } else {
                setIsMobile(false)
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
            <div className="flex items-center justify-start w-full h-dvh overflow-hidden relative">
                {
                    isMobile ? (
                        <SidebarMobile
                            setShowSidebar={setShowSidebar}
                            showSidebar={showSidebar}
                        />
                    ) : (<Sidebar />)
                }
                <div className="overflow-hidden bg-light-blue/95 w-full h-full relative">
                    {
                        isMobile &&
                        <div className="bg-dark-blue h-11 p-2 flex justify-start items-center gap-2">
                            <div
                                onClick={() => setShowSidebar((prev) => !prev)}
                            >
                                <PanelRight size={20} color="#fff" />
                            </div>
                            <NavLink to={'/'} className="flex items-center gap-1">
                                <span className="text-white font-poppins text-md font-semibold">devPostr</span>
                            </NavLink>
                        </div>
                    }
                    <div className="w-full h-full">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard;