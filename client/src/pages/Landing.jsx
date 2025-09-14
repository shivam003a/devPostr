import Navbar from "../components/common/Navbar"
import CodeGenerator from "../components/landing/CodeGenerator"
import Features from "../components/landing/Features"
import Footer from "../components/common/Footer"
import Hero from "../components/landing/Hero"

function Landing() {
    return (
        <div className="w-full h-full relative scroll">
            <Navbar />
            <Hero />
            <CodeGenerator />
            <Features />
            <Footer />
        </div>
    )
}

export default Landing