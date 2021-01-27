import React from "react"
import { Link } from "gatsby"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
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
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
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
      </footer>
    </div>
  )
}

export default Layout
