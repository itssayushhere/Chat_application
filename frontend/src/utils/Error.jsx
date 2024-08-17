const Error = ({errormessage}) => {
  return (
    <div className='w-full text-white  bg-red-600 bg-opacity-70 text-center text-lg my-2 font-semibold text-opacity-75 rounded-lg  p-2'>
        {errormessage}
    </div>
  )
}

export default Error