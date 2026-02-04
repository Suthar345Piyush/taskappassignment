// Sign - up screen for app 

'use client';


import { useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function SignupPage() {
     
      const [email , setEmail] = useState('');
      const [password , setPassword] = useState('');
      const [confirmPassword , setConfirmPassword] = useState('');
      const [error , setError] = useState('');
      const [loading , setLoading] = useState(false);
      const [success , setSuccess] = useState(false);

      const router = useRouter();


      const handleSignup = async (e : React.SubmitEvent) => {
          e.preventDefault();
          setError('');
          setLoading(true);




          if(password !== confirmPassword) {
              setError('Passwords do not match');
              setLoading(false);
              return;
          }


          if(password.length < 6){
              setError('Password must be at least 6 characters');
              setLoading(false);
              return;
          }



          try {

             const {data , error} = await supabase.auth.signUp({ 
               email,
               password,
             });

             if(error) {

               setError(error.message);
             } else {

               setSuccess(true);

               setTimeout(() => {
                 router.push('/auth/login');
               } , 2000);
             }

          }  catch(error) {
              setError('An error occurred during signup');
          } finally {
             setLoading(false);
          }

      };

      

      if(success) {
         return (


            <div className="flex items-center justify-center min-h-screen px-4"> 
               <div className="w-full max-w-md">
                 <div className="bg-white rounded-lg shadow-md p-8"> 

                  <div className="bg-green-50 text-green-600 p-4 rounded mb-4">
                     
                      Account created successfully! Redirecting to login...
                     
                  </div>
                   
                 </div>
               </div>
               
            </div>
         );
      }


      return (

         <div className="flex items-center justify-center min-h-screen px-4">
           <div className="w-full max-w-md">
             <div className="bg-white rounded-lg shadow-md p-8">

               <h1 className="text-2xl font-bold text-center mb-6">
                  SignUp
                  </h1>  


                  {
                     error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
                           {error}
                          </div>
                     )
                  }


                  <form onSubmit={handleSignup} className="space-y-4">

                      <div>

                         <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                         </label>


                         <input id="email" type="email" value={email}  onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com"/>




                         
                      </div>


                      <div>
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">

                             Password
                             
                          </label>
                          
                          <input id="password"
                            type="password"
                             value={password}
                            onChange={(e) => setPassword(e.target.value)}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                               placeholder="••••••••"/>


                      </div>

                     <div>

                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">

                         Confirm  Password 
                      </label>

                      <input id="confirmPassword"
                            type="password"
                             value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                               placeholder="••••••••"/>
                     </div>


                     <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors">


                       {loading ? "Creating account..." : "Sign Up"}


                     </button>



                  </form>

                  <p className="text-center mt-4 text-sm text-gray-600">
                     Already have an account?{' '}

                     <Link href="/auth/login" className="text-blue-600 hover:underline">
                       Login


                     </Link>
                  </p>
               
             </div>
           </div>
         </div>
           

         
      )


};

