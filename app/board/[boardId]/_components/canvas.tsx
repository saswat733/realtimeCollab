"use client"

import React, { useCallback, useMemo, useState } from "react"
import { Info } from "./info"
import { Participants } from "./participants"
import { ToolBar } from "./toolbar"
import {CanvasState,CanvasMode, Camera, Color, LayerType, Point} from '@/types/canvas'
import { useCanRedo, useCanUndo, useHistory,useMutation, useOthersMapped, useStorage } from "@/liveblocks.config"
import { CursorPresence } from "./cursor-presence"
import { connectionIdToColor, pointerEventToCanvasPoint } from "@/lib/utils"
import {nanoid} from 'nanoid'
import { LiveObject } from "@liveblocks/client"
import { LayerPreview } from "./layer-preview"

const MAX_LAYERS=100;

interface CanvasProps{
    boardId:string
}

export const Canvas=({boardId,}:CanvasProps)=>{
    
    const layersId=useStorage((root)=>root.layerIds);
    
    const [canvasState, setcanvasState] = useState<CanvasState>({
        mode:CanvasMode.None,
    })

    const [camera,setCamera]=useState<Camera>({x:0,y:0});

    const [lastUsedColor, setlastUsedColor] = useState<Color>({
        r:255,
        g:0,
        b:0,
    })

    const history=useHistory()
    const canUndo=useCanUndo()
    const canRedo=useCanRedo()

    const insertLayer=useMutation(({storage,setMyPresence},LayerType:LayerType.Ellipse | LayerType.Rectangle | LayerType.Text | LayerType.Note, position:Point,)=>{
        const liveLayers=storage.get("layers");
        if(liveLayers.size>=MAX_LAYERS){
            return;
        }

        const liveLayersId = storage.get("layerIds")
        const layerId=nanoid();
        const layer=new LiveObject({
            type:LayerType,
            x:position.x,
            y:position.y,
            height:100,
            width:100,
            fill:lastUsedColor,
        })
        liveLayersId.push(layerId)
        liveLayers.set(layerId,layer);

        setMyPresence({selection:[layerId]},{addToHistory:true})
        setcanvasState({mode:CanvasMode.None});

    },[lastUsedColor])

    const onWheel=useCallback((e:React.WheelEvent)=>{
    //    console.log({
    //     x:e.deltaX,
    //     y:e.deltaY,
    //    })
        setCamera((camera)=>({
            x: camera.x-e.deltaX,
            y:camera.y-e.deltaY,
        }))
    },[])

    const onPointerMove= useMutation(({setMyPresence},
        e:React.PointerEvent)=>{
        e.preventDefault();

        const current = pointerEventToCanvasPoint(e,camera);
        // console.log(current)
        setMyPresence({cursor:current})
    },[]);

    const onPointerLeave=useMutation(({setMyPresence})=>{
        setMyPresence({cursor:null})
    },[])


    const onPointerUp= useMutation((
        {},
        e
    )=>{
        const point = pointerEventToCanvasPoint(e,camera);
       
        // console.log({
        //     point,
        //     mode:canvasState.mode,
        // })

        if(canvasState.mode=== CanvasMode.Inserting){
            insertLayer(canvasState.layerType,point);

        }else{
            setcanvasState({
                mode:CanvasMode.None,
            })
        }
        history.resume();
    },[camera,canvasState,history,insertLayer])

    const selections = useOthersMapped((other)=>other.presence.selection);

    const onLayerPointerDown = useMutation(
        ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
          if (
            canvasState.mode === CanvasMode.Pencil ||
            canvasState.mode === CanvasMode.Inserting
          ) {
            return
          }
          console.log("onLayerPointerDown")
    
          history.pause()
          e.stopPropagation()
    
          const point = pointerEventToCanvasPoint(e, camera)
          console.log({ point })
          if (!self.presence.selection.includes(layerId)) {
            setMyPresence({ selection: [layerId] }, { addToHistory: true })
          }
          setcanvasState({ mode: CanvasMode.Translating, current: point })
        },
        [setcanvasState, camera, history, canvasState.mode]
      )

    const layerIdsToColorSelection=useMemo(()=>{
        const layerIdsToColorSelection: Record<string,string> = {};

        for(const user of selections){

            const [connectionId,selection]=user;
            for(const layerId of selection){
                layerIdsToColorSelection[layerId]= connectionIdToColor(connectionId)
            }

        }
        return layerIdsToColorSelection;
    },[selections])

    return (
        <div className="h-full w-full bg-neutral-100 touch-none">
            <Info boardId={boardId}/>
            <Participants/>
            <ToolBar canvasState={canvasState} setCanvasState={setcanvasState} canRedo={canRedo} canUndo={canUndo} undo={history.undo} redo={history.redo}/>
            <svg onPointerUp={onPointerUp} className='h-[100vh] w-[100vw]' onWheel={onWheel} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
                <g style={{transform:`translate(${camera.x}px,${camera.y}px)`}}>
                   {
                    layersId.map((ele)=>(
                        <LayerPreview
                            key={ele}
                            id={ele}
                            onLayerPointerDown={onLayerPointerDown}
                            selectionColor={layerIdsToColorSelection[ele]}

                        />
                    ))

                   
                   }
                    <CursorPresence/>
                </g>
            </svg>
        </div>
    )
}

export default Canvas