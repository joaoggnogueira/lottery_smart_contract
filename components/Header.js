import React from "react"
import { Menu } from "semantic-ui-react"

const Header = () => {
  return (
    <Menu style={{ marginTop: 24, marginBottom: 64 }}>
      <Menu.Item>CrowdCoin</Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item>ALL CAMPAIGNS</Menu.Item>
        <Menu.Item>NEW CAMPAIGN</Menu.Item>
      </Menu.Menu>
    </Menu>
  )
}

export default Header
