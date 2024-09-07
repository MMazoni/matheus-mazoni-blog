import * as React from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

const Layout = ({ location, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  header = (
    <>
      <nav>
          <Link className="header-link-home" to="/">
            <StaticImage
              layout="fixed"
              formats={["auto", "webp", "avif"]}
              loading="eager"
              placeholder="blurred"
              src="../images/name-logo.png"
              backgroundColor="transparent"
              className="logo-name"
              alt="Logo e nome"
            />
          </Link>
          <Link to="/sobre-mim">Sobre mim</Link>
      </nav>
    </>
  )

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()}, Construído com
        {` `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
      </footer>
    </div>
  )
}

export default Layout
