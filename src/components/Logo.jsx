import React from 'react'
import LogoSvg from "../assets/logo.jpeg"
import { useNavigate } from 'react-router-dom'

export default function Logo({ size, justify }) {
    
    const height = size === "md" ? "h-8" : "h-11"

    let classes = "flex items-center gap-3"
    if(justify === "justify-center") classes += " justify-center"

    const navigate = useNavigate()

    const navigateToHome = () => {
        navigate('/')
    }

    return (
        <div className={classes}
            role="button"
            onClick={navigateToHome}
        >
            <img src={LogoSvg} className={height} />
            <h2 className='text-2xl tracking-widest font-medium'>
                psico
            <span className='text-primary'>
                wise
            </span></h2>
        </div>
    )
}
