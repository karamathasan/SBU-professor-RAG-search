'use client'

/* COMPONENTS */
import Message from "./components/message";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Background from "./components/background";
// #990000 stony red
export default function Home() {
  const [input,setInput] = useState("")
  const [messages,setMessages] = useState([])
  const sendMessage = async ()=>{
    
  }

  return (
    <main className="relative">
      <div className="w-screen h-screen min-h-screen flex flex-col items-center justify-center absolute float-left clear-left z-[2] bg-none">

        {/* stony header */}
        <div className="flex flex-row justify-start items-center space-x-[0.5rem] py-8">
          <button>
            <Image priority src={"/stony-brook-university-logo-horizontal.png"} width={0} height={0} sizes="100vw" style={{ width: "100%", height: "auto" }} alt={""} quality={100} />
          </button>
          <h1 className="font-medium text-2xl"> | College of Engineering and Applied Sciences</h1>
        </div>

        <div className="w-full h-[72px] bg-[#990000] "></div>
        <br className="py-8"></br>
      
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ease: "easeInOut", duration: 1 }}
          className="flex flex-col w-full h-full max-w-[80vw] shadow-md border p-4 rounded-[25px] space-y-3">
          
          <div className="flex flex-row justify-start items-center space-x-[0.5rem]">
            <div className="relative w-[24px] h-[24px]">
              <Image priority src={"sparkles.svg"} width={0} height={0} sizes="100vw" style={{ width: "100%", height: "auto" }} alt={""} quality={100} />
            </div>
            <h1>Professor RAG model</h1>
          </div>
          
          {/* Messages */}
          <div className="flex flex-col flex-grow space-y-2 overflow-auto max-h-full">

          </div>

          <Background/>
          <form className="flex flex-row space-x-2 z-[2]" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Message" className="w-full border rounded-[25px] py-[0.5rem] px-[1rem]" value={input} onChange={(e)=>{setInput(e.target.value)}} />
            <button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-[10px] p-2 " onClick={sendMessage}>Send</button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
