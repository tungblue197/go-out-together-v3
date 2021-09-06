import React, { Children, memo, useEffect, useMemo } from 'react'
import Image from 'next/image';
interface IAvatarProps {
    src?: string
    size?: 'xs' | 'sm' | 'md' | 'lg'
    onClick?: (e: any) => any 
}


const DEFAULT_IMAGE = '/images/default-user.png';
const Avatar: React.FC<IAvatarProps> = memo(function Button({ src = DEFAULT_IMAGE, size = 'sm', onClick }) {

    const getSize = useMemo(() => {
        switch (size) {
            case 'xs':
                return 30
            case 'sm':
                return 40
            case 'md':
                return 50
            case 'lg':
                return 70
            default:
                return 60
        }
    }, [size])
    return (
        <div className='rounded-full overflow-hidden cursor-pointer' onClick={e => {
            if(typeof onClick === 'function') onClick(e)
        }}>
            <Image src={src} width={getSize} height={getSize} alt='user-image' />
        </div>
    )
})

export default Avatar;