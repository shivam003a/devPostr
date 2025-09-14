import { Code } from 'lucide-react'

function FeatureCard({ info }) {
    return (
        <>
            <div className='group bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-lg p-6 flex flex-col justify-center gap-3 hover:-translate-y-1 transition-all duration-200 ease-linear'>
                <div
                    className="w-9 h-9 flex items-center justify-center rounded-lg p-2"
                    style={{ backgroundColor: info.bgColor }}
                >
                    <info.icon color='#fff' />
                </div>
                <h2 className='text-white text-sm font-poppins font-semibold group-hover:text-light-blue-1 transition-all duration-200 ease-linear'>{info?.title}</h2>
                <h2 className='text-gray text-xs font-poppins'>{info?.description}</h2>
            </div>
        </>
    )
}

export default FeatureCard