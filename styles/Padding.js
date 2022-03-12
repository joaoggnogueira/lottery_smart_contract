import React from "react"

const Padding = ({ pa, px, py, pt, pb, pr, pl, children }) => {
  function p(index) {
    const ps = [4, 8, 16, 24, 32, 64]
    return ps[index] ? ps[index] : undefined
  }

  return (
    <div
      style={{
        paddingTop: p(pa) || p(py) || p(pt),
        paddingLeft: p(pa) || p(px) || p(pl),
        paddingRight: p(pa) || p(px) || p(pr),
        paddingBottom: p(pa) || p(py) || p(pb),
      }}
    >
      {children}
    </div>
  )
}

export default Padding
