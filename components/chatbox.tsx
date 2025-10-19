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

export default function Chatbox() {
    const [loading, setloading] = useState(false);
    const [prompt, setprompt] = useState('');
    const [messages, setmessages] = useState([])

    const chatEndRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex flex-col h-[85vh] w-full border rounded-md">
            <ScrollArea className="flex-grow p-4 overflow-y-scroll hide-scrollbar">
                {/* this for Bot*/}
                <div className="m-5 flex justify-start">
                    <span className="p-4 mb-3 rounded-xl rounded-tl-none border-blue-300 border-2
                     max-w-xs sm:max-w-md lg:max-w-xl
                     block">
                        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
                    </span>
                </div>
                {/* this for user*/}
                <div className="m-5 flex justify-end">
                    <span className="p-4 rounded-xl rounded-tr-none border-blue-600 border-2
                     max-w-xs sm:max-w-md lg:max-w-xl
                     block">
                        here are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.
                    </span>
                </div>
                {/* this for Bot*/}
                <div className="m-5 flex justify-start">
                    <span className="p-4 mb-3 rounded-xl rounded-tl-none border-blue-300 border-2
                     max-w-xs sm:max-w-md lg:max-w-xl
                     block">
                        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
                    </span>
                </div>
                {/* this for user*/}
                <div className="m-5 flex justify-end">
                    <span className="p-4 rounded-xl rounded-tr-none border-blue-600 border-2
                     max-w-xs sm:max-w-md lg:max-w-xl
                     block">
                        here are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.
                    </span>
                </div>
                <div ref={chatEndRef} />
            </ScrollArea>
            <div className="w-full p-4 border-t bg-background">
                <div className="w-full flex items-center justify-center">
                    <div className="w-full max-w-3xl">
                        <InputGroup>
                        <InputGroupTextarea placeholder="What's going on?" value={prompt} onChange={(e) => setprompt(e.target.value)} />
                        <InputGroupAddon className="w-100" align='block-end'>
                            <InputGroupButton variant='default' disabled={loading} className="rounded w-full"><Send />Send</InputGroupButton>
                        </InputGroupAddon>
                    </InputGroup>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}