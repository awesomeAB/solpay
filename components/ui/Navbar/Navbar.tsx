import Link from "next/link";
import s from "./Navbar.module.css";

import Logo from "components/icons/Logo";
import { useUser } from "utils/useUser";
import c from "classnames";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (typeof window != undefined) {
      const themeFromStorage = localStorage.getItem("theme");
      if (themeFromStorage) setTheme(themeFromStorage);
    }
  }, []);

  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      <i
        className={c(
          "text-3xl text-dark dark:text-snow",
          { "ri-sun-line": theme !== "light" },
          { "ri-moon-clear-line": theme === "light" },
        )}
      />
    </button>
  );
};

const Navbar = () => {
  const { user } = useUser();
  const { pathname } = useRouter();
  const isAccountPage = pathname.includes("account");
  return (
    <nav className={c(s.root, "bg-snow dark:bg-zinc-900")}>
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="mx-auto max-w-6xl px-6">
        <div className="align-center relative flex flex-row justify-between py-2 sm:py-4">
          <div className="flex flex-1 items-center">
            <Link href="/">
              <a className={s.logo} aria-label="Logo">
                <Logo />
              </a>
            </Link>
            {/* <nav className="ml-6 hidden space-x-2 lg:block">
              <Link href="/">
                <a className={c(s.link, "text-dark dark:text-snow")}>Pricing</a>
              </Link>
              <Link href="/account">
                <a className={c(s.link, "text-dark dark:text-snow")}>Account</a>
              </Link>
            </nav> */}
          </div>

          <div className="flex flex-1 justify-end space-x-8">
            {user ? (
              isAccountPage ? (
                <Link href="/dashboard">
                  <a className={s.link}>Dashboard</a>
                </Link>
              ) : (
                <Link href="/account">
                  <a className={s.link}>Account</a>
                </Link>
              )
            ) : null}

            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
