// all the tasks - CRUD Operations are here 

'use client';


import { useEffect , useState } from "react";
import { supabase , Task } from "../../../lib/supabase";

import { useRouter } from "next/navigation";
import {format} from 'date-fns';





export default function TasksPage() {
    
     const [tasks , setTasks] = useState<Task[]>([]);

     const [loading , setLoading] = useState(true);

     const [showModal , setShowModal] = useState(false);

     const [editingTask , setEditingTask] = useState<Task | null>(null);


     const [formData , setFormData] = useState({
       title : '',
       description : '',
       status : 'pending' as 'pending' | 'in_progress' | 'done',
     });


     const [filterStatus , setFilterStatus] = useState<string>('all');

     const [sortOrder , setSortOrder] = useState<'asc' | 'desc'>('desc');


     const router = useRouter();


     useEffect(() => {
        checkUser();
     } , []);


     const checkUser = async () => {

        const {data : {session}} = await supabase.auth.getSession();

        if(!session){
           router.push('/auth/login');

        }  else {
            fetchTasks();
        }

     };





     // fetching the tasks of user 


     const fetchTasks = async () => {

        setLoading(true);

        const {data : {user}} = await supabase.auth.getUser();

        if(!user) return;




        // query from supabase table  

        let query = supabase.from('tasks').select('*').eq('user_id' , user.id).order('created_at' , {ascending : sortOrder === 'asc'});


        if(filterStatus !== 'all') {
            query = query.eq('status' , filterStatus);
        }


        const {data , error} = await query;


        if(error) {

           console.error('Error fetching tasks:' , error);

        } else {

           setTasks(data || []);

        }

        setLoading(false);

     };



     useEffect(() => {

       if(!loading){
         fetchTasks();
       }


     } , [filterStatus , sortOrder]);



     // logout function 


     const handleLogout = async () => {

        await supabase.auth.signOut();

        router.push('/auth/login');
     };




     // opening modal function 

     const openModal = (task? : Task) => {

        if(task) {

           setEditingTask(task);

            setFormData({
               title : task.title,
               description : task.description,
               status : task.status,
            });

        }  else {
            setEditingTask(null);

            setFormData({
               title : '',
               description : '',
               status : 'pending',
            })
        }

        setShowModal(true);

     };



     // close modal function 

     const closeModal = () => { 

        setShowModal(false);
        setEditingTask(null);

        setFormData({

           title : '',
           description : '',
           status : 'pending',

        });
     };



     // submit function 

     const handleSubmit = async (e : React.SubmitEvent) => {

         e.preventDefault();


         const {data : {user}} = await supabase.auth.getUser();


         if(!user) return;


         // editing already existed task  

         if(editingTask) {

            // updating existing task 

            const {error} = await supabase.from('tasks').update({

                title : formData.title,
                description : formData.description,
                status : formData.status,

            }).eq('id' , editingTask.id);


            if(error) {
                console.error('Error updating task:' , error);
                alert('Failed to update task');

            } else {
                fetchTasks();
                closeModal();
            }

         }   
         
         
         else {
             
              // creating new task  

              const {error} = await supabase.from('tasks').insert([

                  {
                     title : formData.title,
                     description : formData.description,
                     status : formData.status,
                     user_id : user.id,
                  },

              ]);




              if(error) {

                 console.error('Error creating task:' , error);
                 alert('Failed to create task');

              } 
                else {
                    fetchTasks();
                    closeModal(); 
                }

         }

     };


     // deleting any tasks 

     const handleDelete = async (id : string) => {

        if(!confirm('Are you sure you want to delete this task?')) return;



        const {error} = await supabase.from('tasks').delete().eq('id' , id);



        if(error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task');

        }  else {
             fetchTasks();
        }

     };



     // color based on which status the tasks is 

     const getStatusColor = (status : string) => {

         switch(status) {

            case 'pending':
               return 'bg-yellow-100 text-yellow-800';

            case 'in_progress':
               return 'bg-blue-100 text-blue-800';

            case 'done':
               return 'bg-green-100 text-green-800';

            default:
               return 'bg-gray-100 text-gray-800';

         }

     };


     // status label which is at task in current 

     const getStatusLabel = (status : string) => {
        
         switch (status) {

            case 'pending':
               return 'Pending';

            case 'in_progress':
               return 'In Progress';

            case 'done':
               return 'Done';

            default:
              return status;
            
         }
     };





     if(loading) {

        return (

           <div className="flex items-center justify-center min-h-screen">

             <div className="text-lg">loading...</div>

           </div>
        )
     };



     return (


         <div className="min-h-screen bg-gray-50">

           <div className="bg-white shadow">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

               <div className="flex justify-between items-center">

                  <h1 className="text-2xl font-bold text-gray-900">
                    Task App
                  </h1>

                  <button onClick={handleLogout} className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-red-300 cursor-pointer">
                     Logout
                  </button>

               </div>
             </div>
           </div>


           {/* main part  */}


           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

             <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">

              <button onClick={() => openModal()} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
                 + New Task
              </button>




              <div className="flex flex-col sm:flex-row gap-4">
                 
                 {/* filtering  */}

                 <div className="flex items-center gap-2">

                  <label htmlFor="filter" className="text-sm font-medium text-gray-700">
                     Filter
                  </label>

                  <select id="filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}

                   className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black cursor-pointer">


                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>

                     
                  </select>
                   
                 </div>


                 {/* sorting tasks  */}

                 <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                    Sort:
                  </label>


                  <select id="sort" value={sortOrder} 
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')} 
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black cursor-pointer">

                    <option value="desc">
                      Newest First
                    </option>

                    <option value="asc">Oldest First</option>



                  </select>


                 </div>


                 
              </div>
             </div>



             {/* tasks list  */}


             {
              tasks.length === 0 ? (
                  
                <div className="text-center py-12">
                  <p className="text-gray-500">No tasks found. Create one to get started!</p>

                </div>



              ) : (
                  <div className="grid gap-4">
                    {
                       tasks.map((task) => (

                          <div key={task.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                           
                           <div className="flex justify-between items-start mb-2">

                              <h3 className="text-lg font-semibold text-gray-900">
                                 {task.title}
                              </h3>

                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>

                                 {getStatusLabel(task.status)}

                              </span>

                              </div>

                              <p className="text-gray-600 mb-3">{task.description}</p>


                            <div className="flex justify-between items-center">

                              <span className="text-sm text-gray-500">
                                 Created : {format(new Date(task.created_at) , 'MMM dd , yyyy HH:mm')}

                              </span>

                              <div className="flex gap-2">

                                 <button onClick={() => openModal(task)} className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-600 rounded hover:bg-blue-50 cursor-pointer">
                                    Edit

                                 </button>


                                 <button onClick={() => handleDelete(task.id)} className="px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-600 hover:bg-red-50 rounded cursor-pointer">
                                     Delete
                                 </button>

                                 </div>

                              
                              </div>

                            </div>

                       ))
                    }
                    </div>
              )
             }


           </div>






           {/* modal shown or not  */}


         {showModal && (

             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">


               <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">


                   <h2 className="text-xl font-bold mb-4 text-black">
                     {editingTask ? 'Edit Task' : 'New Task'}
                   </h2>


                   <form onSubmit={handleSubmit} className="space-y-4">

                     <div>

                         <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                         </label>


                         <input 

                         id="title" 
                         type="text" value={formData.title} 
                         onChange={(e) => setFormData({...formData , title : e.target.value})}
                         required
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                         placeholder="Enter task title"
                         
                         />

                     </div>

{/* editing description  */}


                     <div>

                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                           Description
                        </label>


                        <textarea 

                         id="decription" value={formData.description}
                         onChange={(e) => setFormData({...formData , description : e.target.value})}
                         required 
                         rows={3}
                         className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                         placeholder="Enter task description"

                        />
                         
                     </div> 


                     <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">

                           Status
                        </label>

                        <select 

                         id="status" value={formData.status}
                         onChange={(e) => setFormData({...formData , status : e.target.value as any})}

                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        >


                           <option value="pending">
                              Pending
                           </option>

                           <option value="in_progress">
                              In Progress
                           </option>

                           <option value="done">
                              Done
                           </option>

                        </select>


                     </div>


{/* cancel or update , create a new  task  */}


                     <div className="flex gap-3 pt-4">

                        <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer">

                           Cancel

                        </button>



                        <button type="submit" className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 cursor-pointer">

                           {editingTask ? 'Update' : 'Create'}

                        </button>


                        

                     </div>




                <div>
                   
                </div>
                  





                   </form>


                  </div>


               </div>

         )}


         </div>


     );

}

