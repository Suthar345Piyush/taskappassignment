import type { Metadata } from 'next';
import {Inter} from 'next/font/google';
import './globals.css';


const inter = Inter({
   subsets : ['latin'],
   display : 'swap',
});


export const metadata : Metadata = {
    title : 'Task Manager',
    icons : {
       icon : '/favicon.svg'
    },
    description : 'Manage your tasks efficiently with our modern task management app',
    keywords : ['tasks' , 'todo' , 'productivity' , 'task manager'],
};


export default function RootLayout({
   children,
    
} : {
   children : React.ReactNode;
}) {
    return (
       <html lang='en' suppressHydrationWarning>
         <body className={inter.className} suppressHydrationWarning>
            {children}
         </body>
       </html>
    )
};

