"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { cn } from "@noutify/ui/lib/utils";
import { buttonVariants } from "@noutify/ui/components/button";
import Logo from "../customs/logo";
import { ChevronRightIcon } from "lucide-react";

const Home = () => {
  return (
    <div className="relative">
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
        className="w-full h-screen flex flex-col items-center justify-center"
      >
        <Logo size={200} />
        <Link
          href="/auth/login"
          className={cn(
            "gap-1",
            buttonVariants({
              variant: "outline",
            })
          )}
        >
          onboarding
          <ChevronRightIcon
            className="opacity-60"
            size={16}
            aria-hidden="true"
          />
        </Link>
      </motion.div>
    </div>
  );
};

export default Home;
