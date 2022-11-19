import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import { useState } from 'react'

const Metamask = () => {
  const [metamaskAddress, setMetamaskAddress] = useState<any>()
  const [metamaskSigner, setMetamaskSigner] = useState<any>()
  const [metamaskProvider, setMetamaskProvider] = useState<any>()
  const [metamaskSignature, setMetamaskSignature] = useState<string>()

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      if (window.ethereum.chainId !== '0x5') {
        console.log('switch to goerli network')
      } else {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const connectedAddress = await signer.getAddress()
        setMetamaskProvider(provider)
        setMetamaskSigner(signer)
        setMetamaskAddress(connectedAddress)
      }
    } else {
      console.log('Please install Metamask')
    }
  }

  const signMessage = async () => {
    if (metamaskProvider) {
      try {
        console.log('signing...')
        const msg = 'hello world'
        let signature = await metamaskSigner.signMessage(msg)
        setMetamaskSignature(signature)
        console.log('signature', signature)
      } catch (err) {
        console.error('error signing message: ', err)
      }
    } else {
      alert('Please connect metamask')
    }
  }

  const sendEther = async () => {
    if (metamaskProvider) {
      try {
        const signer = await metamaskProvider.getSigner()
        console.log('wei: ', ethers.utils.parseEther('0.01'))
        const tx = await signer.sendTransaction({
          to: '0x4C36B84b2974604e0fEA458198F30864a70481E0',
          value: ethers.utils.parseEther('0.01'),
        })
        console.log('send eth txn: ', tx)
      } catch (err) {
        console.error('error sending transaction: ', err)
      }
    } else {
      alert('Please connect metamask')
    }
  }

  return (
    <div className="space-y-6 mt-10">
      <h1 className="text-center text-2xl mb-4">Metamask Wallet</h1>

      <button
        onClick={() => connectWallet()}
        className="rounded-md bg-blue-500 text-white px-4 py-1"
      >
        Connect Metamask
      </button>
      {metamaskAddress && <div>{metamaskAddress}</div>}

      <div>
        <button
          onClick={() => signMessage()}
          className="rounded-md bg-blue-500 text-white px-4 py-1"
        >
          Sign Message
        </button>
        {metamaskSignature && (
          <div className="block w-1/3">{metamaskSignature}</div>
        )}
      </div>
      <button
        onClick={() => sendEther()}
        className="rounded-md bg-blue-500 text-white px-4 py-1"
      >
        Send Transaction
      </button>
    </div>
  )
}

export default Metamask
