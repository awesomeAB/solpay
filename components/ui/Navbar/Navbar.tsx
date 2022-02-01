import Link from "next/link";
import s from "./Navbar.module.css";

import Logo from "components/icons/Logo";
import { useUser } from "utils/useUser";
import c from "classnames";
import { useTheme } from "next-themes";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

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
  const { user, signOut } = useUser();

  return (
    <nav className={c(s.root, "bg-snow dark:bg-dark")}>
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="max-w-6xl px-6 mx-auto">
        <div className="relative flex flex-row justify-between py-4 align-center md:py-6">
          <div className="flex items-center flex-1">
            <Link href="/">
              <a className={s.logo} aria-label="Logo">
                <Logo />
              </a>
            </Link>
            {/* <nav className="hidden ml-6 space-x-2 lg:block">
              <Link href="/">
                <a className={c(s.link, "text-dark dark:text-snow")}>Pricing</a>
              </Link>
              <Link href="/account">
                <a className={c(s.link, "text-dark dark:text-snow")}>Account</a>
              </Link>
            </nav> */}
          </div>

          <div className="flex justify-end flex-1 space-x-8">
            {/* {user ? (
              <Link href="#">
                <a
                  className={c(s.link, "text-dark dark:text-snow")}
                  onClick={() => signOut()}
                >
                  Sign out
                </a>
              </Link>
            ) : (
              <Link href="/signin">
                <a className={s.link}>Sign in</a>
              </Link>
            )} */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
