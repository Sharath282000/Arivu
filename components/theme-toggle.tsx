'use client'

import { useState, useEffect } from 'react'

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function Themetoggleicon() {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="h-6 w-6" />;
    }
    return (
        <div className='h-6'>
            {theme == 'light' ? <span onClick={() => setTheme('dark')} className="mr-4 cursor-pointer">
                <Moon className="h-5 w-5 sm:h-6 sm:w-6" />
            </span> : <span onClick={() => setTheme('light')} className="mr-4 cursor-pointer">
                <Sun className=" h-5 w-5 sm:h-6 sm:w-6" />
            </span>}
        </div>
    )
}