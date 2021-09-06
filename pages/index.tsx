import type { NextPage } from 'next'
import LoginForm from '../components/login-form'

const Home: NextPage = () => {
  return (
    <div className='flex justify-center items-center h-screen bg-gray-50'>
      <LoginForm />
    </div>
  )
}

export default Home
