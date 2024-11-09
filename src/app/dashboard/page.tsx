import React from 'react'

const page = () => {
  return (
    <div className="flex space-x-4">
        <a href="/company" className="btn btn-primary px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600">Company</a>
        <a href="/account" className="btn btn-primary px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600">Account</a>
        <a href="/voucher" className="btn btn-primary px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600">Voucher</a>
    </div>
  )
}

export default page