import { SetStateAction, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import * as icons from 'lucide-react'
import Nav from "@/components/ui/nav"
import Footer from "@/components/ui/footer"

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false); // State to track error
  const [errorMessage, setErrorMessage] = useState('')
  const [name, setName] = useState('')

  const handleGoogleAuth = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  }

  const handleLogin = () => {
    let url = ""
    if(isLogin) {
        url = "http://localhost:3000/auth"
    } else {
      url = "http://localhost:3000/register"
    }
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
            name: name,
        }),
    }).then(res => res.json())
    .then(res => console.log(res));
  }

  const passwordRequirements = () => {
    const requirements = [
      { text: "8 characters minimum", valid: password.length >= 8 },
      { text: "One lowercase character", valid: /[a-z]/.test(password) },
      { text: "One uppercase character", valid: /[A-Z]/.test(password) },
      { text: "One number or special character", valid: /[0-9!@#$%^&*]/.test(password) },
    ];
    return requirements;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#341A00] text-white dark:bg-white dark:text-[#341A00]">
      <Nav />
      <main className="flex-grow">
        <div className="w-full h-screen relative bg-[url('@/assets/bg-white-4.png')] dark:bg-[url('@/assets/bg.png')] bg-no-repeat bg-cover flex items-center justify-center">
            <Card className={`border-1.5 border-[#C7AC59] drop-shadow-[0_5px_12px_rgba(0,0,0,0.8)] bg-[#f5f5f5] dark:bg-zinc-900 transition-all duration-500 ease-in-out max-w-sm w-full p-4`}>
                <CardHeader>
                    <CardTitle className="text-xl flex items-center justify-center">{isLogin ? <><icons.User className="mr-2" /> Login</> : <><icons.User className="mr-2" /> Register</>}</CardTitle>
                </CardHeader>
                <CardContent>
                   {!isLogin && 
                   <>
                    <Input className={`bg-[#f5f5f5] dark:bg-zinc-800 focus:scale-105 transition-transform duration-300 ease-in-out focus:drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)] transition-drop-shadow duration-300 ${error ? 'outline outline-red-500' : ''}`} type="text" placeholder="Name" onChange={(e: { target: { value: SetStateAction<string> } }) => {
                      setName(e.target.value);
                      if(error) setError(false);
                    }}></Input>
                   </>}
                    <Input className={`mt-4 bg-[#f5f5f5] dark:bg-zinc-800 focus:scale-105 transition-transform duration-300 ease-in-out focus:drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)] transition-drop-shadow duration-300 ${error ? 'outline outline-red-500' : ''}`} type="email" placeholder="Email" onChange={(e: { target: { value: SetStateAction<string> } }) => {
                        setEmail(e.target.value);
                        if (error) setError(false); // Reset error on input change
                    }}></Input>
                    {error && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
                    <Input className={`mt-4 bg-[#f5f5f5] dark:bg-zinc-800 focus:scale-105 transition-transform duration-300 ease-in-out focus:drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)] transition-drop-shadow duration-300 ${error ? 'outline outline-red-500' : ''}`} type="password" placeholder="Password" value={password} onChange={(e: { target: { value: SetStateAction<string> } }) => {
                        setPassword(e.target.value);
                        if (error) setError(false); // Reset error on input change
                    }}></Input>
                    {password && !isLogin && (
                      <div className="mt-2">
                        <p className="text-gray-400">Password Requirements:</p>
                        <div className="text-gray-400 flex flex-col space-y-1">
                          {passwordRequirements().map((req, index) => (
                            <div key={index} className={`flex items-center ${req.valid ? "text-green-500" : "text-red-500"}`}>
                              <icons.CheckCircle className={req.valid ? "text-green-500" : "text-red-500"} />
                              <span className="ml-2 text-sm">{req.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                {!isLogin &&
                    <>
                        <Input className={`mt-4 bg-[#f5f5f5] dark:bg-zinc-800 focus:scale-105 transition-transform duration-300 ease-in-out focus:drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)] transition-drop-shadow duration-300 ${password !== confirmPassword ? 'outline outline-red-500' : ''}`} type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e: { target: { value: SetStateAction<string> } }) => setConfirmPassword(e.target.value)}></Input>
                        {password !== confirmPassword && <p className="text-red-500 text-sm mt-1">Passwords do not match</p>}
                    </>
                }
                <div className="flex items-center justify-center my-4">
                    <hr className="w-1/2 border-t border-gray-300 my-4" />
                    <span className="mx-4 text-gray-400">or</span>
                    <hr className="w-1/2 border-t border-gray-300 my-4" />
                </div>
                <Button variant="outline" className="w-full py-2 border-2 border-[#C7AC59] text-[#C7AC59] hover:bg-[#C7AC59] hover:text-white transition-colors duration-300" onClick={handleGoogleAuth}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
                <span className="ml-2">{isLogin ? "Login" : "Register" } with Google</span>
                </Button>
                <div className="flex items-center justify-center my-4">
                    <span className="mx-4 text-[#C7AC59] text-sm cursor-pointer" onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Don't have an account? Register Here!" : 'Already have an account? Login here!' }</span>
                </div>

                </CardContent>
                <CardFooter className="items-center justify-center">
                    <Button 
                        variant="link" 
                        className={`text-[#C7AC59] hover:border-[#C7AC59] hover:text-[#A08339] dark:text-white dark:hover:text-[#C7AC59] bg-zinc-700 dark:bg-zinc-800`}
                        onClick={() => {
                            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            if (email && password && confirmPassword == password) {
                              if(!emailPattern.test(email)) {
                                setError(true);
                                setErrorMessage("Must be a valid email!")
                              }
                              handleLogin();
                            } else {
                                setError(true); // Set error if email is not valid or password is not set
                                setErrorMessage("Email and password must be set.")
                            }
                        }}
                    >
                        {isLogin ? <><icons.User className="mr-2" /> Login</> : <><icons.User className="mr-2" /> Register</>}
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </main>
      <Footer string={'blocky'} />
    </div>
  )
}
