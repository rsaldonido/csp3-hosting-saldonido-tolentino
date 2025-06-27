import { useState, useEffect } from 'react';
import Banner from '../components/Banner';
import Highlights from '../components/Highlights';
import FeaturedProducts from '../components/FeaturedProducts';
import backgroundImage from '../assets/backgrounds/background2.png';

export default function Home() {
    const [showComponents, setShowComponents] = useState({
        banner: true,
        featured: false,
        highlights: false
    });

    useEffect(() => {
        const timer1 = setTimeout(() => {
            setShowComponents(prev => ({...prev, featured: true}));
        }, 300);
        
        const timer2 = setTimeout(() => {
            setShowComponents(prev => ({...prev, highlights: true}));
        }, 600);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    const data = {
        title: "ByteZaar",
        content: 'E-commerce app developed by Randolf "Ram" Saldonido and Jared Adrielle "Red" Tolentino.',
        destination: "/products",
        buttonLabel: "Buy now!",
        backgroundImage: backgroundImage
    }

    return (
        <>
            {showComponents.banner && <Banner data={data}/>}
            {showComponents.featured && <FeaturedProducts />}
            {showComponents.highlights && <Highlights />}
        </>
    );
}