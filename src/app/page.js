'use client'

/* COMPONENTS */
import Message from "./components/message";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Background from "./components/background";
import { Dialog,DialogPanel,DialogBackdrop } from "@headlessui/react";

export default function Home() {
  const [input,setInput] = useState("")
  const [messages,setMessages] = useState([])

  const scrape = async()=>{
    if (!link){return}
    await fetch("/api/scrape",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        source:link
      })
    }).then((data)=>{
      data.json().then((obj)=>console.log(obj.data))
    }).then(()=>{
      setOpen(false)
    })
  }

  const sendMessage = async ()=>{
    if (!input){return}   
  }

  const [link,setLink] = useState("")

  const [open,setOpen] = useState(false)

  return (
    <main className="relative">
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 flex flex-col justify-center items-center w-full space-y-[1rem]">
                <label className="text-[30px] font-[500]">Add a link to a professor</label>
                <input className="w-full p-[1rem] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg lue-500 block focus:outline-none"
                  placeholder="Paste Link Here"
                  id="deck-title"
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
                <div className="flex flex-row justify-center items-center space-x-[1rem]">
                  <button type="button" onClick={() => setOpen(false)} className="text-[#333] bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center transition ease-in-out duration-300">Cancel</button>
                  <button type="submit" onClick={scrape} className="text-white bg-[#4bacfc] hover:bg-[#4480f7] focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center transition ease-in-out duration-300">Confirm</button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>


      <div className="w-screen h-screen min-h-screen flex flex-col items-center justify-center absolute float-left clear-left z-[2] bg-none">

        {/* stony header */}
        <div className="flex flex-row justify-start items-center space-x-[0.5rem] py-8">
          <button>
            <Image priority src={"/stony-brook-university-logo-horizontal.png"} width={0} height={0} sizes="100vw" style={{ width: "100%", height: "auto" }} alt={""} quality={100} />
          </button>
          <h1 className="font-medium text-2xl"> | College of Engineering and Applied Sciences</h1>
        </div>

        <div className="flex flex-row justify-around w-full h-[72px] bg-[#990000] font-medium text-white">
          <button onClick={()=>{setOpen(true)}} className="bg-[#990000] hover:bg-[#aa0000]"> Scrape Link </button>
          <button onClick={()=>{setMessages([])}} className="bg-[#990000] hover:bg-[#aa0000]"> Reset Chat</button>
        </div>
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
            {/* {messages.map()} */}
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
