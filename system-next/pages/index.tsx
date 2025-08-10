import Link from "next/link";
export default function Home() {
  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-5xl mt-4 turret-road-regular ">System</h1>
      <p className="text-lg mt-2 ">Routine is your Reflection</p>
      <div className="flex gap-8 mt-4 text-lg">
        <Link href="/login" className="border-2 p-2 flex items-center justify-center hover:bg-gray-300">Login</Link>
        <Link href="/signup" className="border-2 p-2 flex items-center justify-center hover:bg-gray-300">Signup</Link>
      </div>
    </div>
  );
}