import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import { useState } from 'react'

const Metamask = () => {
  const [metamaskAddress, setMetamaskAddress] = useState<any>()
  const [metamaskSigner, setMetamaskSigner] = useState<any>()

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
      const connectedAddress = await signer.getAddress()
      setMetamaskSigner(signer)
      setMetamaskAddress(connectedAddress)
    } else {
      console.log('Please install Metamask')
    }
  }

  return (
    <div className="mt-20">
      <button
        onClick={() => connectWallet()}
        className="rounded-md bg-blue-500 text-white px-4 py-1"
      >
        Connect Metamask
      </button>
      {metamaskAddress && <span>{metamaskAddress}</span>}
    </div>
  )
}

export default Metamask
