"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const languages = [
  { code: "en", name: "English", flag: "/images/langs/eng.png" },
  { code: "es", name: "Español", flag: "/images/langs/span.png" },
  { code: "fr", name: "Français", flag: "/images/langs/french.png" },
];

const DropdownLanguage = () => {
  const { i18n } = useTranslation(["header"]);
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const dropdown = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (!dropdown.current || !trigger.current) return;
      if (
        dropdownOpen &&
        !dropdown.current.contains(e.target as Node) &&
        !trigger.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    const keyHandler = (e: KeyboardEvent) => {
      if (dropdownOpen && e.key === "Escape") setDropdownOpen(false);
    };

    document.addEventListener("click", clickHandler);
    document.addEventListener("keydown", keyHandler);

    return () => {
      document.removeEventListener("click", clickHandler);
      document.removeEventListener("keydown", keyHandler);
    };
  }, [dropdownOpen]);

  const handleLanguageChange = (code: string) => {
    if (i18n.language !== code) {
      setDropdownOpen(false);
      router.push(`/${code}${pathname}`);
    }
  };

  return (
    <div className="relative">
      <button
        ref={trigger}
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex items-center gap-2 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
        aria-label="Select Language"
      >
        <Image
          width={32}
          height={32}
          src={
            languages.find((lang) => lang.code === i18n.language)?.flag ||
            "/images/langs/eng.png"
          }
          alt="Current Language"
          className="rounded-full"
        />
      </button>

      {dropdownOpen && (
        <div
          ref={dropdown}
          className="absolute right-0 z-10 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800"
          role="menu"
          aria-label="Language Dropdown"
        >
          <ul className="py-2">
            {languages.map(({ code, name, flag }) => (
              <li key={code}>
                <button
                  onClick={() => handleLanguageChange(code)}
                  className={`flex w-full items-center px-4 py-2 text-sm transition-colors ${
                    i18n.language === code
                      ? "font-bold text-primary"
                      : "text-gray-700 dark:text-gray-300"
                  } hover:bg-gray-100 dark:hover:bg-gray-700`}
                  role="menuitem"
                >
                  <Image
                    width={24}
                    height={24}
                    src={flag}
                    alt={name}
                    className="mr-3 rounded-full"
                  />
                  {name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownLanguage;
