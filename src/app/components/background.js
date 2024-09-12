// const Background = () => {
//     return (
//         <div className="absolute w-full bg-gray-50 min-h-screen flex items-center justify-center px-16 z-[1]">
//             <div className="relative w-full max-w-lg">
//                 <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
//                 <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
//                 <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
//             </div>
//         </div>
//     )
// export default Background

const Background = () => {
    return (
        <div className="absolute  w-full h-full max-w-[60vw] max-h-[60vh] z-[1]">            
            <div className="absolute top-0 left-0 w-full h-full bg-red-300 mix-blend-multiply filter blur-xl opacity-70 animate-blob ray one"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-red-300 mix-blend-multiply filter blur-xl opacity-70 animate-blob ray two"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-red-300 mix-blend-multiply filter blur-xl opacity-70 animate-blob ray three"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-red-300 mix-blend-multiply filter blur-xl opacity-70 animate-blob ray four"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-red-300 mix-blend-multiply filter blur-xl opacity-70 animate-blob ray five"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-red-300 mix-blend-multiply filter blur-xl opacity-70 animate-blob ray six"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-red-300 mix-blend-multiply filter blur-xl opacity-70 animate-blob ray seven"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-red-300 mix-blend-multiply filter blur-xl opacity-70 animate-blob ray eight"></div>

        </div>
    );
};

export default Background;
