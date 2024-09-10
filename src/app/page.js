'use client'

import Background from "./components/background";
import Message from "./components/message";
import Image from "next/image";
// #990000 stony red
export default function Home() {
  return (
    <main>
      <Background></Background>
        {/* stony header */}
        <div>

        </div>
        {/* chatbot messages */}
        <div className="flex flex-row justify-start items-center space-x-[0.5rem]">
          <div className="relative w-[24px] h-[24px]">
            <Image priority src={"sparkles.svg"} width={0} height={0} sizes="100vw" style={{ width: "100%", height: "auto" }} alt={""} quality={100} />
          </div>
          <h1>AI Chatbot</h1>
        </div>
        <div className="flex flex-col flex-grow space-y-2 overflow-auto max-h-full">
          <Message message={"penis"}></Message>
        </div>
        <div>
          {/* chatbot responses */}
          {/* users messages */}
          {/* user input field */}
        </div>
    </main>
  );
}
