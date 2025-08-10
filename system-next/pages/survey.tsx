import SurveyCarousel from "../components/surveryCarousel"
import { GetServerSideProps } from "next"

interface SurveyCarouselProps {
    user: any;
}
export const getServerSideProps: GetServerSideProps = async (context) => {
    const res = await fetch('http://localhost:8000/auth/api/protected', {
        headers: {
           cookie: context.req.headers.cookie || '',
        },
        });
        console.log("Fetching user data from server...");
        if(!res.ok){
            console.error("Failed to fetch user data:", res.statusText);
            return{
                redirect: {
                    destination: '/login',
                    permanent: false,
                },
            }
        }
        const data = await res.json();
        console.log("User data from server:", data);
        return {
            props: {
                user: data.user || null, // Pass user data to the page
            },
        };
    }

export default function Survey({user}: {user: any}) {
    return (
        <div>
            <h1>Survey</h1>
            <SurveyCarousel user={user} />
        </div>
    )
}
