import { Magic } from 'magic-sdk'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { spawn } from 'child_process'

const Wallet = () => {
  const [magic, setMagic] = useState<any>()
  const [provider, setProvider] = useState<any>()
  const [loggedIn, setLoggedIn] = useState<boolean>(false)

  useEffect(() => {
    const magic = new Magic('pk_live_13D0E3B027EC589E')
    const provider = new ethers.providers.Web3Provider(
      magic?.rpcProvider as any
    )
    setMagic(magic)
    setProvider(provider)
  }, [])

  const checkStatus = async () => {
    try {
      const isLoggedIn = await magic.user.isLoggedIn()
      console.log(isLoggedIn)
      setLoggedIn(isLoggedIn)
    } catch {
      console.log('error retrieving status')
    }
  }

  const logout = async () => {
    try {
      await magic.user.logout()
      console.log(await magic.user.isLoggedIn()) // => `false`
      setLoggedIn(await magic.user.isLoggedIn())
    } catch {
      console.log('error logging out')
    }
  }

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

  return (
    <div className="space-y-6">
      <h1 className="text-center text-2xl">Magic Wallet</h1>
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
      </div>

      <button className="rounded-md bg-blue-500 text-white px-4 py-1">
        SMS Login
      </button>
    </div>
  )
}

export default Wallet
