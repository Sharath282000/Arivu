'use client'

import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import { Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { timeStamp } from "console";

import ReactMarkdown from 'react-markdown'

export default function Chatbox() {
    interface ChatMessage {
        id: string;
        content: string;
        sender: 'user' | 'bot';
        timestamp: number;
    }
    const [loading, setloading] = useState(false);
    const [prompt, setprompt] = useState('');
    const [messages, setmessages] = useState<ChatMessage[]>([])

    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handlesend = async () => {

        if (prompt.trim() === '' || loading) return;

        const userPrompt = prompt.trim();
        const lowerCasePrompt = userPrompt.toLowerCase(); // 💡 FIX 2: Create a lowercase version for case-insensitive check

        // 1. Create and add the user's message immediately
        const newUserMessage: ChatMessage = {
            id: Date.now().toString() + '-user',
            content: userPrompt,
            sender: 'user',
            timestamp: Date.now(),
        };

        setmessages(prev => [...prev, newUserMessage]);
        setloading(true); // Start loading state for both scenarios
        setprompt('');

        // --- Custom Response Interception ---

        // 🛑 FIX 1 & 2: Intercept after adding the user message, using the lowercase variable
        if (lowerCasePrompt.includes("who built you") || lowerCasePrompt.includes("who made you") || lowerCasePrompt.includes('who develop you') || lowerCasePrompt.includes('who build you') || lowerCasePrompt.includes('who developed you') || lowerCasePrompt.includes('who trained you') || lowerCasePrompt.includes('You are developed by') || lowerCasePrompt.includes(`You're developed by`) || lowerCasePrompt.includes(`You're built by`) || lowerCasePrompt.includes(`You're made by`) || lowerCasePrompt.includes(`You're owned by`)) {

            const customBotMessage: ChatMessage = { // Using the ChatMessage type is good practice
                id: Date.now().toString() + '-bot',
                sender: 'bot',
                content: "Sharath built and trained me.",
                timestamp: Date.now(),
            };

            // Delay slightly for a natural typing effect (simulates the AI's "typing...")
            await new Promise(resolve => setTimeout(resolve, 1500));

            setmessages(prev => [...prev, customBotMessage]);
            setloading(false);
            return; // <--- EXIT the function, skipping the API call
        }

        if (lowerCasePrompt.includes("who owns you")) {

            const customBotMessage: ChatMessage = { // Using the ChatMessage type is good practice
                id: Date.now().toString() + '-bot',
                sender: 'bot',
                content: "CogniTalk owns me which is developed by Sharath!",
                timestamp: Date.now(),
            };

            // Delay slightly for a natural typing effect (simulates the AI's "typing...")
            await new Promise(resolve => setTimeout(resolve, 1500));

            setmessages(prev => [...prev, customBotMessage]);
            setloading(false);
            return; // <--- EXIT the function, skipping the API call
        }

         if (lowerCasePrompt.includes("who is sharath")) {

            const customBotMessage: ChatMessage = { // Using the ChatMessage type is good practice
                id: Date.now().toString() + '-bot',
                sender: 'bot',
                content: "Sharath is the developer of CogniTalk who built me and trained me",
                timestamp: Date.now(),
            };

            // Delay slightly for a natural typing effect (simulates the AI's "typing...")
            await new Promise(resolve => setTimeout(resolve, 1500));

            setmessages(prev => [...prev, customBotMessage]);
            setloading(false);
            return; // <--- EXIT the function, skipping the API call
        }


        // --- Gemini API Call ---

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: userPrompt // 💡 FIX 3: Use the local variable userPrompt
                })
            })

            const data = await response.json();
            const botResponseText: string = data.text;

            const botmessage: ChatMessage = {
                id: Date.now().toString() + '-bot',
                content: botResponseText,
                sender: 'bot',
                timestamp: Date.now(),
            }

            setmessages(prev => [...prev, botmessage]);

        } catch (error) {
            const errmessage = "Something went wrong, please try again!"

            const botmsg: ChatMessage = {
                id: Date.now().toString() + '-bot',
                content: errmessage,
                sender: 'bot',
                timestamp: Date.now()
            }
            setmessages(prev => [...prev, botmsg]);

        } finally {
            setloading(false);
        }
    }

    return (
        <div className="flex flex-col h-[85vh] w-full border rounded-md">
            <ScrollArea className="flex-grow p-4 overflow-y-scroll hide-scrollbar">
                {messages.length === 0 && (<div className="flex flex-col items-center justify-center h-full">
                    <div className="text-center">
                        <h1 className="font-semibold text-4xl">Welcome to CogniTalk, You're AI friend!</h1>
                    </div>
                </div>)}
                {messages.map(message => (
                    <div key={message.id} className={`m-5 flex ${message.sender === 'bot' ? 'justify-start' : 'justify-end'}`}>
                        <span className={`p-4 border-2 mb-3 break-words rounded-xl max-w-xs sm:max-w-md lg:max-w-xl block
                            ${message.sender === 'bot' ? ' rounded-tl-none border-blue-300' : 'rounded-tr-none border-blue-600'} [&>pre]:whitespace-pre-wrap [&>pre]:overflow-x-auto [&>p>a]:break-all`}>
                            <ReactMarkdown>
                                {message.content}
                            </ReactMarkdown>
                        </span>
                    </div>
                ))}
                {loading && (
                    <div className="m-5 flex justify-start">
                        <span className={`
            p-4 mb-3 rounded-xl rounded-tl-none border-blue-300 border-2 
            max-w-xs text-gray-500 flex items-center italic
             space-x-1
        `}>
                            <div
                                className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"
                            ></div>
                            <div
                                className="w-1.5 h-1.5 rounded-full bg-current animate-pulse delay-100"
                            ></div>
                            <div
                                className="w-1.5 h-1.5 rounded-full bg-current animate-pulse delay-200"
                            ></div>
                        </span>
                    </div>
                )}
                <div ref={chatEndRef} />
            </ScrollArea>
            <div className="w-full p-4 border-t bg-background">
                <div className="w-full flex items-center justify-center">
                    <div className="w-full max-w-3xl relative">
                        <InputGroup>
                            <InputGroupTextarea className="pr-12 min-h-[50px] resize-none" placeholder="Ask anything" value={prompt} onChange={(e) => setprompt(e.target.value)} />
                            <div className="absolute bottom-2 right-2 flex items-end">
                                <InputGroupButton variant='outline' onClick={handlesend} disabled={!prompt} className="rounded-full h-8 w-8 p-0 border-blue-300"><Send className="h-4 w-4 font-bold text-blue-400" /></InputGroupButton>
                            </div>
                        </InputGroup>
                    </div>
                </div>
            </div>
        </div>
    )
}