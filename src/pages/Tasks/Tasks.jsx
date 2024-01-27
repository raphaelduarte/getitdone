import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shadcn/components/ui/dropdown-menu"
import { Button } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';
import { ChevronDownIcon, Cross2Icon, MagnifyingGlassIcon, PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import { FilterIcon } from 'lucide-react';
import KanbanBoard from './KanbanBoard';
import React from 'react';
import { useState } from 'react';
import { useUserStore } from '@/stores/user';
import { Badge } from '@/shadcn/components/ui/badge';
import { useUsersContext } from "@/hooks/useUsersContext";

export default function Tasks() {

    const [showNewTaskDialog, setShowNewTaskDialog] = useState(false)

    const { searchStore, setSearchStore } = useUserStore()

    const { newTeamDocStore} = useUserStore()

    const { selectedTagStore, setSelectedTagStore } = useUserStore()

    const { selectedMemberStore, setSelectedMemberStore } = useUserStore()

    const { selectedMemberNameStore, setSelectedMemberNameStore } = useUserStore()

    const { users} = useUsersContext()


    return (
        <div className='p-10 sm:p-5'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-10'>
                <h1 className='text-2xl font-semibold'>Tasks Component</h1>
                <div className='flex flex-col sm:flex-row sm:items-center gap-5'>
                    <div className='flex items-center gap-2.5 border border-border py-2.5 px-5 rounded-lg mt-5 sm:mt-0'>
                        <MagnifyingGlassIcon className='w-6 h-6 text-muted-foreground' />
                        <Input
                            value={searchStore}
                            onChange={(e) => setSearchStore(e.target.value)}
                            placeholder="Pesquisar"
                            className='focus:outline-none bg-transparent w-full'
                        />
                        <Cross2Icon 
                            className="text-muted-foreground/75"
                            role="button"
                            onClick={() => setSearchStore("")}
                        />
                    </div>
                    <Button c
                        lassName=' text-md min-w-[40%]'
                        onClick={() => setSearchStore("")}
                    >
                        <PlusIcon className='w-5 h-5 mr-2' />
                        Nova tarefa
                    </Button>
                </div>
            </div>
            <div className='flex justify-between mb-5'>
                <div className="flex gap-2.5">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <div className='flex items-center gap-2 text-muted-foreground'>
                            <FilterIcon className='w-4 h-4' />
                            <p>Filtrar por tags</p>
                            <ChevronDownIcon className='w-5 h-5' />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Tags</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {newTeamDocStore?.tags?.map((tag) => (
                            <DropdownMenuItem 
                                className={`${tag == selectedTagStore ? "bg-primary/50" : ""}`}
                                key={tag}
                                onClick={() => setSelectedTagStore(tag)}
                                >{tag}</DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                {selectedTagStore && (
                    <Badge clas="cursor-default">
                    {selectedTagStore} 
                    <Cross2Icon
                        onClick={() => setSelectedTagStore("")} 
                        role="button" 
                        className="ml-1.5"
                    />
                </Badge>
                )}
                </div>
                
                <div>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <div className='flex items-center gap-2 text-muted-foreground'>
                            <FilterIcon className='w-4 h-4' />
                            <p>Filtrar por membro</p>
                            <ChevronDownIcon className='w-5 h-5' />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Membros</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {users?.map((u) => (
                            <DropdownMenuItem 
                                className={`${u.id == selectedMemberStore ? "bg-primary/50" : ""}`}
                                key={u.id}
                                onClick={() => {
                                    setSelectedMemberStore(u.id),
                                    setSelectedMemberNameStore(u.name)}}
                                >{u.name}</DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                {selectedMemberStore && (
                    <Badge clas="cursor-default">
                    {selectedMemberNameStore} 
                    <Cross2Icon
                        onClick={() => setSelectedMemberStore("")} 
                        role="button" 
                        className="ml-1.5"
                    />
                </Badge>
                )}
                </div>

            </div>
            <KanbanBoard
                showNewTaskDialog={showNewTaskDialog}
                setShowNewTaskDialog={setShowNewTaskDialog}
            />
        </div>
    );
}