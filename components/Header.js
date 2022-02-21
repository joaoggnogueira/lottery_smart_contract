import React from "react"
import { Menu } from "semantic-ui-react"
import { Link } from "../routes"

const Header = () => {
  return (
    <Menu style={{ marginTop: 24, marginBottom: 64 }}>
      <Link route="/">
        <a className="item">CrowdCoin</a>
      </Link>
      <Menu.Menu position="right">
        <Link route="/">
          <a className="item">ALL CAMPAIGNS</a>
        </Link>
        <Link route="/campaigns/new">
          <a className="item">NEW CAMPAIGN</a>
        </Link>
      </Menu.Menu>
    </Menu>
  )
}

export default Header
