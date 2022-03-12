import React from "react"

const Column = (props) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: props.justifyContent,
      alignItems: props.alignItems,
      flexWrap: props.flexWrap,
      maxWidth: props.maxWidth,
      flex: props.flex
    }}
  >
    {props.children}
  </div>
)

export default Column
