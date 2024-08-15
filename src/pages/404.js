import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const NotFoundPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={location} title={siteTitle}>
      <h1>404: Não encontrado</h1>
      <p>Você acabou esbarrando em uma rota que não existe... que triste.</p>
    </Layout>
  )
}

export const Head = () => <Seo title="404: Não encontrado" />

export default NotFoundPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
