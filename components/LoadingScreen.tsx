
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

interface LoadingScreenProps {
    progress: number;
    message: string;
}

const LoadingScreen = ({ progress, message }: LoadingScreenProps) => {
    return (
        _jsxs("div", { className: "absolute inset-0 bg-[#020617] z-50 flex flex-col justify-center items-center", children: [
            _jsx("img", { src: "https://sharkvelocity.github.io/3d/logo.png", alt: "PhasmaPhoney", className: "w-full max-w-xl mb-8 animate-pulse" }),
            _jsxs("div", { className: "w-full max-w-2xl text-center", children: [
                _jsx("p", { className: "text-2xl text-gray-300 mb-4 tracking-wider", children: message }),
                _jsx("div", { className: "w-full bg-gray-700 rounded-full h-6 border border-gray-900", children: 
                    _jsx("div", { 
                        className: "bg-red-600 h-full rounded-full text-center text-white font-bold transition-all duration-300 ease-linear flex items-center justify-center", 
                        style: { width: `${progress}%` },
                        children: `${Math.round(progress)}%`
                    })
                })
            ]})
        ]})
    );
};

export default LoadingScreen;
