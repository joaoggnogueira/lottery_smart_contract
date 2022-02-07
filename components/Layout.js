import React from "react"

const Layout = (props) => {
  function renderHeader() {
    return <div style={{ background: "#2185d0", width: "100%", height: 64 }}></div>
  }
  function renderFooter() {
    return <div style={{ background: "#2185d0", width: "100%", height: 64 }}></div>
  }
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {renderHeader()}
      <div style={{ flexGrow: 1 }}>{props.children}</div>
      {renderFooter()}
    </div>
  )
}

export default Layout
