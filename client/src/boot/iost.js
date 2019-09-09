const IOST = require('iost')
const bs58 = require('bs58')

import { KeyPair } from 'iost'

export let SDK
export let USING_IWALLET = false

export function isIWalletInstalled () {
  return (typeof IWalletJS !== 'undefined')
}

export function setup (store) {
  console.log('using iwallet', USING_IWALLET)
  if (USING_IWALLET) {
    SDK = IWalletJS.newIOST(IOST)
  } else {
    const rpc = new window.IOST.RPC(new IOST.HTTPProvider(process.env.IOST_NODE))

    SDK = new window.IOST.IOST({ // will use default setting if not set
      gasRatio: 1,
      gasLimit: 500000,
      delay: 0
    })

    const account = new IOST.Account(store.state.iost.accountName)
    const kp = new KeyPair(bs58.decode(store.state.iost.privateKey))

    account.addKeyPair(kp, 'owner')
    account.addKeyPair(kp, 'active')

    SDK.setAccount(account)
    SDK.account = account

    SDK.setRPC(rpc)
  }
}

export default ({ app, router, Vue, store }) => {
  if (isIWalletInstalled()) {
    IWalletJS.enable()
      .then((account) => {
        if (account) {
          USING_IWALLET = true
        } else {
          USING_IWALLET = false
        }
        setup(store)
      })
      .catch(() => {
        USING_IWALLET = false

        setup(store)
      })
  } else {
    USING_IWALLET = false
    setup(store)
  }
}
