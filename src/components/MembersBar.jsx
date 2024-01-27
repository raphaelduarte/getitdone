import React, {useEffect, useState, useLayoutEffect} from 'react'
import { useCollection } from '@/hooks/useCollection'
import { Skeleton } from "@/shadcn/components/ui/skeleton"
import { useAuthContext } from '@/hooks/useAuthContext'


function MembersSkeleton() {
    return (
        <div className="flex items-center gap-2.5 py-2.5">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-[120px]" />
        </div>
    )
}

export default function MembersBar({setSelectedChat, setChatIsOpen, chats, users}) {

    

    const {user} = useAuthContext()

    const openChat = (userId, userName) => {
        // TODO: essa função irá abrir o chat com o id userID
        const chat = chats.find((chat) =>
            chat.participants.includes(userId) &&
            chat.participants.includes(user.uid)
        )
        setChatIsOpen(true)

        setSelectedChat({
            id: chat?.id,
            recipient: userName,
            participants: [userId, user.uid],
        })
    }

    const usersLenght = Number(localStorage.getItem("usersLenght"))

    useEffect(() => {
        if (users) {
            localStorage.setItem("usersLenght", users.length)
        }
    }, [users])
    
    

    return (
        <aside className="h-100% w-[200px] border border-muted-foreground p-5">
            <h2 className='font-medium text-lg mb-5'>Membros</h2>
            {users ?
                (users.filter(u => u.id !== user.uid).map((user) => (
                    <div
                        key={user.id}
                        className='flex gap-2 items-center text-sm py-2.5'
                        role='button'
                        onClick={() => openChat(user.id, user.name)}
                    >
                        <div className={`h-3 w-3 ${user.online ? "bg-green-500" : "bg-red-500"} rounded-full`} />
                        <p className='font-medium'>{user.name}</p>
                    </div>
                ))) : [...Array(usersLenght)].map((_, index) => <MembersSkeleton key={index} />)
                
            }
        </aside>
    )
}
