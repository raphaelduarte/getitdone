import React, { useState } from 'react'
import { Button } from "@/shadcn/components/ui/button"
import { Input } from '@/shadcn/components/ui/input'
import Logo from '@/components/Logo'
import { Link } from "react-router-dom"
import { useLogin } from '@/hooks/useLogin'
import { ReloadIcon } from '@radix-ui/react-icons'

export default function Login() {

    const { login, isPending, error } = useLogin()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async (e) => {
        e.preventDefault();
        login(email, password)
    }

    return (
        <div className="flex gap-20 h-screen w-full py-28 px-40">
            <div className="w-1/2 bg-secondary rounded-xl p-12">
                <Logo />
                <h2 className="mt-24 text-4xl leading-[50px] font-medium">Lorem ipsum dolor sit amet consectetur adipisicing elit.</h2>
                <p className='mt-10 text-muted-foreground'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae vitae dolores dolore vel? Animi exercitationem quas quis illo ab ratione, nam veniam harum magni.</p>
                <div className='bg-foreground text-background p-8 rounded-xl mt-16 leading-8'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum eum incidunt ipsum quasi voluptatum dolorum cumque repudiandae perspiciatis provident perferendis inventore fugiat, ea, nulla doloribus tenetur eaque voluptates! Vel, quis!
                </div>
            </div>
            <div className="flex flex-col justify-center w-1/2 px-20">
                <div>
                    <h1 className='text-3xl font-semibold'>Entrar na minha conta</h1>
                    <p className='mt-4 text-muted-foreground font-normal text-lg'>Informe os seus dados de acesso</p>

                    <form className='mt-10' onSubmit={handleLogin}>
                        <p className='mt-5 text-muted-foreground mb-2.5'>Email</p>
                        <Input className="bg-input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />

                        <p className='mt-5 text-muted-foreground mb-2.5'>Senha</p>
                        <Input className="bg-input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />

                        <Button size="xl" className='mt-10 text-lg w-full' disabled={isPending}>
                            {isPending && <ReloadIcon className='w-5 h-5 mr-2 animate-spin' />}
                            Entrar na minha conta
                        </Button>
                    </form>
                    <div className='flex gap-2 justify-center mt-12 text-lg'>
                        <p> Não tem uma conta?</p>
                        <Link to="/signup" className='text-primary'>Cadastre-se agora.</Link>
                    </div>
                </div>
            </div>
        </div>

    )
}
