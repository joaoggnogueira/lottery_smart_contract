import React from "react"
import { Card, Icon } from "semantic-ui-react"
import { Margin } from "../styles"

const Header = ({ description, recipient, value }) => {
  return (
    <Margin my={2}>
      <a>
        <Card style={{ width: "100%" }}>
          <Card.Content header={description} />
          <Card.Content>
            <Icon name="user circle" />
            To {recipient}
          </Card.Content>
          <Card.Content extra>
            <Icon name="money" />
            Required {value} wei
          </Card.Content>
        </Card>
      </a>
    </Margin>
  )
}

export default Header
