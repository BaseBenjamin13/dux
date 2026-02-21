"use client";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, browserSessionPersistence, setPersistence, updateProfile } from "firebase/auth";
import { auth } from '../../lib/firebase';
import { ToastContainer, toast } from "react-toast";
import { useRouter } from "next/navigation";
import { createUserProfile } from "@/utils/user/createUserProfile";
import {Key} from '@react-types/shared';

export default function Home() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  const [emailError, setEmailError] = useState('')
  const [selected, setSelected] = useState<Key | null>("login");

  const signin = async () => {
    try {
      setPersistence(auth, browserSessionPersistence)
        .then(async () => {
          const res = await signInWithEmailAndPassword(auth, email, password);
          if (!res || !res.user) {
            console.log('failed to login')
          } else {
            setEmail("");
            setPassword("");
            setName("");
            router.push('/');
          }
        })
        .catch((error) => {
          if(error.code == "auth/invalid-credential"){
            toast.error("Sorry, Failed to Login - Invalid Email or Password");
          } else {
            toast.error("Sorry, Failed to Login. Please try again later.");
          }
        })
    } catch {
      toast.error("Failed to Login, sorry.");
    }
  }

  const signup = async () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        await updateProfile(user, {
          displayName: name.trim(),
        });

        await createUserProfile(user.uid, {
          email: user.email!,
          name: name
        });

        toast.success("User created");
        setPersistence(auth, browserSessionPersistence)
          .then(async () => {
            const res = await signInWithEmailAndPassword(auth, email, password);
            if (!res || !res.user) {
              console.log('failed to login')
            } else {
              setEmail("");
              setPassword("");
              setName("");
              router.push('/');
            }
          })
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode)
        console.log(errorMessage)
        if (errorCode == "auth/invalid-email") {
          setEmailError("Invalid email");
          setPasswordErrors([])
        } else if (errorCode == "auth/email-already-in-use") {
          setEmailError("Email already in use");
          setPasswordErrors([])
        } else if (errorCode == "auth/password-does-not-meet-requirements") {
          setEmailError("");
          const match = errorMessage.match(/\[(.*?)\]/);
          const requirementsArray = match[1].split(',').map((item: string) => item.trim());
          setPasswordErrors(requirementsArray)
        }
        toast.error("Failed to register user, sorry.");
      });
  }

  const submit = (type: string) => {
    if (email && password) {
      if (type == 'signin') {
        signin()
      } else if (type == 'signup') {
        signup()
      }
    } else if (email && !password) {
      setPasswordErrors(['Password required']);
      setEmailError("");
    } else if (!email && password) {
      setPasswordErrors([]);
      setEmailError("Email is required");
    } else {
      setEmailError("Email is required");
      setPasswordErrors(['Password required']);
    }
  }

  return (

     <div className="flex flex-col min-h-screen items-center pt-50 text-white bg-gray-950 font-sans text-lg">
      <Card className="w-full md:w-100 p-3 items-center">
        <Tabs aria-label="Options" selectedKey={selected} onSelectionChange={setSelected}>
          <Tab key="login" title="Login" className="flex flex-col w-full items-left">
            <CardHeader className="flex justify-center gap-3">
              <h1 className="text-xl font-bold">Login</h1>
            </CardHeader>
            <CardBody>
              <div className="w-full">
                <Input isRequired className="mt-5" color={emailError.length == 0 ? "default" : "danger"} type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                {
                  emailError.length > 0 && <p className="text-[#F32660]">{emailError}</p>
                }
                <Input isRequired className="mt-5" color={passwordErrors.length == 0 ? "default" : "danger"} type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {
                  passwordErrors.length > 0 &&
                  passwordErrors.map((error, i) => {
                    return (
                      <p key={i} className="text-[#F32660]">{error}</p>
                    )
                  })
                }
              </div>
            </CardBody>
            {/* <Divider /> */}
            <CardFooter className="justify-center">
              <Button color="secondary" className="text-xl font-bold w-36" onPress={() => submit('signin')}>Sign In</Button>
            </CardFooter>
          </Tab>
          <Tab title="Sign Up" key="sign up" className="flex flex-col w-full items-left">
            <CardHeader className="flex justify-center gap-3">
              <h1 className="text-xl font-bold">Sign Up</h1>
            </CardHeader>
            <CardBody className="w-full">
              <div className="w-full">
                <Input isRequired className="mt-5" color="default" type="text" label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <Input isRequired className="mt-5" color={emailError.length == 0 ? "default" : "danger"} type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                {
                  emailError.length > 0 && <p className="text-[#F32660]">{emailError}</p>
                }
                <Input isRequired className="mt-5" color={passwordErrors.length == 0 ? "default" : "danger"} type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {
                  passwordErrors.length > 0 &&
                  passwordErrors.map((error, i) => {
                    return (
                      <p key={i} className="text-[#F32660]">{error}</p>
                    )
                  })
                }
              </div>
            </CardBody>
            {/* <Divider /> */}
            <CardFooter className="justify-center">
              <Button color="secondary" className="text-xl font-bold w-36" onClick={() => submit('signup')}>Sign Up</Button>
            </CardFooter>
          </Tab>
        </Tabs>
      </Card>
      <ToastContainer position="top-right" />
    </div>
  );
}