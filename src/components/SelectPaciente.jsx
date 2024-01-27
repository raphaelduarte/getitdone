import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/shadcn/components/ui/select"

export default function SelectPaciente({ userDoc }) {

    console.log(userDoc)

    return (
        <Select>
            <SelectTrigger className="w-1/6">
                <SelectValue placeholder="Selecione um paciente" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Pacientes</SelectLabel>
                    <SelectItem value="cintya">Cintya</SelectItem>
                    <SelectItem value="gabriella">Gabriella</SelectItem>
                    <SelectItem value="marinete">Marinete</SelectItem>
                    <SelectItem value="paulo">Paulo</SelectItem>
                    <SelectItem value="bruno">Bruno</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

