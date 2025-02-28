"use client";

import Link from "next/link";
import React from "react";
import AgentPulse from "../AgentPulse";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
// import { useTranslation } from "next-i18next";
// import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Button } from "../ui/button";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownLanguage from "./DropdownLanguage";

const Header = () => {
  // const { t } = useTranslation(["header"]);
  return (
    <header className="sticky z-999 left-0 right-0 top-0 bg-white/80 backdrop-blur-sm border-b shadow-header border-gray-200 px-4 md:px-0 dark:bg-boxdark dark:drop-shadow-none">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-4">
              <AgentPulse size="medium" color="blue" />
              <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                aGentTube
              </h1>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <ul className="flex items-center gap-2">
              <DarkModeSwitcher />

              <SignedIn>
                <Link href="/manage-plan" className="mr-10">
                  <Button variant="outline">
                    {/* {t("header:navigation:title")} */}
                    Manage Plan
                  </Button>
                </Link>

                <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full border bg-blue-100 border-blue-200 dark:bg-boxdark">
                  <UserButton />
                </div>
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    variant="default"
                    className="bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text"
                  >
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>

              <DropdownLanguage />
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

// export const getServerSideProps = async ({ locale }: { locale: string }) => ({
//   props: {
//     ...(await serverSideTranslations(locale ?? "en", ["header"])),
//   },
// });
