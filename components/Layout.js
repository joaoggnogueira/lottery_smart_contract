import React from "react"
import Header from "./Header"
import Footer from "./Footer"
import "semantic-ui-css/semantic.min.css"

import { Container } from "semantic-ui-react"

const Layout = (props) => {
  function renderFooter() {
    return <div style={{ background: "#2185d0", width: "100%", height: 64 }}></div>
  }
  return (
    <Container>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <div style={{ flexGrow: 1 }}>{props.children}</div>
        <Footer />
      </div>
    </Container>
  )
}

export default Layout
