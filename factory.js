import web3 from "./web3"
import CampaignFactory from "./contract/build/CampaignFactory.json"

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0xAF9D3288E374A669616665556D068B8015F50679"
)

export default instance
