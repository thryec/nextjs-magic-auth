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
  const [magicAddress, setMagicAddress] = useState<any>()

  const initiateProvider = async () => {
    const magic = new Magic('pk_live_F62BBCA03F400290', {
      network: customNodeOptions,
      extensions: [new ConnectExtension()],
    })
    const provider = new ethers.providers.Web3Provider(
      magic?.rpcProvider as any
    )

    setMagic(magic)
    setMagicProvider(provider)
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

  useEffect(() => {
    initiateProvider()
  }, [])

  const getWalletInfo = async () => {
    const info = magic.connect.getWalletInfo()
    console.log('wallet info: ', info)
  }

  const disconnect = async () => {
    await magic.connect.disconnect().catch((e: any) => {
      console.log('error disconnecting:', e)
    })
    setMagicAddress(null)
  }

  return (
    <div className="space-y-6 border-2 p-4">
      <h1 className="text-center text-2xl mb-4">Magic Connect</h1>
      <div>
        <button
          onClick={() => login()}
          className="rounded-md bg-blue-500 text-white px-4 py-1"
        >
          Login
        </button>
        {magicAddress && <div>{magicAddress}</div>}
      </div>

      <button
        onClick={() => getWalletInfo()}
        className="rounded-md bg-blue-500 text-white px-4 py-1 block"
      >
        Get Wallet Info
      </button>
      <button
        onClick={() => magic.connect.showWallet()}
        className="rounded-md bg-blue-500 text-white px-4 py-1 block"
      >
        Show Wallet
      </button>
      <button
        onClick={() => disconnect()}
        className="rounded-md bg-blue-500 text-white px-4 py-1 block"
      >
        Disconnect
      </button>
    </div>
  )
}

export default MagicConnect
