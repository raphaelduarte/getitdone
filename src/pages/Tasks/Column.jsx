import { Button } from "@/shadcn/components/ui/button";
import Task from "./Task";
import { Droppable } from "react-beautiful-dnd";
import { PlusIcon } from "@radix-ui/react-icons";
import NewTaskDialog from "./NewTaskDialog";
import { useState } from "react";
import { set } from "date-fns";
import { useUserStore } from "@/stores/user";

export default function Column({ column, tasks, showNewTaskDialog, setShowNewTaskDialog }) {

    const { setSelectedColumnStore } = useUserStore()

    const getColumnName = (id) => {
        switch (id) {
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

    return (
        <div className="sm:w-1/4 flex flex-col fake-container bg-secondary/50 border border-border rounded-xl">
            <h3 className="p-5">{column.title}</h3>
            <Droppable droppableId={column.id}>
                {(provided) => (
                    <div
                        className="tasklist p-5 flex-grow justify-between flex flex-col"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {tasks.length ? 
                            console.log("Deu bom, as tarefas existem") 
                            :console.log("não tem tarefas")}

                        {tasks.length ? (
                            tasks.map((task, index) => (
                                <Task 
                                    columnId={column.id}
                                    key={task?.id} 
                                    task={task} 
                                    index={index} 
                                />
                            ))
                        ) : (
                            <p className="text-center text-muted-foreground">
                                Não há tarefas nessa coluna.
                            </p>
                        )}
                        {provided.placeholder}

                        <NewTaskDialog 
                        open={showNewTaskDialog} 
                        setOpen={setShowNewTaskDialog}
                        >
                            <Button
                                className="w-full shadow-sm"
                                variant="outline"
                                onClick={() => {
                                    setShowNewTaskDialog(true)
                                    setSelectedColumnStore(getColumnName(column.id))
                                }}
                            >
                                <PlusIcon className="w-5 h-5 mr-2" />
                                Adicionar tarefa
                            </Button>
                        </NewTaskDialog>
                    </div>
                )}
            </Droppable>
            
        </div>
    );
}