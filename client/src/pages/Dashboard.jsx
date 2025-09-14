import Sidebar from "../components/dashboard/Sidebar";
import { Outlet } from "react-router-dom";

function Dashboard() {

    return (
        <>
            <div className="flex items-center justify-start w-full h-dvh overflow-hidden">
                <Sidebar />
                <div className="overflow-hidden bg-light-blue/97 w-full h-full">
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default Dashboard;