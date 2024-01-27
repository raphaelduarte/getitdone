import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shadcn/components/ui/dropdown-menu"
import LabelSvg from "@/components/Label";
import { useUsersContext } from "@/hooks/useUsersContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/components/ui/avatar"
import { Badge } from "@/shadcn/components/ui/badge";
import getInitials from "@/utils/getInitials";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Draggable } from "react-beautiful-dnd";
import calculateDaysUntilDue from "@/utils/daysUntilDue";
import { useFirestore } from "@/hooks/useFirestore";
import { useUserStore } from "@/stores/user";
import { arrayRemove, arrayUnion } from "firebase/firestore";


export default function Task({ task, index, columnId }) {

    const { users } = useUsersContext()

    const { userDocStore } = useUserStore()

    const { updateDocument: updateTeam } = useFirestore("teams")

    const { deleteSubDocument: deleteTask } = useFirestore("teams")

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "low":
                return "#f7d372";
            case "medium":
                return "orange";
            case "high":
                return "#ff0000";
            case "standby":
                return "#5abb54";
            default:
                return "gray";
        }
    }

    const verboSingularOrPlural = { 1: 'Falta', default: 'Faltam' };
    const daysUntilDue = calculateDaysUntilDue(task?.dueDate?.seconds);
    const daysString = { 1: 'dia', default: 'dias' }[daysUntilDue] || 'dias';

    const singularOrPlural = () => verboSingularOrPlural[daysUntilDue] || verboSingularOrPlural.default;

    const removeTask = async (taskId) => {
        await deleteTask(userDocStore.teamId, "tasks", taskId)
        await updateTeam(userDocStore.teamId, {
            [columnId]: arrayRemove(taskId),
        })
    }

    if(!task) return null

    const assignedMembers = users?.filter((u) => task.assignedMembers.includes(u.id))

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    className={`mb-2 border border-border p-5 rounded-lg bg-background 
                    ${snapshot.isDragging && "drop-shadow-md bg-secondary/50"
                    }`}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    <div className="flex items-center justify-between ">
                        <h3 className="font-semibold">{task.title}</h3>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <DotsHorizontalIcon className="w-5 h-5" role="button" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Editar</DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={() => removeTask(task.id)}
                                >
                                    Excluir
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex mt-2.5 flex-wrap gap-1">
                        {task.tags.map((tag) => (
                            <Badge className="bg-muted-foreground font-light rounded-md"
                                key={tag}>
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    <div className="flex mt-5 items-center justify-between">
                        <div className="flex">
                            {assignedMembers.map((member) => (
                                <div
                                    className="-ml-2.5 bg-primary/50 rounded-full w-8 h-8 flex justify-center items-center"
                                    key={member.id}
                                >
                                    {member.photoURL ?
                                        <img src={member.photoURL} alt={member.name} />
                                        :
                                        <span className="text-sm">
                                            {getInitials(member.name)}
                                        </span>
                                    }
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <LabelSvg color={getPriorityColor(task.priority.value)} />
                            <p className="text-muted-foreground text-sm">
                                {singularOrPlural()} {daysUntilDue} {daysString}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
}