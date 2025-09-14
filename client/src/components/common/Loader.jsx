import { Code } from 'lucide-react'

function Loader() {
    return (
        <>
            <div className="w-screen h-dvh flex items-center justify-center bg-dark-blue">
                <div className="flex items-center gap-2 animate-bounce">
                    <div className="bg-gradient-to-tr from-light-blue-1 to-light-blue-2 p-2 rounded-lg">
                        <Code size={18} color="#ffffff" />
                    </div>
                    <span className="text-white font-poppins text-2xl font-semibold">devPostr</span>
                </div>
            </div>
        </>
    )
}

export default Loader;