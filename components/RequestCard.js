import React from "react"
import { Card, Icon, Button } from "semantic-ui-react"
import { Margin, Row } from "../styles"

const Header = ({
  index,
  description,
  recipient,
  value,
  isOwner,
  finalizeRequest,
  approveRequest,
}) => {
  const finalize = () => {
    finalizeRequest(index)
  }
  const approve = () => {
    approveRequest(index)
  }
  return (
    <Margin mt={2}>
      <Card style={{ width: "100%" }}>
        <Card.Content header={description} />
        <Card.Content>
          <Row alignItems="center">
            Required
            <Margin ml={2} mr={0}>
              <Icon name="money" />
            </Margin>
            {value} wei &nbsp;&nbsp; to the wallet
            <Margin ml={2} mr={0}>
              <Icon name="user circle" />
            </Margin>
            {recipient}
          </Row>
        </Card.Content>
        <Card.Content extra>
          {isOwner ? (
            <Button
              icon="check circle"
              onClick={finalize}
              content="FINALIZE REQUEST"
              color="green"
            />
          ) : (
            <Button icon="check circle" onClick={approve} content="APPROVE REQUEST" color="green" />
          )}
        </Card.Content>
      </Card>
    </Margin>
  )
}

export default Header
