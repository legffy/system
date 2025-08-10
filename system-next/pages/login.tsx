import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/router"
export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange= (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        switch (name) {
            case "email":
                setEmail(value);
                break;
            case "password":
                setPassword(value);
                break;
        }
    }
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Perform login logic here
        console.log("Logging in with:", { email, password });
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include', 
            });
            setEmail("");
            setPassword("");
            const data = await res.json();
            console.log("Login response:", data);
            if (!res.ok) {
                throw new Error(data.error || "Login failed");
            }
            const user = data.user;
            console.log("Logged in user:", user);
            if(!user) {
                throw new Error("User data not found");
            }
            handleDirect(user);
            // Redirect to survey or home page based on user data   
        } catch (error) {
            console.error("Error during login:", error);
            setLoading(false);
        }
        // Redirect or show success message
    };
    const handleDirect = async (user) => {
        try{
            const res = await fetch('http://localhost:8000/users/' + user.id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies for authentication
            });
            const data = await res.json();
            console.log("User data:", data);
            if (!res.ok) {
                throw new Error(data.error || "Failed to fetch user data");
            }
            if(!data.survey_completed) {
                console.log("User has not completed survey, redirecting to survey page");
                router.push("/survey");

            } else {
                router.push("/home");
            }

        }catch (error) {
            console.error("Error fetching user data:", error);
        }finally {
            setLoading(false);
        }
    }   
    return (loading ? (
            <div>Loading...</div>
        ) : (
            <div className="flex flex-col items-center p-8 border-2">
                <form className="flex flex-col justify-center items-center" action="" onSubmit={handleLogin}>
                    <label htmlFor="">email</label>
                    <input type="text" name = "email" value={email} onChange={handleChange} />
                    <label htmlFor="">password</label>
                <input type="password" name="password" value={password} onChange={handleChange} />
                <input type="submit" />
            </form>
            <Link className="flex justify-center items-center" href="/signup">Don't have an account? Sign up</Link>
        </div>
    )
)
}