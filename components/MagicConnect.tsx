import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { Magic } from 'magic-sdk'
import { ConnectExtension } from '@magic-ext/connect'

const customNodeOptions = {
  rpcUrl:
    'https://eth-goerli.g.alchemy.com/v2/RoPFmIyYaQYNx89pp6Rkeq3mffyPdm5U', // your ethereum, polygon, or optimism mainnet/testnet rpc URL
  chainId: 5,
}

const MagicConnect = () => {
  const [magic, setMagic] = useState<any>()
  const [magicProvider, setMagicProvider] = useState<any>()
  const [magicSigner, setMagicSigner] = useState<any>()
  const [magicAddress, setMagicAddress] = useState<any>()
  const [signature, setSignature] = useState<string>()

  const initiateProvider = async () => {
    const magic = new Magic('pk_live_F62BBCA03F400290', {
      network: customNodeOptions,
      extensions: [new ConnectExtension()],
    })
    const provider = new ethers.providers.Web3Provider(
      magic?.rpcProvider as any
    )
    const signer = await provider.getSigner()

    setMagic(magic)
    setMagicProvider(provider)
    setMagicSigner(signer)
  }

  const login = async () => {
    if (magicProvider) {
      try {
        const accounts = await magicProvider.listAccounts()
        console.log('accounts: ', accounts)
        setMagicAddress(accounts[0])
      } catch (err) {
        console.log('error loggin in: ', err)
      }
    } else {
      alert('init magic provider first')
    }
  }

  const signMessage = async () => {
    if (magicProvider) {
      try {
        console.log('signing...')
        const msg = 'hello world'
        let signature = await magicSigner.signMessage(msg)
        setSignature(signature)
        console.log('signature', signature)
      } catch (err) {
        console.error('error signing message: ', err)
      }
    } else {
      alert('Please connect Magic wallet')
    }
  }

  const sendEther = async () => {
    if (magicProvider) {
      try {
        console.log('wei: ', ethers.utils.parseEther('0.01'))
        const tx = await magicSigner.sendTransaction({
          to: '0x3eb9c5B92Cb655f2769b5718D33f72E23B807D24',
          value: ethers.utils.parseEther('0.01'),
        })
        console.log('send eth txn: ', tx)
      } catch (err) {
        console.error('error sending transaction: ', err)
      }
    } else {
      alert('Please connect Magic wallet')
    }
  }

  useEffect(() => {
    initiateProvider()
  }, [])

  const disconnect = async () => {
    await magic.connect.disconnect().catch((e: any) => {
      console.log('error disconnecting:', e)
    })
    setMagicAddress(null)
  }

  return (
    <div className="space-y-6 border-2 p-4">
      <h1 className="text-center text-2xl mb-4">Magic Connect</h1>
      {magicAddress ? (
        <div className="space-y-6">
          <button
            onClick={() => magic.connect.showWallet()}
            className="rounded-md bg-blue-500 text-white px-4 py-1 block"
          >
            Show Wallet
          </button>
          <button
            onClick={() => signMessage()}
            className="rounded-md bg-blue-500 text-white px-4 py-1 block"
          >
            Sign Message
          </button>
          {signature && <div className="block w-1/3">{signature}</div>}

          <button
            onClick={() => sendEther()}
            className="rounded-md bg-blue-500 text-white px-4 py-1 block"
          >
            Send Ether
          </button>

          <button
            onClick={() => disconnect()}
            className="rounded-md bg-blue-500 text-white px-4 py-1 block"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={() => login()}
            className="rounded-md bg-blue-500 text-white px-4 py-1"
          >
            Login
          </button>
          {magicAddress && <div>{magicAddress}</div>}
        </div>
      )}
    </div>
  )
}

export default MagicConnect
