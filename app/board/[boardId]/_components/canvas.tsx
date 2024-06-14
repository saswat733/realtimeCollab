"use client"

import React, { useCallback, useMemo, useState } from "react"
import { Info } from "./info"
import { Participants } from "./participants"
import { ToolBar } from "./toolbar"
import {CanvasState,CanvasMode, Camera, Color, LayerType, Point,Side,XYWH} from '@/types/canvas'
import { useCanRedo, useCanUndo, useHistory,useMutation, useOthersMapped, useStorage } from "@/liveblocks.config"
import { CursorPresence } from "./cursor-presence"
import { connectionIdToColor, pointerEventToCanvasPoint, resizeBounds } from "@/lib/utils"
import {nanoid} from 'nanoid'
import { LiveObject } from "@liveblocks/client"
import { LayerPreview } from "./layer-preview"
import { SelectionBox } from "./selection-box"
import { SelectionTools } from "./selection-tools"


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
        g:255,
        b:255,
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

    const translateSelectedLayers = useMutation(
        ({ storage, self }, point: Point) => {
          if (canvasState.mode !== CanvasMode.Translating) {
            return
          }
    
          const offset = {
            x: point.x - canvasState.current.x,
            y: point.y - canvasState.current.y,
          }
    
          const liveLayers = storage.get('layers')
    
          for (const id of self.presence.selection) {
            const layer = liveLayers.get(id)
    
            if (layer) {
              layer.update({
                x: layer.get('x') + offset.x,
                y: layer.get('y') + offset.y,
              })
            }
          }
    
          setcanvasState({ mode: CanvasMode.Translating, current: point })
        },
        [canvasState]
      )

      const unSelectLayers=useMutation(({self,setMyPresence})=>{
        if(self.presence.selection.length>0){
            setMyPresence({selection:[]},{addToHistory:true})
        }
      },[])

    const resizeSelectedLayer=useMutation((
{storage,self},
        point:Point,
    )=>{
        if(canvasState.mode!=CanvasMode.Resizing){
            return;
        }

        const bounds=resizeBounds(canvasState.initialBounds,canvasState.corner,point);

        const liveLayers=storage.get("layers");
        const layer=liveLayers.get(self.presence.selection[0]);

        if(layer){
            layer.update(bounds);
        }

    },[canvasState])

    const onResizeHandlePointerDown=useCallback((
        corner:Side,
        initialBounds: XYWH,)=>{
        history.pause();
        setcanvasState({
            mode:CanvasMode.Resizing,
            corner,
            initialBounds,
        })
    },[])

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
       
        if(canvasState.mode===CanvasMode.Translating){
            translateSelectedLayers(current)
        }
        else if(canvasState.mode===CanvasMode.Resizing){
           resizeSelectedLayer(current);
        }

        setMyPresence({cursor:current})
    },[canvasState,resizeSelectedLayer,camera,translateSelectedLayers]);

    const onPointerLeave=useMutation(({setMyPresence})=>{
        setMyPresence({cursor:null})
    },[])

    const onPointerDown=useCallback((e:React.PointerEvent)=>{
        const point=pointerEventToCanvasPoint(e,camera);

        if(canvasState.mode===CanvasMode.None){
        }
        setcanvasState({
            origin:point,
            mode:CanvasMode.Pressing,
        })
    

    },[camera,canvasState.mode,setcanvasState])

    const onPointerUp= useMutation((
        {},
        e
    )=>{
        const point = pointerEventToCanvasPoint(e,camera);
       
        // console.log({
        //     point,
        //     mode:canvasState.mode,
        // })

        if(canvasState.mode === CanvasMode.None || canvasState.mode === CanvasMode.Pressing){
           unSelectLayers()
            setcanvasState({
                mode:CanvasMode.None,
            })

        }

        if(canvasState.mode=== CanvasMode.Inserting){
            insertLayer(canvasState.layerType,point);

        }else{
            setcanvasState({
                mode:CanvasMode.None,
            })
        }
        history.resume();
    },[unSelectLayers,camera,canvasState,history,insertLayer])

    const selections = useOthersMapped(other => other.presence.selection)
  
    const onLayerPointerDown = useMutation(
        ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
          if (
            canvasState.mode === CanvasMode.Pencil ||
            canvasState.mode === CanvasMode.Inserting
          ) {
            return
          }
    
          history.pause()
          e.stopPropagation()
          console.log("clicked")
          const point = pointerEventToCanvasPoint(e, camera)
    
          if (!self.presence.selection.includes(layerId)) {
            setMyPresence({ selection: [layerId] }, { addToHistory: true })
          }
          setcanvasState({ mode: CanvasMode.Translating, current: point })
        },
        [setcanvasState, camera, history, canvasState.mode]
      )


 const layerIdsToColorSelection = useMemo(() => {
        const layerIdsToColorSelection: Record<string, string> = {}
    
        for (const user of selections) {
          const [connectionId, selection] = user
    
          for (const layerId of selection) {
            layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId)
          }
        }
    
        return layerIdsToColorSelection
      }, [selections])


    return (
        <div className="h-full w-full bg-neutral-100 touch-none">
            <Info boardId={boardId}/>
            <Participants/>
            <ToolBar canvasState={canvasState} setCanvasState={setcanvasState} canRedo={canRedo} canUndo={canUndo} undo={history.undo} redo={history.redo}/>
          <SelectionTools camera={camera} setLastUsedColor={setlastUsedColor}/>
            <svg onPointerUp={onPointerUp} onPointerDown={onPointerDown} className='h-[100vh] w-[100vw]' onWheel={onWheel} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
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
                   <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown}/>
                    <CursorPresence/>
                </g>
            </svg>
        </div>
    )
}

export default Canvas