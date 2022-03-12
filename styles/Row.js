import React from "react"

const Row = (props) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
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

export default Row
