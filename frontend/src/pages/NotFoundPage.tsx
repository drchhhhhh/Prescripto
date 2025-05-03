import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className='flex flex-col justify-center items-center w-full min-h-screen bg-gray-100 gap-4'>
      <h1 className='text-4xl'>404 Not Found!</h1>
      <Link to="/" className='text-2xl'>Go back Home.</Link>
    </div>
  )
}
