import React, { useState } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import Avatar from 'components/avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard, faBars, faIdCardAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import DropDown from 'components/dropdown';
interface ILightLayout {
    children?: React.ReactNode
}
const LightLayout: React.FC<ILightLayout> = ({ children }) => {
    const [showNav, setShowNav] = useState(false)
    return (
        <div className='h-screen bg-grat-100 flex flex-col'>
            <header className='shadow-xl px-2 md:px-8 flex items-center relative bg-white'>
                <div className={`absolute top-full left-0 right-0 bg-gray-100 md:hidden text-gray-50 bg-gray-700 z-9 ${showNav ? '' : 'hidden'}`}>
                    <div className='text-center pt-2 pb-1'>
                        <Avatar size={'lg'} />
                        <div className=''>
                            <div className='my-2'>
                                <FontAwesomeIcon icon={faSignOutAlt} />
                                <span className='ml-2'>Logout</span>
                            </div>
                            <div>
                                <FontAwesomeIcon icon={faIdCardAlt} />
                                <span className='ml-2'>Profile</span>
                            </div>
                        </div>
                    </div>
                    <nav className='flex flex-col space-x-2 font-semibold items-center list-none'>
                        <li className='cursor-pointer hover:text-yellow-600 px-2 uppercase border-b  border-t border-gray-50 w-full text-center py-1'>sessions</li>
                        <li className='cursor-pointer hover:text-yellow-600 px-2 uppercase border-b border-gray-50 w-full text-center py-1'>edit your location</li>
                        <li className='cursor-pointer hover:text-yellow-600 px-2 uppercase border-gray-50 w-full text-center py-1'>create a new session</li>
                    </nav>
                </div>
                <div>
                    <Link href='/session'>
                        <a>
                            <Image src={'/images/goouttogether.png'} width={100} height={100} />
                        </a>
                    </Link>
                </div>

                <div className='flex-1 flex justify-end'>
                    <nav className='flex space-x-2 text-gray-500 font-semibold items-center list-none mr-4 hidden md:flex'>
                        <li className='cursor-pointer hover:text-yellow-600 px-2 uppercase'>sessions</li>
                        <li className='cursor-pointer hover:text-yellow-600 px-2 uppercase'>edit your location</li>
                        <li className='cursor-pointer hover:text-yellow-600 px-2 uppercase'>create a new session</li>
                    </nav>
                    <div className='hidden md:block'>
                        <DropDown />
                    </div>
                    <div onClick={e => setShowNav(!showNav)} className='md:hidden text-2xl text-gray-600'>
                        <FontAwesomeIcon icon={faBars} />
                    </div>
                </div>
                <div className=''>

                </div>
            </header>
            <div className='flex-1'>
                {
                    children
                }
            </div>
        </div>
    )
}

export default LightLayout
