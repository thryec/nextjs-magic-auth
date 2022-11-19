import MagicWallet from '../components/MagicWallet'
import Metamask from '../components/Metamask'

const Home = () => {
  return (
    <div className="flex justify-center">
      <div className="mt-20">
        <MagicWallet />
        <Metamask />
      </div>
    </div>
  )
}

export default Home
