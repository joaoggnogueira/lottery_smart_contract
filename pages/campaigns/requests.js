import React from "react"
import Layout from "components/Layout"
import { useRouter } from "next/router"
import { Button } from "semantic-ui-react"
import { Link } from "../../routes"

const Request = function () {
  const router = useRouter()
  const address = router.query.address
  return (
    <Layout>
      <Link route={`/campaigns/${address}`}>
        <a>
          <Button icon="chevron left" content="GO TO CAMPAIGN" primary />
        </a>
      </Link>
    </Layout>
  )
}

export default Request
