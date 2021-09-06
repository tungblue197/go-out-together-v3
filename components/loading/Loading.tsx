import { useEffect, useState } from "react";
import Image from "next/image";
import React from "react";
import Router from 'next/router'

interface ILoadingProps {
  isLoading?: boolean;
}

const Loading: React.FC<ILoadingProps> = ({ }) => {
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        Router.events.on('routeChangeStart', () => {
            setIsLoading(true)
        })

        Router.events.on('routeChangeComplete', () => {
            setIsLoading(false)
        })
    }, [])
  return (
    <div className={`fixed inset-0 flex justify-center bg-white z-20 items-center ${isLoading ? 'flex' : 'hidden'}`}>
      <Image src="/images/Bean Eater-1s-200px.gif" width={100} height={100} alt='loading.git' />
    </div>
  );
};

export default Loading;
