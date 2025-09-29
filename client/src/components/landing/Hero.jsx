import { Sparkles, ArrowRight, Code, Twitter } from "lucide-react"
import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { useSelector } from "react-redux"
import { motion } from 'motion/react'

function Hero() {
    const [pos, setPos] = useState({ x: 0, y: 0 })
    const { isAuthenticated } = useSelector((state) => state.auth)

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            setPos({ x: e?.clientX, y: e?.clientY })
        }
        window.addEventListener('mousemove', handleMouseMove)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
        }

    }, [])

    return (
        <>
            <div className="w-full bg-dark-blue relative overflow-hidden bg-grid">
                <div className="max-w-[1200px] h-full mx-auto flex flex-col items-center justify-center gap-8 p-2 pt-8 pb-12">

                    {/* top circle div */}
                    <motion.span
                        className="text-gray flex gap-2 items-center py-2 px-4 rounded-full bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] mb-4"
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                    >
                        <Sparkles color="#3c83f6" size={18} />
                        <span className="text-xs text-white font-semibold font-poppins"> AI-Powered Code Generation </span>
                    </motion.span>

                    {/* heading */}
                    <motion.div
                        className="text-white text-[46px] sm:text-[64px] font-poppins font-bold leading-14 sm:leading-20 text-center max-w-[100%] sm:max-w-[70%]"
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        Create & <span className="text-light-blue-1">Schedule</span> Beautiful Code Snippets
                    </motion.div>
                    <motion.p
                        className="font-poppins text-lg text-gray text-center max-w-[90%] sm:max-w-[65%]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.4 }}
                    >
                        Turn your code into stunning visuals with AI-powered templates — and schedule posts to share automatically on Twitter
                    </motion.p>

                    {/* cta */}
                    <motion.div
                        className="flex gap-4 items-center justify-center flex-wrap"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                    >
                        <NavLink
                            to={isAuthenticated ? "/dashboard" : "/register"}
                            className="py-3 px-8 bg-gradient-to-tr from-light-blue-1 to-light-blue-2 text-black text-lg rounded-lg flex items-center gap-4 cursor-pointer shadow-[0px_0px_30px_5px_rgba(59,130,246,0.5)] hover:shadow-[0px_0px_34px_8px_rgba(59,130,246,0.5)]"
                        >
                            <span className="text-sm font-poppins font-semibold">Start Creating</span> <ArrowRight color="#000000" size={18} />
                        </NavLink>
                        <NavLink
                            to={'https://www.notion.so/Getting-Started-with-devPostr-2703e5570deb80a1807efb3fe4f21727?source=copy_link'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-3 px-8 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] text-black text-lg rounded-lg flex items-center gap-4 cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-all duration-200"
                        >
                            <Code color="#ffffff" size={18} />
                            <span className="text-sm font-poppins font-semibold text-white">View Examples</span>
                        </NavLink>
                    </motion.div>

                    {/* feature */}
                    <motion.div
                        className="flex items-center justify-center gap-8 mt-12 flex-wrap"
                        variants={container}
                        initial="hidden"
                        animate="show"
                    >
                        <motion.div className="flex gap-2 items-center justify-center" variants={item}>
                            <div className="p-2 rounded-xl bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)]">
                                <Code color="#3c83f6" size={18} />
                            </div>
                            <span className="font-poppins text-gray text-sm">AI Generation</span>
                        </motion.div>
                        <motion.div className="flex gap-2 items-center justify-center" variants={item}>
                            <div className="p-2 rounded-xl bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)]">
                                <Twitter color="#3c83f6" size={18} />
                            </div>
                            <span className="font-poppins text-gray text-sm">Twitter Ready</span>
                        </motion.div>
                        <motion.div className="flex gap-2 items-center justify-center" variants={item}>
                            <div className="p-2 rounded-xl bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)]">
                                <Sparkles color="#3c83f6" size={18} />
                            </div>
                            <span className="font-poppins text-gray text-sm">Premium Design</span>
                        </motion.div>
                    </motion.div>

                    {/* bg dots */}
                    <div className="bg-light-blue-1 w-1 h-1 opacity-55 rounded-full absolute animate-cs-bounce top-[10%] right-[10%]"></div>
                    <div className="bg-light-blue-1 w-1 h-1 opacity-90 rounded-full absolute animate-cs-bounce top-[80%] right-[15%]" style={{ animationDelay: "0.3s" }}></div>
                    <div className="bg-light-blue-1 w-[6px] h-[6px] opacity-75 rounded-full absolute animate-cs-bounce top-[65%] right-[26%]" style={{ animationDelay: "0.8s" }}></div>
                    <div className="bg-light-blue-1 w-[6px] h-[6px] opacity-80 rounded-full absolute animate-cs-bounce top-[22%] left-[16%] text-white" style={{ animationDelay: "1.2s" }}></div>
                    <div className="bg-light-blue-1 w-1 h-1 opacity-45 rounded-full absolute animate-cs-bounce top-[78%] left-[24%] text-white" style={{ animationDelay: "0.9s" }}></div>

                    {/* big light circle following mouse */}
                    <div
                        className="absolute w-120 h-120 rounded-full pointer-events-none bg-light-blue-1 opacity-[7%] blur-3xl shadow-[0_0_80px_50px_rgba(59,130,246,0.5)]"
                        style={{ left: pos.x, top: pos.y, transform: "translate(-50%,-50%)", }} >
                    </div>
                </div>
            </div >
        </>
    )
}

export default Hero