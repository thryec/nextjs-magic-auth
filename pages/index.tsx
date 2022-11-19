import MagicAuth from '../components/MagicAuth'
import MagicConnect from '../components/MagicConnect'
import Metamask from '../components/Metamask'

const Home = () => {
  return (
    <div className="flex justify-center">
      <div className="mt-20">
        <div className="flex space-x-4">
          <MagicAuth />
          <MagicConnect />
        </div>
        <Metamask />
      </div>
    </div>
  )
}

export default Home
