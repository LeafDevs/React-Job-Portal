import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from 'react'
import * as icons from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Component() {
    const [isLogin, setIsLogin] = useState(true)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')

    const handleGoogleAuth = () => {
        window.location.href = 'http://localhost:3000/auth/google'
    }

    const handleLogin = () => {
        const url = isLogin ? "http://localhost:3000/auth" : "http://localhost:3000/register"
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name }),
        }).then(res => res.json())
            .then(res => console.log(res))
    }

    const passwordRequirements = [
        { text: "8 characters minimum", valid: password.length >= 8 },
        { text: "One lowercase character", valid: /[a-z]/.test(password) },
        { text: "One uppercase character", valid: /[A-Z]/.test(password) },
        { text: "One number or special character", valid: /[0-9!@#$%^&*]/.test(password) },
    ]

    return (
        <div className="flex min-h-screen bg-white">
            <div className="flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 w-full md:w-1/2">
                <div className="w-full max-w-md space-y-4 sm:space-y-6">
                    <div className="space-y-2 text-center">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-4xl">
                            {isLogin ? "Welcome Back!" : "Start Your Success Story"}
                        </h1>
                        <p className="text-sm sm:text-base text-gray-500">
                            {isLogin
                                ? "Login to your account to continue."
                                : "Sign up and start your job search journey!"}
                        </p>
                    </div>
                    <form className="space-y-3 sm:space-y-4" onSubmit={(e) => {
                        e.preventDefault()
                        handleLogin()
                    }}>
                        {!isLogin && (
                            <div className="space-y-1 sm:space-y-2">
                                <Label htmlFor="full-name" className="text-sm">Full name</Label>
                                <Input id="full-name" placeholder="Jane Doe" required onChange={(e) => setName(e.target.value)} className="text-sm" />
                            </div>
                        )}
                        <div className="space-y-1 sm:space-y-2">
                            <Label htmlFor="email" className="text-sm">Email</Label>
                            <Input id="email" placeholder="janedoe@example.com" required type="email" onChange={(e) => setEmail(e.target.value)} className="text-sm" />
                        </div>
                        <div className="space-y-1 sm:space-y-2">
                            <Label htmlFor="password" className="text-sm">Password</Label>
                            <Input id="password" placeholder="Enter your password" required type="password" onChange={(e) => setPassword(e.target.value)} className="text-sm" />
                            {password && (
                                <div className="mt-2">
                                    <p className="text-xs sm:text-sm text-gray-400">Password Requirements:</p>
                                    <div className="text-gray-400 flex flex-col space-y-1">
                                        {passwordRequirements.map((req, index) => (
                                            <div key={index} className={`flex items-center ${req.valid ? "text-green-500" : "text-red-500"}`}>
                                                <icons.CheckCircle className={`w-3 h-3 sm:w-4 sm:h-4 ${req.valid ? "text-green-500" : "text-red-500"}`} />
                                                <span className="ml-2 text-xs sm:text-sm">{req.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        {!isLogin && (
                            <div className="space-y-1 sm:space-y-2">
                                <Label htmlFor="confirm-password" className="text-sm">Confirm Password</Label>
                                <Input id="confirm-password" placeholder="Confirm your password" required type="password" onChange={(e) => setConfirmPassword(e.target.value)} className="text-sm" />
                                {password !== confirmPassword && <p className="text-red-500 text-xs sm:text-sm mt-1">Passwords do not match</p>}
                            </div>
                        )}
                        <div className="text-center">
                            <span className="text-xs sm:text-sm cursor-pointer" onClick={() => setIsLogin(!isLogin)}>
                                {isLogin ? "Don't have an account? Register Here!" : "Already have an account? Login here!"}
                            </span>
                        </div>
                        <Button className="w-full bg-[#C7AC59] text-black hover:bg-[#341A00] hover:text-white text-sm sm:text-base" type="submit">
                            {isLogin ? "Login" : "Sign up"}
                        </Button>
                        <div className="flex justify-center">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button className="w-10 h-10 sm:w-12 sm:h-12 bg-white border border-gray-300 rounded-md flex items-center justify-center hover:bg-[#C7AC59]" onClick={handleGoogleAuth}>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className="sm:w-8 sm:h-8">
                                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                                <path d="M1 1h22v22H1z" fill="none" />
                                            </svg>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-xs sm:text-sm">Login with Google</p>
                                    </TooltipContent>
                                </Tooltip>
            </TooltipProvider>
                        </div>
                    </form>
                </div>
            </div>
            <div className="hidden bg-white md:block md:w-1/2">
                <div className="relative h-full w-full">
                    <img
                        alt="Illustration of a person reading"
                        className="object-cover h-full w-full"
                        src="/placeholder.svg?height=1080&width=1080"
                    />
                </div>
            </div>
        </div>
    )
}