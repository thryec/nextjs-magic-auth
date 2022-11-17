import { Magic } from 'magic-sdk'
import { ethers } from 'ethers'
import { useEffect } from 'react'

const Wallet = () => {
  useEffect(() => {
    const magic = new Magic('pk_live_13D0E3B027EC589E')
    const provider = new ethers.providers.Web3Provider(
      magic?.rpcProvider as any
    )
    console.log('provider: ', provider)
  }, [])

  return <div>Magic Wallet</div>
}

export default Wallet
