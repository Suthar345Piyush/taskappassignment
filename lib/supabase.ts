// creating client in supabase first 

import {createClient} from "@supabase/supabase-js";


// supabase credentials here 

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;


if(!supabaseUrl || !supabaseAnonKey) {

    throw new Error('Missing Supabase environment variables');

}


// creating client  

export const supabase = createClient(supabaseUrl , supabaseAnonKey , {

     auth : {

        persistSession : true,
        autoRefreshToken : true,

     },

});


export type Task = {
   id : string;
   title : string;
   description : string;
   status : 'pending' | 'in_progress' | 'done';
   created_at : string;
   user_id : string;
};


export type Database = {
     public : {
        Tables : {
           tasks : {
             Row : Task;
             Insert : Omit<Task , 'id' | 'created_at'>;
             Update : Partial<Omit<Task , 'id' | 'user_id' | 'created_at'>>;
           };
        }
     }
};






   



