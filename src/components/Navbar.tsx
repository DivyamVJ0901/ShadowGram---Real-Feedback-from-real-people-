'use client'

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';
import { useRouter } from 'next/navigation';
import { error } from 'console';


function Navbar() {
  const { data: session } = useSession(); // extracting data from session
  const user : User = session?.user as User;
  const router = useRouter();

  const handleOnSubmit = async() => {
    try{
      signOut();
      router.replace("/");
    }
    catch(error){
      console.log("An error occured");
    }
  }

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          Shadow Gram
        </a>
        {session ? (
          <>
            <span className="mr-4">
              Welcome, {user.username || user.email}
            </span>
            <Button onClick={handleOnSubmit} className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>
               Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button className="w-full md:w-auto bg-slate-100 text-black" variant={'outline'}>Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;