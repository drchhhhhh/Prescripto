import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className='flex flex-col justify-center items-center w-full min-h-screen bg-gray-100 gap-4'>
      <h1 className='text-[96px] font-medium text-[#2F7A4D]'>404</h1>
      <h2 className='text-4xl font-bold mb-2'>Page Not Found!</h2>
      <p className='text-xl text-gray-600 text-center mb-4'>
        The requested resource could not be found<br />
        on this server.
      </p>
      <p className='text-xl text-gray-600 mb-6'>Please check the URL and try again.</p>
      <Link 
        to="/" 
        className='bg-[#2F7A4D] text-white px-8 py-2 rounded-md hover:bg-[#246A3F] transition-colors'
      >
        Home
      </Link>
    </div>
  )
}