import Typewriter from "typewriter-effect";

const Message = (props) => {
    const assistantMsgStyling = () => { return "bg-gradient-to-l from-red-600 to-red-700 opacity-75 text-[#ededed] z-[10]" }
    const clientMsgStyling = () => { return "bg-[#fff] opacity-75 border-[2px]" }

    return (
        <div key={props.index} className={"flex " + (props.message.role === "assistant" ? 'justify-start' : 'justify-end')}>
            <div className={((props.message.role === "assistant") ? assistantMsgStyling() : clientMsgStyling()) + " rounded-[16px] p-[1rem]"}>
                {props.message.role === "assistant" &&
                    <Typewriter
                        onInit={(typewriter) => {
                            typewriter.changeDelay(10).pauseFor(400).start().typeString(props.message.content)
                        }}
                    />
                }
                {props.message.role !== "assistant" && 
                    <p>{props.message.content}</p>
                }
            </div>
        </div>
    )
}

export default Message;