import { Sparkles, Share2, Download, Code } from "lucide-react"
import { features } from "../../utils/features.js"
import FeatureCard from "../common/FeatureCard.jsx"

function Features() {
    return (
        <>
            <div className="w-full bg-light-blue overflow-hidden relative">

                {/* blue blur bg */}
                <div className="absolute -top-20 left-1/4 w-40 h-40 opacity-5 backdrop-blur-3xl shadow-[0px_0px_20px_100px_#3c83f6] rounded-full bg-light-blue-1"></div>


                <div className="max-w-[1200px] h-full mx-auto flex flex-col items-center justify-center gap-2 p-2 pt-12 pb-12">

                    {/* top circle div */}
                    <span className="text-gray flex gap-2 items-center py-2 px-4 rounded-full bg-[rgba(255,255,255,0.1)] border border-[rgba(255, 255, 255, 0.2)] mb-4">
                        <Sparkles
                            color="#3c83f6"
                            size={18}
                        />
                        <span className="text-xs text-white font-semibold font-poppins">
                            Why Choose <span className="text-light-blue-1">devPostr</span>
                        </span>
                    </span>

                    {/* headings */}
                    <div className="flex flex-col justify-center items-center">
                        <h2 className="text-light-blue-1 font-poppins text-4xl font-bold tracking-wide mt-2 leading-10 text-center">Everything You Need to Create</h2>
                        <h2 className="text-white font-poppins text-4xl font-bold tracking-wide mt-2 leading-10 text-center">Stunning Code Content</h2>
                        <p className="max-w-[90%] sm:max-w-[65%] text-md mt-2 text-gray font-poppins text-center">From AI-powered generation to Twitter-ready exports, we've built the ultimate toolkit for sharing code</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full gap-6 mt-8">
                        {features && features.map((feature, index) => {
                            return <FeatureCard info={feature} key={index} />
                        })}
                    </div>

                    <div className='w-full bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-lg p-6 flex flex-col justify-center items-center gap-3 pt-10 mt-10 hover:scale-101 transition-all duration-200 ease-linear'>
                        <div className="w-11 h-11 flex items-center justify-center rounded-lg p-2 bg-gradient-to-tr from-light-blue-1 to-light-blue-2  shadow-[0px_0px_30px_5px_rgba(59,130,246,0.5)]">
                            <Share2 color='#fff' />
                        </div>
                        <h2 className="font-poppins text-3xl font-bold tracking-wide mt-4 leading-10 text-light-blue-1 text-center">Share Your Code, Grow Your Audience</h2>
                        <p className="max-w-[98%] sm:max-w-[65%] text-sm mt-2 text-gray font-poppins text-center font-light">Transform complex code concepts into visually appealing content that educates and inspires your followers. Perfect for developers, educators, and tech content creators.</p>

                        <div className="flex items-center justify-center gap-4 mt-2 py-4 flex-wrap">
                            <div className="flex items-center justify-center gap-2">
                                <Download size={14} color="#3c83f6" />
                                <span className="text-[10px] text-gray font-poppins">High-resolution exports</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <Code size={14} color="#3c83f6" />
                                <span className="text-[10px] text-gray font-poppins">Syntax highlighting</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <Sparkles size={14} color="#3c83f6" />
                                <span className="text-[10px] text-gray font-poppins">Custom branding</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Features

