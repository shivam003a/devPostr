import { Code, ExternalLink, Github, Instagram, Linkedin, Twitter } from "lucide-react";
import { NavLink } from 'react-router-dom'

function Footer() {
    return (
        <footer className="w-full bg-dark-blue py-10">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-stretch justify-between gap-8">

                {/* Logo & Description */}
                <div className="flex flex-col gap-4 flex-1">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-tr from-light-blue-1 to-light-blue-2 p-2 rounded-lg">
                            <Code size={20} color="#fff" />
                        </div>
                        <span className="text-white font-poppins text-2xl font-bold">devPostr</span>
                    </div>
                    <p className="text-gray-400 text-sm max-w-xs">
                        Create, share, and explore beautiful code snippets with AI-powered tools.
                    </p>
                    <p className="text-xs text-gray-400 mt-4">
                        &copy; {new Date().getFullYear()} <span className="text-light-blue-1 font-semibold">devPostr</span>. All rights reserved.
                    </p>
                </div>

                {/* Divider */}
                <div className="hidden sm:block border-l border-gray w-[1px] self-stretch"></div>

                {/* Other Projects */}
                <div className="flex flex-col gap-3 flex-1">
                    <span className="text-light-blue-1 text-sm font-poppins font-semibold">Other Projects</span>
                    <NavLink to="https://pdftalk-psi.vercel.app/" target="_blank" className="flex items-center text-xs text-gray hover:text-white gap-1 transition-colors">
                        PdfTalk <ExternalLink size={14} color="#3c83f6" />
                    </NavLink>
                    <NavLink to="https://snapshort.vercel.app/" target="_blank" className="flex items-center text-xs text-gray hover:text-white gap-1 transition-colors">
                        SnapShort <ExternalLink size={14} color="#3c83f6" />
                    </NavLink>
                    <NavLink to="https://resumefreshers.vercel.app/" target="_blank" className="flex items-center text-xs text-gray hover:text-white gap-1 transition-colors">
                        ResumeCraft <ExternalLink size={14} color="#3c83f6" />
                    </NavLink>
                    <NavLink to="https://vidnexa.netlify.app/" target="_blank" className="flex items-center text-xs text-gray hover:text-white gap-1 transition-colors">
                        VidNexa <ExternalLink size={14} color="#3c83f6" />
                    </NavLink>
                </div>

                {/* Divider */}
                <div className="hidden sm:block border-l border-gray w-[1px] self-stretch"></div>

                {/* Contact */}
                <div className="flex flex-col gap-3 flex-1">
                    <span className="text-light-blue-1 text-sm font-poppins font-semibold">Contact</span>
                    <NavLink to="https://www.instagram.com/shivam003a/" target="_blank" className="flex items-center text-xs text-gray hover:text-white gap-1 transition-colors">
                        <Instagram size={14} color="#3c83f6" /> Instagram
                    </NavLink>
                    <NavLink to="https://x.com/shivam003a" target="_blank" className="flex items-center text-xs text-gray hover:text-white gap-1 transition-colors">
                        <Twitter size={14} color="#3c83f6" /> Twitter
                    </NavLink>
                    <NavLink to="https://www.linkedin.com/in/shivam003a" target="_blank" className="flex items-center text-xs text-gray hover:text-white gap-1 transition-colors">
                        <Linkedin size={14} color="#3c83f6" /> LinkedIn
                    </NavLink>
                    <NavLink to="https://www.github.com/shivam003a" target="_blank" className="flex items-center text-xs text-gray hover:text-white gap-1 transition-colors">
                        <Github size={14} color="#3c83f6" /> Github
                    </NavLink>
                </div>

            </div>
        </footer>
    );
}

export default Footer;
