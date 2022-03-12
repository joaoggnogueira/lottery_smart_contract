import React from "react"

const Margin = ({ ma, mx, my, mt, mb, mr, ml, children }) => {
  function m(index) {
    const ps = [4, 8, 16, 24, 32, 64]
    return ps[index] ? ps[index] : undefined
  }

  return (
    <div
      style={{
        marginTop: m(ma) || m(my) || m(mt),
        marginLeft: m(ma) || m(mx) || m(ml),
        marginRight: m(ma) || m(mx) || m(mr),
        marginBottom: m(ma) || m(my) || m(mb),
      }}
    >
      {children}
    </div>
  )
}

export default Margin
