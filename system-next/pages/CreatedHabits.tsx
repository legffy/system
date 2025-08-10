import { useEffect, useState } from "react"
import React from "react"
import { useRouter } from "next/router"
type habit = {
  user_id: string;
  name: string;
  description: string;
  frequency: "per_day" | "per_week" | "per_month"; 
  freq_count: number;     // '3/week'
  category: string;       // Title Case
  is_from_ai: boolean;
  completed_today: boolean;
  is_archived: boolean;
  public: boolean;
  survey_id?: string | null;
  priority?: number | null;
  reminder_time?: string | null;
  reminder_timezone?: string | null;
};
export default function CreatedHabits(){
    const router = useRouter();
    const [habits,setHabits] = useState([]);
    const goToMainPage = async () =>{
        router.push("/home");
    }
    const getGeneratedHabits = async () =>{
        const res = await fetch('http://localhost:8000/habits',{
          method:"GET",
          credentials:"include",
        });
        const data = await res.json();
        setHabits(data.habits);
    };
    useEffect(()=>{
        getGeneratedHabits();
    },[])
    useEffect(()=>{
        console.log(habits);
    },[habits])
   return <div className="flex flex-col justify-center items-center">
        <div>
    {habits.map((habit: habit,index)=>{
       return <div key = {index}>
        <p>{habit.category}</p>
            <p>{habit.name}</p>
            <p>{habit.description}</p>
            <p>{habit.freq_count} {habit.frequency}</p>
            </div>
    })} 
        </div>
        <button>add</button>
        <button onClick = {goToMainPage}>Enter the system</button>
    </div>
}