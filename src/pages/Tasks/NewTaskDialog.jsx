import React, { useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/shadcn/components/ui/dialog"
import { Input } from "@/shadcn/components/ui/input"
import { Label } from "@/shadcn/components/ui/label"
import { Button } from "@/shadcn/components/ui/button"
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Textarea } from '@/shadcn/components/ui/textarea'
import { DatePickerWithPresets } from '@/components/DatePickerWithPresets'
import Select from 'react-select'
import { useDocument } from '@/hooks/useDocument'
import { PlusCircledIcon } from '@radix-ui/react-icons'
import { useFirestore } from '@/hooks/useFirestore'
import { arrayUnion } from 'firebase/firestore'
import { useToast } from '@/shadcn/components/ui/use-toast'
import { useUserContext } from '@/hooks/useUserContext'
import { useUsersContext } from '@/hooks/useUsersContext'
import { set } from 'date-fns'
import { useUserStore } from '@/stores/user'

const priorityOptions = [
    { value: "low", label: "Baixa" },
    { value: "medium", label: "Média" },
    { value: "high", label: "Alta" },
    { value: "standby", label: "Em standby" }
]


export default function NewTaskDialog({
    children,
    open,
    setOpen,
}) {

    const { addSubDocument: addTask } = useFirestore("teams")
    const { toast } = useToast()
    const { userDoc } = useUserContext()
    const { users } = useUsersContext()
    const { document: teamDoc } = useDocument("teams", userDoc.teamId)
    const { updateDocument: updateTeam } = useFirestore("teams")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [dueDate, setDueDate] = useState(null)
    const [priority, setPriority] = useState("")
    const [assignedMembers, setAssignedMembers] = useState([])
    const [selectedTags, setSelectedTags] = useState([])
    const [newTag, setNewTag] = useState("")
    const [ShowNewTagForm, setShowNewTagForm] = useState(false)
    const usersOptions = users?.map((user) => ({ value: user.id, label: user.name }))
    const tagOptions = teamDoc?.tags.map((tag) => ({ value: tag, label: tag }))
    const { selectedColumnStore } = useUserStore()

    const addNewTag = async (e) => {
        e.preventDefault()
        if (!newTag) return;
        await updateTeam("UQILt7zyBzSOby3mYgxV", {
            tags: arrayUnion(newTag)
        })
        toast({
            title: "Nova tag",
            description: `A tag ${newTag} foi adicionada com sucesso!`,
        })
        setNewTag("")
        setShowNewTagForm(false)
    }

    const getColumn = (status) => {
        switch (status) {
            case "column-1":
                return "backlog"
            case "column-2":
                return "todo"
            case "column-3":
                return "inProgress"
            case "column-4":
                return "inReview"
            default:
                return "backlog"
        }
    }

    const getColumnIdByColumn = (column) => {
        switch (column) {
            case "backlog":
                return "column-1"
            case "todo":
                return "column-2"
            case "inProgress":
                return "column-3"
            case "inReview":
                return "column-4"
            default:
                return "column-1"
        }
    }

        const createTask = async (e) => {
            e.preventDefault()
            if (!title
                || !description
                || !dueDate
                || !priority
                || !assignedMembers.length >= 1
                || !selectedTags) {
                return toast({
                    title: "Erro",
                    description: "Preencha todos os campos para criar uma nova tarefa.",
                })
            }

            const taskObject = await addTask(userDoc.teamId, "tasks", {
                title,
                description,
                dueDate,
                status: selectedColumnStore,
                assignedMembers: assignedMembers.map((member) => member.value),
                tags: selectedTags.map((tag) => tag.value),
                deleted: false,
                priority: priority,
            })

            const { payload: taskId } = taskObject
            
            await updateTeam(userDoc.teamId, {
                [getColumnIdByColumn(selectedColumnStore)]: arrayUnion(taskId)
            })

            toast({
                title: "Nova tarefa",
                description: `A tarefa ${title} foi criada com sucesso!`,
            })

            setTitle("")
            setDescription("")
            setDueDate(null)
            setAssignedMembers([])
            setSelectedTags([])
            setOpen(false)
            setPriority("")
        }


        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Nova tarefa</DialogTitle>
                        <DialogDescription>
                            Preencha os dados abaixo para criar uma nova tarefa.
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Label className="text-sm">
                            Título
                        </Label>
                        <div className="flex items-center justify-between">
                            <div className="w-full">
                                <Input
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(e.target.value)}
                                    id="titleTask" />
                            </div>
                        </div>
                        <Label className="text-sm">
                            Descrição
                        </Label>
                        <div className="flex items-center justify-between"></div>
                        <div className="w-full">
                            <Textarea className="resize-none"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                id="descriptionTask" />
                        </div>
                        <div className="items-center justify-between">
                            <div className='flex items-center gap-2'
                                role="button"
                                onClick={() => { setShowNewTagForm(true) }}>

                                <Label className="text-sm">Tags</Label>
                                <PlusCircledIcon className='w-5 h-5 text-muted-foreground/75 cursor-pointer shrink-0' />

                                {ShowNewTagForm && (
                                    <form onSubmit={addNewTag}>
                                        <Input
                                            value={newTag}
                                            onChange={(e) =>
                                                setNewTag(e.target.value)}
                                            className='h-6 text-muted-foreground/75'
                                            placeholder='Nova tag...'
                                        />
                                    </form>
                                )}
                            </div>
                            <div className="w-full">
                                <Select
                                    isMulti
                                    options={tagOptions}
                                    onChange={(options) =>
                                        setSelectedTags(options)} />
                            </div>
                        </div>
                        <div className="items-center justify-between">
                            <Label className="text-sm">
                                Data de entrega
                            </Label>
                            <div className="w-full">
                                <DatePickerWithPresets
                                    date={dueDate}
                                    setDate={setDueDate} />
                            </div>
                        </div>
                        <div className="items-center justify-between">
                            <Label className="text-sm">
                                Prioridade
                            </Label>
                            <div className="w-full">
                                <Select
                                    options={priorityOptions}
                                    onChange={(option) =>
                                        setPriority(
                                            {
                                                "label": option.label,
                                                "value": option.value
                                            })}
                                />
                            </div>
                        </div>
                        <div className="items-center justify-between">
                            <Label className="text-sm">
                                Atribuir a
                            </Label>
                            <div className="w-full">
                                <Select
                                    isMulti
                                    options={usersOptions}
                                    onChange={(options) =>
                                        setAssignedMembers(options)}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={createTask}
                            type="submit"
                            size="sm"
                            className="mt-5">
                            <Plus className="w-8 h-5" />
                            <span>Adicionar tarefa</span>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
}
