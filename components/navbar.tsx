import Image from "next/image";
import Themetoggleicon from "./theme-toggle";


export default function Navbar() {

    return (
        <nav className="w-full sticky top-0 z-50 border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded mb-5">
            <div className="flex items-center justify-between h-12 px-4">
                <div className="flex items-center space-x-2 justify-center cursor-pointer">
                    <Image src="/Logo.png" className="w-10 h-10" width='34' height='34' alt="logo" />
                    <p className="text-lg sm:text-xl font-medium tracking-wide leading-none">ARIVU</p>
                </div>
                <Themetoggleicon />
            </div>
        </nav>
    )
}