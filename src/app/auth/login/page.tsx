// login part here 

'use client';

import { useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";




export default function LoginPage() {
    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');
    const [error , setError] = useState('');
    const [loading , setLoading] = useState(false);
     

     const router = useRouter();




     const handleLogin = async (e : React.SubmitEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);



        try {

            const {data , error} = await supabase.auth.signInWithPassword({
               email,
               password,
            });


            if(error) {
               setError(error.message);
            } else {
               router.push('/tasks');
            }

        } catch (error) {

           setError('An error occurred during login');

        } finally {

           setLoading(false);

        }
     };



     return (

      <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6 text-black">Login</h1>
          
          {error && (

            <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}


          <form onSubmit={handleLogin} className="space-y-4">
            <div>

              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>


              <input

                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="you@example.com"
              />


            </div>

            <div>




              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>




              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="••••••••"
              />



            </div>



            <button

              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >


              {loading ? 'Logging in...' : 'Login'}

            </button>
          </form>



          <p className="text-center mt-4 text-sm text-gray-600">



            Don't have an account?{' '}

            <Link href="/auth/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>



          </p>
        </div>
      </div>


    </div>
  );
}
     
      



    


