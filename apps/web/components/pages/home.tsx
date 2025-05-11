/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { motion } from "framer-motion";

import { Button } from "@noutify/ui/components/button";
import {
  ArrowRightIcon,
  BellDot,
  Book,
  CircleDotDashed,
  GitPullRequestArrow,
} from "lucide-react";
import Navbar from "../customs/navbar";

const Home = () => {
  return (
    <div className="dark relative bg-[#1F1F1F] text-[#D1CFC0] min-h-screen flex flex-col items-center">
      <Navbar />
      <motion.div
        variants={{
          initial: { opacity: 0, y: 20, filter: "blur(10px)" },
          animate: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
              delay: 0.2,
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
              delayChildren: 2,
            },
          },
        }}
        initial="initial"
        animate="animate"
        className="w-full px-4 sm:px-6 h-[80vh] flex flex-col items-center justify-center"
      >
        <h1 className="title relative px-4 sm:px-12 text-center !font-normal text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:!text-8xl leading-tight sm:leading-tight md:leading-tight lg:leading-[108px]">
          A Git client built <br className="md:block hidden" />
          for <span className="text-[#F76F53] italic">maintainers</span>.
        </h1>

        <p className="px-4 sm:px-12 flex flex-wrap max-w-[34rem] justify-center text-center lg:px-0 text-sm sm:text-base font-semibold mt-4 text-[#A7A59B]">
          Manage issues <CircleDotDashed className="mt-1 mx-1" size={16} />,
          pull requests <GitPullRequestArrow className="mt-1 mx-1" size={16} />,
          and
          <span className="ml-1 flex items-center">
            high-volume notifications{" "}
            <BellDot className="mt-0.5 mx-1" size={16} />
          </span>
          without leaving your local Git workflow.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-7 w-full sm:w-auto px-4 sm:px-0">
          <Button className="rounded-xl w-full sm:w-auto bg-[#D1CFC0] hover:bg-[#adaca1] text-[#1F1F1F] font-semibold group gap-1">
            Download
            <ArrowRightIcon
              className="-me-1 opacity-70 transition-transform group-hover:translate-x-1"
              size={16}
              aria-hidden="true"
            />
          </Button>
          <Button className="rounded-xl w-full sm:w-auto bg-[#363636] hover:bg-[#404040] text-[#D1CFC0] font-semibold gap-1">
            Read Docs
            <Book
              className="-me-1 opacity-60 transition-transform"
              size={16}
              aria-hidden="true"
            />
          </Button>
        </div>
      </motion.div>
      {/* <div className="w-full px-4 sm:px-6 md:px-12 lg:px-24 xl:px-56">
        <div className="w-full">
          <img
            src="/assets/shots_v6.png"
            style={{
              maskImage: "linear-gradient(to top, transparent 0%, black 100%)",
              WebkitMaskImage:
                "linear-gradient(to top, transparent 0%, black 100%)",
            }}
            alt="screenshot"
            className="border-2 rounded-2xl"
          />
        </div>
      </div> */}
      {/* <div className="h-64" /> */}
      <p >
        Cooking...
      </p>
    </div>
  );
};

export default Home;
