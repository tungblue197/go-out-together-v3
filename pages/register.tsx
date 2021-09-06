import type { NextPage } from 'next'
import RegisterForm from 'components/register-form';

const Home: NextPage = () => {
  return (
    <div className='flex justify-center items-center h-screen bg-gray-50 px-1 md:px-2'>
      <RegisterForm />
    </div>
  )
}

export default Home
