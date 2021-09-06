import React, { Children, memo, useEffect, useMemo } from 'react'

interface IButtonProps {
    children?: React.ReactNode
    type?: 'primary' | 'success' | 'danger' | 'error'
    outline?: boolean
    onClick?: (e: any) => any
}
const Button: React.FC<IButtonProps> = memo(function Button({ children, type = 'none', outline = false, onClick }) {


    const typeClass = useMemo(() => {
        switch (type) {
            case 'primary':
                return outline ? 'border border-blue-300 text-blue-500' : 'text-blue-50 bg-blue-500'
            case 'success':
                return outline ? 'border border-green-300 text-green-500' : 'text-green-50 bg-green-500'
            case 'danger':
                return outline ? 'border border-yellow-300 text-yellow-500' : 'text-yellow-50 bg-yellow-500'
            case 'error':
                return outline ? 'border border-red-300 text-red-500' : 'text-red-50 bg-red-500'
            default:
                return outline ? 'border border-gray-300 text-gray-500' : 'text-gray-50 bg-gray-500'
        }

    }, [type])

    return (
        <div className={`shadow ring-red-300 flex p-2 text-sm font-semibold rounded ${typeClass}`}>
            <button onClick={e => {
                if (typeof onClick === 'function') onClick(e)
            }} className='flex-1 flex items-center justify-center'>
                {children}
            </button>
        </div>
    )
})

export default Button;
