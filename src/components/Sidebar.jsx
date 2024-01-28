import { Button } from '@/shadcn/components/ui/button'
import { CalendarIcon, ChatBubbleIcon, Cross2Icon, DashboardIcon, ExitIcon, FaceIcon, FileTextIcon, InfoCircledIcon, LightningBoltIcon, PersonIcon } from '@radix-ui/react-icons'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLogout } from '@/hooks/useLogout'
import Logo from './Logo'
import { Separator } from '@/shadcn/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/components/ui/avatar"
import { useAuthContext } from '@/hooks/useAuthContext'
import LabelSvg from './Label'
import getInitials from '@/utils/getInitials'
import { useUserStore } from '@/stores/user'
import { useEffect } from 'react'
import { Cross } from 'lucide-react'



const userOptions = [
    {
        route: "/activity",
        name: "Atividade",
        icon: <LightningBoltIcon />
    },
    {
        route: "/profile",
        name: "Meu perfil",
        icon: <PersonIcon />
    },
]

const projectOptions = [
    {
        route: "/b",
        name: "Dashboard",
        icon: <DashboardIcon />
    },
    {
        route: "/pacientes",
        name: "Pacientes",
        icon: <FaceIcon />
    },
    {
        route: "/tasks",
        name: "Meus Projetos",
        icon: <FileTextIcon />
    },
    {
        route: "/chats",
        name: "Conversas",
        icon: <ChatBubbleIcon />
    },
    {
        route: "/calendar",
        name: "Calendário",
        icon: <CalendarIcon />
    },
]

const labelOptions = [
    {
        value: "high",
        name: "Alta Prioridade",
        icon: <LabelSvg color="#f00" />
    },
    {
        value: "medium",
        name: "Média Prioridade",
        icon: <LabelSvg color="orange"/>
    },
    {
        value: "low",
        name: "Baixa Prioridade",
        icon: <LabelSvg color='#f7d372' />
    },
    {
        value: "standby",
        name: "Em Standby",
        icon: <LabelSvg color='#00ee00' />
    },
]

export default function Sidebar({rerender, setRerender}) {

    const navigate = useNavigate()

    const { logout, error, isPending } = useLogout()

    const {user} = useAuthContext()

    const { selectedPriorityStore, setSelectedPriorityStore } = useUserStore()    


    return (
        <nav className="h-100% w-[250px] bg-secondary border border-muted-foreground">
            <div className='p-5'>
                <Logo size="sm" />
            </div>
            <div className='flex gap-2 p-5'>
                <Avatar>
                    <AvatarImage src={user.photoURL} />
                    <AvatarFallback>{ getInitials(user.displayName)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className='font-medium'>{user.displayName}</p>  
                    <p className='text-muted-foreground/75 text-sm'>Premium account</p>
                </div>
                
            </div>
            
            
            {userOptions.map(option => (
                <div key={option.route} role='button'
                    className="p-5 flex items-center gap-2"
                    onClick={() => navigate(option.route)}
                >
                    {option.icon}
                    {option.name}
                </div>))}
            
            <Separator className="my-4" />

            <h2 className='font-semibold text-xl px-5 mb-4'>Projetos</h2>

            {projectOptions.map(option => (
                <div key={option.route} role='button'
                    className="p-5 flex items-center gap-2"
                    onClick={() => navigate(option.route)}
                >
                    {option.icon}
                    {option.name}
                </div>))}
            
            <Separator className="my-4" />

            <h2 className='font-semibold text-xl px-5 mb-4'>Etiqueta</h2>

            {labelOptions.map(option => (
                <div 
                    key={option.value} 
                    role='button'
                    className="p-5 py-1.5 flex items-center justify-between"
                    
                >
                    <div className='felx gap-3'
                    onClick={() => setSelectedPriorityStore(option.value)}
                    >
                        {option.icon}
                        <p className={`text-md/90 ${
                            selectedPriorityStore == option.value ? "font-semibold" 
                            : ""
                        }`}>
                        {option.name}
                        </p>
                    </div>
                    {option.value == selectedPriorityStore && 
                    (<Cross2Icon 
                        role='button'
                        onClick={() => setSelectedPriorityStore("")}
                        />)}
                </div>))}
            
            <Separator className="my-4" />

            <div className="px-5 bg-secondary">
                <Button className="opacity-75" size="noPadding" variant='ghost'>
                    <InfoCircledIcon className='w-4 h-4 mr-2' />
                    Central de ajuda
                </Button>

                <Button 
                    className="opacity-75" 
                    size="noPadding" 
                    variant='ghost' 
                    onClick={logout}
                >
                    <ExitIcon className='w-4 h-4 mr-2' />
                    Sair da conta
                </Button>
                {rerender && <span className="hidden"></span>}
            </div>
        </nav>
    )
}
