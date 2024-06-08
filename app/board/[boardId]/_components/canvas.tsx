"use client"

import { Info } from "./info"
import { Participants } from "./participants"
import { ToolBar } from "./toolbar"


interface CanvasProps{
    boardId:string
}
export const Canvas=({boardId,}:CanvasProps)=>{
    return (
        <div className="h-full w-full bg-neutral-100 touch-none">
            <Info/>
            <Participants/>
            <ToolBar/>
        </div>
    )
}

export default Canvas