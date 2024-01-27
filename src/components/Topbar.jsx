import React from 'react'
import Logo from './Logo'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shadcn/components/ui/dropdown-menu"
import { HamburgerMenuIcon } from '@radix-ui/react-icons'

export default function Topbar() {
    return (
        <div className='fixed w-full bg-muted border border-border h-12 flex justify-between items-center px-6'>
            <HamburgerMenuIcon className='invisible w-6 h-6' />
            <Logo justify="justify-center" />
            <DropdownMenu>
                    <DropdownMenuTrigger>
                    <HamburgerMenuIcon className='w-6 h-6' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                        <DropdownMenuItem>Atividade</DropdownMenuItem>
                        <DropdownMenuItem>Meu perfil</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Dashboard</DropdownMenuItem>
                        <DropdownMenuItem>Tarefas</DropdownMenuItem>
                        <DropdownMenuItem>Conversas</DropdownMenuItem>
                        <DropdownMenuItem>Calendário</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            
        </div>
    )
}
