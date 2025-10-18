'use client'

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function Themetoggleicon() {
    const { setTheme, theme } = useTheme()
    return (
        <div>
            {theme == 'light' ? <span onClick={() => setTheme('dark')} className="mr-4 cursor-pointer">
                <Moon className="text-blue-400" />
            </span> : <span onClick={() => setTheme('light')} className="mr-4 cursor-pointer">
                <Sun className="text-blue-400" />
            </span>}
        </div>
    )
}