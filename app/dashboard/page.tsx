"use client";
import { Button } from "@heroui/button";
import Image from "next/image";
import { signOut } from 'firebase/auth';
import { useAuth } from "@/lib/context/AuthContext";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  // useEffect(() => {
  //   console.log('Current user:', user?.displayName);
  // }, [user]);

  return (
    <div className="flex flex-col min-h-screen items-center font-sans dark:bg-black">
      
      <div className="flex justify-between mb-10 w-full items-center bg-cyan-600">
        <div>
          <Image src="/dux-logo.png" alt="Logo" width={100} height={100} className="ml-3 p-1" />
        </div>
        <div>
          {!user ?
            <div className="  py-1 px-3">
              <Button onPress={() => router.push('/login')} size="lg" className="w-30 h-13 bg-linear-to-tr from-gray-950 to-gray-800 text-white text-xl font-bold shadow-lg" radius="full">
                Login
              </Button>
            </div>
            :
            <div className=" py-1 px-3">
              <Button onPress={() => router.push('/dashboard')} size="lg" className="w-30 h-13 bg-linear-to-tr from-gray-950 to-gray-800 text-white text-xl font-bold shadow-lg" radius="full">
                Dashboard
              </Button>
              {/* <Button onPress={() => signOut(auth)} size="lg" className="w-30 h-13 bg-linear-to-tr from-gray-950 to-gray-800 text-white text-xl font-bold shadow-lg" radius="full">
                Logout
              </Button> */}
            </div>
          }
        </div>
      </div>

    </div>
  );
}
