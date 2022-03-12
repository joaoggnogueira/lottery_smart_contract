import React from "react"

const StatCard = (props) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      width: 200,
      height: 100,
      border: "1px solid #999",
      padding: "8px 16px",
      borderRadius: "8px",
      margin: "8px",
    }}
  >
    <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-end" }}>
      <div style={{ fontSize: 28, fontWeight: "bold", paddingBottom: "8px" }}>{props.total}</div>
      <div style={{ fontSize: 14, marginLeft: "8px" }}>{props.unit}</div>
    </div>
    <div style={{ fontSize: 16 }}>{props.description}</div>
  </div>
)

export default StatCard
