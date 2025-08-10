import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/router"
export default function Signup() {
    const [email, setEmail]  = useState("")
    const [username, setUsername]  = useState("")
    const [password, setPassword]  = useState("")
    const router = useRouter();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        switch (name) {
            case "email":
                setEmail(value);
                break;
            case "username":
                setUsername(value);
                break;
            case "password":
                setPassword(value);
                break;
        }
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:8000/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, username }),
            });
            const data = await res.json();
            console.log("Signup response:", data);
             if (!res.ok) {
                throw new Error(data.message || "Signup failed");
            }
            router.push("/survey");
        }catch (error) {
            console.error("Error during signup:", error);
        }
        
    }
    return(
        <div className="flex flex-col items-center p-8 border-2">
              <form className="flex flex-col justify-center items-center space-y-2" action="" onSubmit={handleSubmit}>
                <label htmlFor="">email</label>
                <input className="border-2 p-2" type="text" name = "email" value={email} onChange={handleChange}  required/>
                <label htmlFor="">username</label>
                <input className="border-2 p-2" type="text" name="username" value={username} onChange={handleChange} />
                <label htmlFor="">password</label>
                <input className="border-2 p-2" type="password" name="password" value={password} onChange={handleChange} required />
                <input className="border-2 p-2" type="submit" />
            </form>
            <Link className="flex justify-center items-center" href="/login">Already have an account? Login</Link>
        </div>
    )
}