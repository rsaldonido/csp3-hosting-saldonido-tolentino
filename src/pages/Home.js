import Banner from '../components/Banner';
import Highlights from '../components/Highlights';
import FeaturedProducts from '../components/FeaturedProducts';
import backgroundImage from '../assets/backgrounds/background2.png'; // Import the image

export default function Home() {
    const data = {
        title: "Red Ram",
        content: 'E-commerce app developed by Randolf "Ram" Saldonido and Jared Adrielle "Red" Tolentino.',
        destination: "/products",
        buttonLabel: "Buy now!",
        backgroundImage: backgroundImage // Use the imported image
    }

    return (
        <>
            <Banner data={data}/>
            <FeaturedProducts />
            <Highlights />
        </>
    )
}