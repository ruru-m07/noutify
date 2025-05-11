"use client";

import { useState } from "react";
import Logo from "./logo";
import { Button, buttonVariants } from "@noutify/ui/components/button";
import { ArrowRightIcon, Book, Menu, Tag, Telescope, X } from "lucide-react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-12 lg:px-24 xl:px-72">
      <div className="w-full h-full mt-5 flex items-center p-4 justify-between">
        <div className="flex items-center">
          <Logo size={40} />
          <div className="text-xl sm:text-2xl ml-2">Noutify</div>
        </div>

        <div className="h-full hidden md:flex items-center">
          <Button className="rounded-xl" variant={"ghost"}>
            About
            <Telescope
              className="-me-1 ml-1.5 opacity-70"
              size={14}
              aria-hidden="true"
            />
          </Button>
          <Button className="rounded-xl" variant={"ghost"}>
            Docs
            <Book
              className="-me-1 ml-1.5 opacity-70"
              size={14}
              aria-hidden="true"
            />
          </Button>
          <Button className="rounded-xl" variant={"ghost"}>
            Release Notes
            <Tag
              className="-me-1 ml-1.5 opacity-70"
              size={14}
              aria-hidden="true"
            />
          </Button>
        </div>

        <div className="h-full flex items-center gap-2 sm:gap-4">
          <Link
            href={"https://github.com/ruru-m07/noutify"}
            target="_blank"
            className={buttonVariants({
              variant: "ghost",
              size: "icon",
              className: "rounded-xl",
            })}
          >
            <GitHubLogoIcon className="opacity-70" aria-hidden="true" />
          </Link>
          <Button className="rounded-xl hidden sm:flex bg-[#D1CFC0] hover:bg-[#adaca1] text-[#1F1F1F] font-semibold group gap-1">
            Download
            <ArrowRightIcon
              className="-me-1 opacity-70 transition-transform group-hover:translate-x-1"
              size={16}
              aria-hidden="true"
            />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-[#262626] z-50 border-b border-[#363636] shadow-lg">
          <div className="flex flex-col p-4 space-y-3">
            <Button variant="ghost" className="rounded-xl justify-between">
              About
              <Telescope
                className="ml-1.5 opacity-70"
                size={14}
                aria-hidden="true"
              />
            </Button>
            <Button variant="ghost" className="rounded-xl justify-between">
              Docs
              <Book
                className="ml-1.5 opacity-70"
                size={14}
                aria-hidden="true"
              />
            </Button>
            <Button variant="ghost" className="rounded-xl justify-between">
              Release Notes
              <Tag className="ml-1.5 opacity-70" size={14} aria-hidden="true" />
            </Button>
            <Button className="rounded-xl bg-[#D1CFC0] hover:bg-[#adaca1] text-[#1F1F1F] font-semibold group gap-1">
              Download
              <ArrowRightIcon
                className="-me-1 opacity-70 transition-transform group-hover:translate-x-1"
                size={16}
                aria-hidden="true"
              />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
