import React, {useState} from 'react'
import { Button } from "@/shadcn/components/ui/button"
import { Input } from '@/shadcn/components/ui/input'
import Logo from '@/components/Logo'
import { Link } from "react-router-dom"
import { useSignup } from '@/hooks/useSignup'
import { ReloadIcon } from '@radix-ui/react-icons'

export default function Signup() {

    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { signup, isPending, error } = useSignup()

    const handleSubmit = (e) => {
        e.preventDefault()
        signup(email, password, fullName)
    }

    return (
        <div className="flex gap-20 h-screen w-full py-28 px-40">
            <div className="w-1/2 bg-slate-200 rounded-xl p-12">
                <div className='flex items-center gap-4'>
                    <Logo />
                </div>
                <h2 className="mt-24 text-4xl leading-[50px] font-medium">Lorem ipsum dolor sit amet consectetur adipisicing elit.</h2>
                <p className='mt-10 text-muted-foreground'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae vitae dolores dolore vel? Animi exercitationem quas quis illo ab ratione, nam veniam harum magni.</p>
                <div className='bg-slate-800 text-background p-8 rounded-xl mt-16 leading-8'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum eum incidunt ipsum quasi voluptatum dolorum cumque repudiandae perspiciatis provident perferendis inventore fugiat, ea, nulla doloribus tenetur eaque voluptates! Vel, quis!
                </div>
            </div>
            <div className="flex flex-col justify-center w-1/2 px-20">
                <div>
                    <h1 className='text-3xl font-semibold'>Cadastre-se agora</h1>
                    <p className='mt-4 text-muted-foreground font-normal text-lg'>
                        Crie sua conta agora mesmo
                        </p>

                    <form className='mt-10' onSubmit={handleSubmit}>
                        <p className='text-muted-foreground mb-2.5'>Nome Completo</p>
                        <Input 
                            type="text" 
                            autoComplete="name" 
                            value={fullName} 
                            onChange={(e) => setFullName(e.target.value)} />

                        <p className='mt-5 text-muted-foreground mb-2.5'>Email</p>
                        <Input 
                            type="email" 
                            autoComplete="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} />

                        <p className='mt-5 text-muted-foreground mb-2.5'>Senha</p>
                        <Input 
                            type="password" 
                            autoComplete="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} />

                        <Button size="xl" className='mt-10 text-lg w-full' disabled={isPending}>
                            {isPending && (<ReloadIcon className='w-5 h-5 mr-2 animate-spin' />)}
                            {isPending ? "Criando a conta..." : "Criar a minha conta" }
                        </Button>
                    </form>
                    <div className='flex gap-2 justify-center mt-12 text-lg'>
                        <p> Já tem uma conta?</p>
                        <Link to="/login" className='text-primary'>Entre agora.</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
