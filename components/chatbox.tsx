'use client'

import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
    InputGroup,
    InputGroupButton,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import { Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import ReactMarkdown from 'react-markdown'

export default function Chatbox() {
    interface ChatMessage {
        id: string;
        content: string;
        sender: 'user' | 'bot';
        timestamp: number;
        isImage?: boolean;

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

        const newUserMessage: ChatMessage = {
            id: Date.now().toString() + '-user',
            content: userPrompt,
            sender: 'user',
            timestamp: Date.now(),
        };

        setmessages(prev => [...prev, newUserMessage]);
        setloading(true);
        setprompt('');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: userPrompt
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
                        <h1 className="font-semibold text-4xl">Welcome to CogniTalk, You&apos;re AI friend!</h1>
                    </div>
                </div>)}
                {messages.map(message => (
                    <div key={message.id} className={`m-5 flex ${message.sender === 'bot' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`p-4 border-2 mb-3 break-words rounded-xl max-w-xs sm:max-w-md lg:max-w-xl block
                            ${message.sender === 'bot' ? ' rounded-tl-none border-blue-300' : 'rounded-tr-none border-blue-600'} [&>pre]:whitespace-pre-wrap [&>pre]:overflow-x-auto [&>p>a]:break-all`}>
                            <ReactMarkdown>
                                {message.content}
                            </ReactMarkdown>
                        </div>
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