import Banner from '../components/Banner';

export default function Error() {
    const data = {
        title: "404 - Not found",
        content: "Unable to find page",
        destination: "/",
        buttonLabel: "Back home",
        backgroundImage: "/images/error-bg.jpg" //NOTE: PENDING IMAGE KASI NAGHAHANAP PA AKO HAHAH
    }
    
    return (
        <Banner data={data}/>
    )
}