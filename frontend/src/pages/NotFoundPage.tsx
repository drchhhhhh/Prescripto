import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className='flex flex-col justify-center items-center w-full min-h-screen bg-primaryBG gap-4'>
      <h1 className='text-[96px] font-medium text-darkGreen'>404</h1>
      <h2 className='text-4xl font-bold mb-2 text-darkGray'>Page Not Found!</h2>
      <p className='text-xl text-darkGray text-center mb-4'>
        The requested resource could not be found<br />
        on this server.
      </p>
      <p className='text-xl text-darkGray mb-6'>Please check the URL and try again.</p>
      <Link 
        to="/dashboard" 
        className='bg-primaryGreen text-cleanWhite px-8 py-2 rounded-md hover:bg-darkGreen transition-colors'
      >
        Home
      </Link>
    </div>
  )
}
