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
        // Return a div placeholder to reserve space and prevent layout shift
        return <div className="h-6 w-6" />;
    }
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