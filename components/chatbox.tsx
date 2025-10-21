'use client'

import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import { Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import ReactMarkdown from 'react-markdown'

import { SpeechIcon, CirclePauseIcon } from "lucide-react";

import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

import {
    Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from '@/components/ui/select'

import { toast } from "sonner";


export default function Chatbox() {
    interface ChatMessage {
        id: string;
        content: string;
        sender: 'user' | 'bot';
        timestamp: number;
        isImage?: boolean;

    }
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const [loading, setloading] = useState(false);
    const [prompt, setprompt] = useState('');
    const [messages, setmessages] = useState<ChatMessage[]>([])
    const [recording, setrecording] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [denialToastShown, setDenialToastShown] = useState(false);

    const LANGUAGE_OPTIONS = {
        'ta-IN': 'Tamil',
        'en-IN': 'English',
        'ml-IN': 'Malayalam',
        'hi-IN': 'Hindi',
        'te-IN': 'Telugu',
        'kn-IN': 'Kannada',
        'mr-IN': 'Marathi',
    };

    const [selectedLanguage, setSelectedLanguage] = useState('en-IN');

    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsClient(true);
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (recording && transcript) {
            setprompt(transcript);
        }
    }, [transcript, recording]);

    useEffect(() => {
        if (isClient && SpeechRecognition.getRecognition()) {
            const recognition = SpeechRecognition.getRecognition();

            if (recognition) {

                recognition.onerror = (event) => {

                    const errorType = event.error as string;


                    if (errorType === 'not-allowed' || errorType === 'permission-denied') {

                        
                        setrecording(false);

                        

                        if(!denialToastShown){
                         setDenialToastShown(true);
                         toast.warning("Microphone access denied. Please check browser settings and enable it");
                        }

                    }
                };
                return () => {
                    recognition.onerror = null;
                };
            }
        }

    }, [isClient, setrecording, denialToastShown]);

    const handlerecord = () => {
        resetTranscript();
        setDenialToastShown(false);

        try {
            SpeechRecognition.startListening({
                continuous: true,
                language: selectedLanguage,
            });
            setrecording(true);

        } catch (e) {
            toast.info('Error starting microphone. Please try again later');
            setrecording(false);
        }
    }

    const handlerecordstop = () => {
        try {
            SpeechRecognition.stopListening()
        } catch (e) {
            toast.error('Something went wrong, please try again later')
        }
        setrecording(false);
    }


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
        resetTranscript();

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
            toast.error(errmessage);

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

    if (!isClient) {
        return <div className="flex flex-col h-[85vh] w-full border rounded-md p-4 items-center justify-center">Loading chat interface...</div>;
    }

    if (!browserSupportsSpeechRecognition) {
        toast.warning("You're browser didn't supported speech recognition, try with other browsers")
        return
    }

    return (
        <div className="flex flex-col h-[85vh] w-full border rounded-md">
            <ScrollArea className="flex-grow p-4 overflow-y-scroll hide-scrollbar">
                {messages.length === 0 && (<div className="flex flex-col items-center justify-center h-full">
                    <div className="text-center">
                        <h1 className="font-light text-lg lg:text-4xl md:text-2xl">Welcome to CogniTalk, You&apos;re AI friendly ChatBot😎</h1>
                    </div>
                </div>)}
                {messages.map(message => (
                    <div key={message.id} className={`m-5 flex ${message.sender === 'bot' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`p-4 border-2 mb-3 text-base break-words rounded-xl max-w-xs sm:max-w-md lg:max-w-xl block
                            ${message.sender === 'bot' ? ' rounded-tl-none border-gray-500' : 'rounded-tr-none border-gray-200'} [&>pre]:whitespace-pre-wrap [&>pre]:overflow-x-auto [&>p>a]:break-all`}>
                            <ReactMarkdown>
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="m-5 flex justify-start">
                        <span className={`
            p-4 mb-3 rounded-xl rounded-tl-none border-gray-500 border-2 
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
                        <InputGroup className="flex-wrap md:flex-nowrap">
                            <InputGroupTextarea placeholder="Ask anything" className="pr-12 min-h-[50px] text-sm resize-none hide-scrollbar max-h-40 md:text-base" value={prompt} onChange={(e) => setprompt(e.target.value)} onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handlesend()
                                }
                            }} />
                            <InputGroupAddon align='inline-start' className="w-full sm:w-auto">
                                <Select value={selectedLanguage} onValueChange={setSelectedLanguage} disabled={recording}>
                                    <SelectTrigger className="h-8 text-sm w-full focus:ring-0 focus:ring-offset-0">
                                        <SelectValue placeholder='Choose language' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Languages</SelectLabel>
                                            {Object.entries(LANGUAGE_OPTIONS).map(([code, name]) => (
                                                <SelectItem key={code} value={code}>
                                                    {name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </InputGroupAddon>
                            <InputGroupAddon align='inline-end'>
                                <InputGroupButton variant='secondary' onClick={handlesend} disabled={!prompt || recording} className="rounded-full h-8 w-full font-extrabold p-0 cursor-pointer disabled:cursor-not-allowed"><Send className="h-4 w-4 font-bold" /></InputGroupButton>
                            </InputGroupAddon>
                            {!recording ? <InputGroupAddon align='inline-start'>
                                <InputGroupButton variant='default' className="rounded-full h-8 w-8 font-extrabold p-0 cursor-pointer" onClick={handlerecord}><SpeechIcon className="h-4 w-4 font-bold" /></InputGroupButton>
                            </InputGroupAddon> : <InputGroupAddon align='inline-start'>
                                <InputGroupButton variant='destructive' className="rounded-full h-8 w-8 font-extrabold p-0 cursor-pointer" onClick={handlerecordstop}><CirclePauseIcon className="h-4 w-4 font-bold" /></InputGroupButton>
                            </InputGroupAddon>}
                        </InputGroup>
                    </div>
                </div>
            </div>
        </div>
    )
}