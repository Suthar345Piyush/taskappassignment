'use client';


import { useEffect , useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";



export default function Home() {

    const router = useRouter();

    const [loading , setLoading] = useState(true);



    useEffect(() => {
        checkUser();
     } , []);


     // user checking function 

     const checkUser = async () => {

         const {data : {session}} = await supabase.auth.getSession();

         if(session) {

           router.push('/tasks');

         }  else {

           router.push('/auth/login');

         }

         setLoading(false);

     };


     if(loading) {

       return (

          <div className="flex items-center justify-center min-h-screen">

             <div className="text-lg">Loading....</div>

          </div>

       );
     }


     return null;

}


