import React, { useState } from "react"
import { Link } from "gatsby"

const Layout = ({ location, title, children }) => {
  const [mode, setMode] = useState(
    typeof window !== "undefined" ? localStorage.theme : "light"
  )
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header
  const changeMode = () => {
    if (localStorage.theme === "dark") {
      localStorage.theme = "light"
      setMode("light")
      document.documentElement.classList.remove("dark")
    } else {
      localStorage.theme = "dark"
      setMode("dark")
      document.documentElement.classList.add("dark")
    }
  }
  if (typeof window !== "undefined" && localStorage.theme === "dark") {
    document.documentElement.classList.add("dark")
  }
  let switchBtnClass =
    mode === "dark" ? "justify-end bg-gray-400" : "bg-gray-400"

  if (isRootPath) {
    header = (
      <h1 class="main-heading flex space-x-10">
        <Link to="/">{title}</Link>
        <div>
          <svg
            style={{ display: "inline-block" }}
            width="30"
            height="30"
            fill="currentColor"
            class="transition-colors duration-200 text-gray-900"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M9.353 2.939a1 1 0 01.22 1.08 8 8 0 0010.408 10.408 1 1 0 011.301 1.3A10.003 10.003 0 0112 22C6.477 22 2 17.523 2 12c0-4.207 2.598-7.805 6.273-9.282a1 1 0 011.08.22z"
            ></path>
          </svg>
          <button
            class={`inline-flex items-center px-0.5 rounded-full 
            w-16 h-9 transition-colors duration-200 focus-visible:ring-2 
            focus-visible:ring-offset-2 focus-visible:ring-offset-white 
            focus-visible:ring-gray-500 focus:outline-none ${switchBtnClass}`}
            onClick={changeMode}
          >
            <span class="bg-white rounded-full w-8 h-8"></span>
          </button>
        </div>
      </h1>
    )
  } else {
    header = (
      <Link className="header-link-home" to="/">
        {title}
      </Link>
    )
  }

  return (
    <div
      className="global-wrapper dark:bg-gray-800 dark:text-white"
      data-is-root-path={isRootPath}
    >
      <header className="global-header">{header}</header>
      <main>{children}</main>
      <footer>
        <div className='h-1 bg-gray-400 shadow-md rounded-3xl'/>
        {isRootPath && (
          <div>
            <div style={{ marginTop: "1rem" }}>友情链接</div>
            <div>
              <a
                className="friend-link"
                href="https://www.paincker.com/"
                target="_blank"
                rel="noreferrer"
              >
                Paincker
              </a>
            </div>
          </div>
        )}
        <div className="mt-5 flex justify-center"><span className="mr-5">zhangyouxin © {new Date().getFullYear()}</span>  <a href='https://blog.weshinekx.cn/rss.xml' target='_blank' rel="noreferrer">RSS</a></div>
      </footer>
    </div>
  )
}

export default Layout
