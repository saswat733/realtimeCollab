"use client"

import { useCallback, useState } from "react"
import { Info } from "./info"
import { Participants } from "./participants"
import { ToolBar } from "./toolbar"
import {CanvasState,CanvasMode, Camera} from '@/types/canvas'
import { useCanRedo, useCanUndo, useHistory,useMutation } from "@/liveblocks.config"
import { CursorPresence } from "./cursor-presence"
import { pointerEventToCanvasPoint } from "@/lib/utils"

interface CanvasProps{
    boardId:string
}
export const Canvas=({boardId,}:CanvasProps)=>{
    const [canvasState, setcanvasState] = useState<CanvasState>({
        mode:CanvasMode.None,
    })

    const [camera,setCamera]=useState<Camera>({x:0,y:0});
    const history=useHistory()
    const canUndo=useCanUndo()
    const canRedo=useCanRedo()

    const onWheel=useCallback((e:React.WheelEvent)=>{
       console.log({
        x:e.deltaX,
        y:e.deltaY,
       })
        setCamera((camera)=>({
            x: camera.x-e.deltaX,
            y:camera.y-e.deltaY,
        }))
    },[])

    const onPointerMove= useMutation(({setMyPresence},
        e:React.PointerEvent)=>{
        e.preventDefault();

        const current = pointerEventToCanvasPoint(e,camera);
        console.log(current)
        setMyPresence({cursor:current})
    },[]);
    return (
        <div className="h-full w-full bg-neutral-100 touch-none">
            <Info boardId={boardId}/>
            <Participants/>
            <ToolBar canvasState={canvasState} setCanvasState={setcanvasState} canRedo={canRedo} canUndo={canUndo} undo={history.undo} redo={history.redo}/>
            <svg className='h-[100vh] w-[100vw]' onWheel={onWheel} onPointerMove={onPointerMove}>
                <g>
                    <CursorPresence/>
                </g>
            </svg>
        </div>
    )
}

export default Canvas