import { X } from 'lucide-react'
import { useEffect } from 'react';

export default function Modal({ children, open, setOpen, headerTitle, subHeaderTitle, verticalAlign = "items-center" }) {

    useEffect(() => {
        const handleEsc = (e) => {
            if (e?.key === 'Escape') {
                setOpen(false)
            }
        }
        document.addEventListener('keydown', handleEsc)

        return () => {
            document.removeEventListener('keydown', handleEsc)
        }
    }, [setOpen])

    if (!open) {
        return null;
    }
    return (
        <div
            className={`w-screen h-dvh fixed top-0 bottom-0 left-0 right-0 overflow-hidden z-100 flex ${verticalAlign} justify-center backdrop-blur-sm bg-white/5`}
            onClick={() => setOpen(false)}
        >
            <div className="max-w-[900px] w-full max-h-[450px] h-full sm:w-[700px] bg-dark-blue/90 p-4 rounded-lg overflow-hidden m-2"
                onClick={(e) => e.stopPropagation()}
            >
                <div className='flex items-center justify-between pb-4'>
                    <div className='flex flex-col gap-1'>
                        <span className='text-white text-lg font-semibold font-poppins'>{headerTitle}</span>
                        <span className='text-gray text-xs font-poppins'>{subHeaderTitle}</span>
                    </div>
                    <span
                        onClick={() => setOpen(false)}
                        className='cursor-pointer'
                    >
                        <X color='#fff' />
                    </span>
                </div>
                <div className='mt-3'>
                    {children}
                </div>
            </div>
        </div>
    )
}