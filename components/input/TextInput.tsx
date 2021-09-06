import React, { memo } from 'react'

interface ITextInputProps{
    label?: string
    placeholder?: string,
    type?: 'password' | 'text',
    register?: any,
    error?: any,
    value?: any
}

const TextInput: React.FC<ITextInputProps> = memo(function TextInput({ label, placeholder, type = 'text', register = {}, error, value}) {
    return (
        <div className='flex flex-col'>
            <label className='text-sm font-semibold my-1 text-gray-500' >
                {
                    label
                }
            </label>
            <input value={value} {...register} type={type} className='outline-none flex-1 text-sm py-2 px-2 border border-gray-300 rounded ring-blue-300 focus:ring-1 placeholder-text-sm::placeholder' placeholder={placeholder} />
            <div className='text-xs text-red-600'>
                { error ? error?.message : null}
            </div>
        </div>
    )
})



export default TextInput
