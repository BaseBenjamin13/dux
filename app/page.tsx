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
    <div className="flex min-h-screen items-center justify-center font-sans dark:bg-black">
      
      {!user ?
        <div className="absolute top-5 right-8  py-1 px-3">
          <Button onPress={() => router.push('/login')} size="lg" className="w-30 h-13 bg-linear-to-tr from-gray-950 to-gray-800 text-white text-xl font-bold shadow-lg" radius="full">
            Login
          </Button>
        </div>
        :
        <div className="absolute top-5 right-8 py-1 px-3">
          <Button onPress={() => signOut(auth)} size="lg" className="w-30 h-13 bg-linear-to-tr from-gray-950 to-gray-800 text-white text-xl font-bold shadow-lg" radius="full">
            Logout
          </Button>
        </div>
      }

      <div>
        <Button>Test</Button>
      </div>
    </div>
  );
}
