/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { motion } from "framer-motion";

import { Button, buttonVariants } from "@noutify/ui/components/button";
import {
  ArrowRightIcon,
  BellDot,
  Book,
  CircleDotDashed,
  GitPullRequestArrow,
  Star,
} from "lucide-react";
import Navbar from "../customs/navbar";
import Link from "next/link";
import { cn } from "@noutify/ui/lib/utils";

const Home = () => {
  return (
    <div className="dark relative bg-[#1F1F1F] text-[#D1CFC0] min-h-screen flex flex-col items-center">
      <motion.div
        className="absolute top-0 left-0 w-full h-full z-[1]"
        style={{
          backgroundImage: "url('/assets/overlay.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          backgroundBlendMode: "multiply",
          pointerEvents: "none",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 1.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
        aria-hidden="true"
      ></motion.div>
      <div className="z-10 w-full">
        <Navbar />
      </div>
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
        <div className="title relative px-4 sm:px-12 text-center !font-normal text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:!text-8xl leading-tight sm:leading-tight md:leading-tight lg:leading-[108px]">
          <div className="absolute -top-36 -right-32 hidden lg:block rotate-[5deg]">
            <img src="/assets/wanna.svg" alt="wanna?" className="size-52" />
          </div>
          <div className="absolute -bottom-[19rem] -left-[2rem] hidden lg:block -rotate-[7deg]">
            <img src="/assets/hmm.svg" alt="wanna?" className="size-52" />
          </div>
          <div className="absolute -top-8 -left-10 hidden lg:block -rotate-6">
            <MiniCard size="64px">
              <CircleDotDashed size={30} />
            </MiniCard>
          </div>
          <div className="absolute -bottom-48 right-20 hidden lg:block rotate-6">
            <MiniCard size="70px">
              <GitPullRequestArrow size={30} />
            </MiniCard>
          </div>
          <div className="flex relative items-center justify-center">
            A Git Client
            <span>
              <img
                src="/assets/git.svg"
                alt="logo"
                className="hidden xl:inline-block absolute top-[0.7rem] left-[14.8rem] bg-[#1F1F1F] size-5 mx-1"
              />
            </span>
          </div>
          for <span className="text-[#F76F53] italic">lazy</span> peoples.
        </div>

        <p className="px-4 sm:px-12 flex flex-wrap max-w-[34rem] justify-center text-center lg:px-0 text-sm sm:text-base font-semibold mt-6 text-[#A7A59B]">
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
          <Link
            href={"/downloads"}
            className={cn(
              buttonVariants({}),
              "rounded-xl hidden sm:flex bg-[#D1CFC0] hover:bg-[#adaca1] text-[#1F1F1F] font-semibold group gap-1"
            )}
            style={{
              boxShadow:
                "inset 2px 2px 10px 1px rgba(255, 255, 255, 1), inset -1px -1px 6px 1px rgba(0, 0, 0, 1)",
            }}
          >
            Download
            <ArrowRightIcon
              className="-me-1 opacity-70 transition-transform group-hover:translate-x-1"
              size={16}
              aria-hidden="true"
            />
          </Link>
          <Button
            style={{
              boxShadow:
                "inset 2px 2px 10px 1px rgba(255, 255, 255, 0.1), inset -1px -1px 6px 1px rgba(0, 0, 0, 0.7)",
            }}
            className="rounded-xl w-full sm:w-auto bg-[#363636] hover:bg-[#404040] text-[#D1CFC0] font-semibold gap-1"
          >
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
      <div className="z-10">Cooking...</div>
    </div>
  );
};

export default Home;

const MiniCard = ({
  children,
  size,
}: {
  children?: React.ReactNode;
  size: string;
}) => {
  return (
    <div
      style={{
        boxShadow:
          "inset 2px 2px 10px 1px rgba(255, 255, 255, 1), inset -1px -1px 6px 1px rgba(0, 0, 0, 1)",
        width: size,
        height: size,
      }}
      className="flex items-center justify-center bg-[#D1CFC0] text-[#363636] rounded-2xl"
    >
      {children}
    </div>
  );
};
