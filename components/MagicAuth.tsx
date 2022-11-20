import { Magic } from 'magic-sdk'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'

const Wallet = () => {
  const [magic, setMagic] = useState<any>()
  const [magicProvider, setMagicProvider] = useState<any>()
  const [magicSigner, setMagicSigner] = useState<any>()
  const [magicAddress, setMagicAddress] = useState<any>()
  const [magicBalance, setMagicBalance] = useState<any>()
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [signature, setSignature] = useState<string>()

  const initiateProvider = async () => {
    const magic = new Magic('pk_live_13D0E3B027EC589E', {
      network: 'goerli',
    })
    const provider = new ethers.providers.Web3Provider(
      magic?.rpcProvider as any
    )
    const signer = await provider.getSigner()
    const address = await signer.getAddress()
    const balance = ethers.utils.formatEther(
      await provider.getBalance(address) // Balance is in wei
    )

    setMagicAddress(address)
    setMagic(magic)
    setMagicProvider(provider)
    setMagicSigner(signer)
    setMagicBalance(balance)
  }

  const checkStatus = async () => {
    try {
      const isLoggedIn = await magic.user.isLoggedIn()
      console.log('user login status: ', isLoggedIn)
      setLoggedIn(isLoggedIn)
    } catch {
      console.log('error retrieving status')
    }
  }

  const logout = async () => {
    try {
      await magic.user.logout()
      console.log('user logout status:', await magic.user.isLoggedIn())
      setLoggedIn(await magic.user.isLoggedIn())
    } catch {
      console.log('error logging out')
    }
  }

  useEffect(() => {
    initiateProvider()
  }, [])

  useEffect(() => {
    checkStatus()
  }, [magic])

  const emailLogin = async () => {
    console.log('clicked')
    try {
      await magic.auth.loginWithMagicLink({
        email: 'ledablack@proton.me',
      })
    } catch {
      console.log('email login error')
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

  return (
    <div className="space-y-6 border-2 p-4">
      <h1 className="text-center text-2xl mb-4">Magic Wallet</h1>
      {loggedIn ? (
        <span onClick={() => logout()}>Logout</span>
      ) : (
        <span>Not Logged In</span>
      )}
      <div>
        <input
          type="text"
          className="border-2 block mb-2 rounded-md px-2 py-1"
        />
        <button
          onClick={() => emailLogin()}
          className="rounded-md bg-blue-500 text-white px-4 py-1"
        >
          Email Login
        </button>
        {magicAddress && <div>{magicAddress}</div>}
        {magicBalance && <div>{magicBalance}</div>}
      </div>
      <div>
        <input
          type="text"
          className="border-2 block mb-2 rounded-md px-2 py-1"
        />
        <button className="rounded-md bg-blue-500 text-white px-4 py-1">
          SMS Login
        </button>
      </div>
      <div>
        <button
          onClick={() => signMessage()}
          className="rounded-md bg-blue-500 text-white px-4 py-1"
        >
          Sign Message
        </button>
        {signature && <div className="block w-1/3">{signature}</div>}
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

export default Wallet
