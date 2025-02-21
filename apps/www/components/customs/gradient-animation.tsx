"use client";

import { motion } from "framer-motion";

export default function GradientAnimation() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        filter: "blur(10px)",
      }}
      animate={{
        opacity: 1,
        filter: "blur(0px)",
      }}
      transition={{
        duration: 1,
      }}
    >
      <div
        style={{
          borderRadius: "700px 700px 0px 0px",
        }}
        className="fixed blur-[100px] -bottom-[25rem] left-1/2 -translate-x-1/2 h-[35rem] w-3/4 animate-gradient overflow-hidden "
      >
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-background" />
      </div>

      <style jsx global>{`
        .animate-gradient {
          background: linear-gradient(
            to right,
            #ff6b6b,
            #feca57,
            #48dbfb,
            #ff9ff3,
            #ff6b6b
          );
          background-size: 500% 100%;
          animation: gradient 15s ease infinite;
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </motion.div>
  );
}
