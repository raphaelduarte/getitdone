import React, { useState } from 'react';
import { Textarea } from '@/shadcn/components/ui/textarea';
import { Input } from '@/shadcn/components/ui/input';
import { Button } from '@/shadcn/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/shadcn/components/ui/card"
import { Select } from '@/shadcn/components/ui/select';
import SelectPaciente from '@/components/SelectPaciente';


export default function Messages({userDoc}) {

    console.log(userDoc)

    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');

    const sendMessage = async () => {
        try {
            const response = await fetch(
                "https://api.z-api.io/instances/3C6F79AD3C85709E3C46B222D950B483/token/C9EF541F12340D112FBCA858/send-text",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "client-token": "F119d5c70464941d287215105cb51b1d4S"
                    },
                    body: JSON.stringify({
                        phone: phoneNumber,
                        message: message
                    })
                });

            if (!response.ok) {
                throw new Error('Falha ao enviar a mensagem');
            }

            console.log('Mensagem enviada com sucesso');
            setMessage('')
        } catch (err) {
            console.error(err);
        }
    };



    return (
        <div>
            <h1 className='m-5 text-2xl font-semibold'>Mensagens</h1>
            <div className='flex flex-col items-center justify-center'>
                <h1 className='m-5 text-xl font-semibold'>Envie uma mensagem para seu paciente</h1>
                <SelectPaciente userDo={userDoc} />
                <Input
                    className='m-5 w-1/2'
                    placeholder="Número do WhatsApp (com código do país)"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                />
                <Textarea
                    className='m-5 w-1/2 h-1/2'
                    placeholder="Digite aqui a mensagem para seu paciente..."
                    onChange={e => setMessage(e.target.value)}
                    value={message}
                />
                <Button
                    className='m-5 w-1/2'
                    onClick={sendMessage}
                >
                    Enviar Mensagem no Whatsapp
                </Button>
            </div>
            <div className='flex items-center justify-center'>
                <Card className='w-2/3 h-full'>
                    <CardHeader>
                        <CardTitle>Cintya Sabino</CardTitle>
                        <CardDescription>Paciente</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {message ? 
                        <p>{message}</p> 
                        : <p>Você ainda não enviou mensagens para seu paciente</p>
                        }
                    </CardContent>
                    <CardFooter>
                        <p>{new Date().toLocaleString()}</p>
                    </CardFooter>
                </Card>

            </div>
        </div>
    )
}
