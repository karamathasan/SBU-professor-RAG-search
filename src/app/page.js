'use client'

/* COMPONENTS */
import Message from "./components/message";

import { useState, useEffect } from "react";
import Image from "next/image";
import { m, motion } from "framer-motion";
import Background from "./components/background";
import { Dialog,DialogPanel,DialogBackdrop } from "@headlessui/react";
import toast from "react-hot-toast";

export default function Home() {
  const [input,setInput] = useState("")
  const [messages,setMessages] = useState([])
  const [link,setLink] = useState("")

  const [scrapeOpen,setScrapeOpen] = useState(false)
  const [reviewOpen,setReviewOpen] = useState(false)

  function profToMessage(professor){
    const {name, department, courses, ratings, reviews} = professor
    let result = `${name} is a professor in the ${department} and teaches the following courses:`
    courses.forEach(course => {
        result +=`${course}`
    });
    result += `. Here are previous student reviews:`
    reviews.forEach((review, i) => {
        result += ` "${review}", rating: ${ratings[i]}/5;`
    })
    return result
  }

  const crawl = async () =>{
    await fetch("api/crawl",{
      method:"GET",
      headers:{
        "Content-Type":"application/json"
      }
    }).then(async (data)=>{
      const json = await data.json()
      console.log(json)
    })
  }

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
    }).then(async (res)=>{
      return res.json()
    }).then(async (json)=>{
      const professor = json.data
      const message = json.message
      if (professor !== "" && !message){
        await upsert(professor)
        toast.success("Data successfully scraped!")
      } else {
        toast.error(message)
      }
    }).then(()=>{
      setScrapeOpen(false)
    })
  }

  const upsert = async (professor)=>{
    if (!professor){return}
    const professor_embed = await fetch("/api/embed",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        text:profToMessage(professor)
      })
    }).then(async (res)=>{
      const json = await res.json()
      console.log(json.data)
      return json.data
    })
    await fetch("/api/upsert",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        professor:professor,
        professor_embed:professor_embed
      })
    }).then(async (res)=>{
      const json = await res.json()
      console.log(json.data)
    })
  }

  const sendMessage = async ()=>{
    if (!input || input.length === 0){return}   
    
    const storedInput = input
    const previous_messages = messages
    setInput('')
    setMessages((messages)=>[
      ...messages,{role:'user',content:storedInput}
    ])
    const latest = storedInput
    const latest_embed = await fetch("/api/embed",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        text:latest
      })
    })

    await fetch("/api/chat",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        // messages:[...messages, {role:'user',content:storedInput}]
        previous:previous_messages,
        latest:latest,
        latest_embed:latest_embed
      })
    }).then(async (res)=>{
      const json = await res.json()
      // console.log(json.data)
      return json
    }).then((json)=>{
      const responseMsg = json.data
      setMessages((messages)=>[
        ...messages,{role:'assistant',content:responseMsg}
      ])
    }).catch(()=>{
      setMessages((messages)=>[
        ...messages,{role:'assistant',content:"Sorry, something went wrong"}
      ])
    })
  }

  const init = ()=>{
    setMessages([{role:"assistant", content:"Hello, I am your AI professor search assistant. How can I help you?"}])
  }

  const clearChat = ()=>{
    setMessages([])
    init()
  }

  useEffect(()=>{
    init()
  },[])

  return (
    <main className="relative">
      <Dialog open={scrapeOpen} onClose={setScrapeOpen} className="relative z-10">
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
                <div className="flex flex-col justify-center items-center w-full">
                  <label className="text-[30px] font-[500]">Add a link to a professor</label>
                  <span className="text-[15px]">must be a link to a RateMyProfessor page</span>
                </div>
                <input className="w-full p-[1rem] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg lue-500 block focus:outline-none"
                  placeholder="Paste Link Here"
                  id="link"
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
                <div className="flex flex-row justify-center items-center space-x-[1rem]">
                  <button type="button" onClick={() => setScrapeOpen(false)} className="text-[#333] bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none font-medium rounded-[10px] text-sm w-full sm:w-auto px-5 py-2.5 text-center transition ease-in-out duration-300">Cancel</button>
                  <button type="submit" onClick={scrape} className="text-white bg-[#bb0000] hover:bg-[#990000] focus:ring-4 focus:outline-none font-medium rounded-[10px] text-sm w-full sm:w-auto px-5 py-2.5 text-center transition ease-in-out duration-300">Confirm</button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      {/* add professor review */}

      {/* <Dialog open={reviewOpen} onClose={setReviewOpen} className="relative z-10">
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
                <label className="text-[30px] font-[500]">Add a review to a professor</label>
                <input className="w-full p-[1rem] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg lue-500 block focus:outline-none"
                  placeholder="Paste Link Here"
                  id="link"
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
                <div className="flex flex-row justify-center items-center space-x-[1rem]">
                  <button type="button" onClick={() => setReviewOpen(false)} className="text-[#333] bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none font-medium rounded-[10px] text-sm w-full sm:w-auto px-5 py-2.5 text-center transition ease-in-out duration-300">Cancel</button>
                  <button type="submit" onClick={()=>{}} className="text-white bg-[#bb0000] hover:bg-[#990000] focus:ring-4 focus:outline-none font-medium rounded-[10px] text-sm w-full sm:w-auto px-5 py-2.5 text-center transition ease-in-out duration-300">Confirm</button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog> */}

      <div className="w-screen h-screen min-h-screen flex flex-col items-center justify-center absolute float-left clear-left z-[2] bg-none">

        {/* stony header */}
        <div className="flex flex-row justify-start items-center space-x-[0.5rem] py-8">
          <button>
            <Image priority src={"/stony-brook-university-logo-horizontal.png"} width={0} height={0} sizes="100vw" style={{ width: "100%", height: "auto" }} alt={""} quality={100} />
          </button>
          <h1 className="font-medium text-2xl"> | College of Engineering and Applied Sciences</h1>
        </div>

        <div className="flex justify-center w-full min-h-[3.5rem] bg-[#990000] font-medium text-white ">
          <div className="flex flex-row justify-around w-full max-w-[80vw] h-full">
            <div className="basis-1/2 flex flex-row justify-start">
              <button onClick={()=>{setScrapeOpen(true)}} className="bg-[#990000] hover:bg-[#aa0000] h-full px-8"> Scrape Link </button>
              <button onClick={crawl} className="bg-[#990000] hover:bg-[#aa0000] h-full px-8"> Begin Crawl </button>
              {/* <button onClick={()=>{setReviewOpen(true)}} className="bg-[#990000] hover:bg-[#aa0000] h-full px-8"> Add a Review </button> */}
              
            </div>
            <div className="basis-1/2 flex flex-row justify-end">
              <button onClick={clearChat} className="bg-[#990000] hover:bg-[#aa0000] px-8"> Reset Chat</button>
            </div>
          </div>
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
            {
              messages.map((message, index) => {
                return (
                  <motion.div
                    key={index}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ ease: "easeInOut", duration: 0.5, delay: 0.3 }}
                  >
                    <Message index={index} key={index} message={message}/>
                  </motion.div>
                );
              })
            }
          </div>

          <Background/>
          <form className="flex flex-row space-x-2 z-[2]" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Message" className="w-full border rounded-[25px] py-[0.5rem] px-[1rem]" value={input} onChange={(e)=>{setInput(e.target.value)}} />
            <button type="submit" className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-[10px] p-2 " onClick={sendMessage}>Send</button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
