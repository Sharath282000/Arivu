import Image from "next/image";
import Themetoggleicon from "./theme-toggle";


export default function Navbar() {
    
    return (
        <nav className="w-full sticky top-0 z-50 border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded mb-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-center cursor-pointer">
                     <Image src="/Logo.png" width='40' height='20' alt="logo" />
                    <p className="text-blue-400">CogniTalk</p>
                </div>
                <Themetoggleicon/>
            </div>
        </nav>
    )
}