
"use client";
import { useStorage } from "@/liveblocks.config";
import { LayerType } from "@/types/canvas";
import { memo } from "react";
import { Rectangle } from "./reactangle";
interface LayerPreviewProps{
    id:string,
    onLayerPointerDown:(e:React.PointerEvent,layerId:string)=>void;
    selectionColor?:string;
}
export const LayerPreview=memo(({id,onLayerPointerDown,selectionColor}:LayerPreviewProps)=>{
    
    const layer=useStorage((root)=>root.layers.get(id));

    if(!layer){
        return null;
    }

    
    switch (layer.type){
        case LayerType.Rectangle:
            return (
                <div>
                    <Rectangle
                    id={id}
                    layer={layer}
                    onPointerDown={onLayerPointerDown}
                    selectionColor={selectionColor}
                    />
                </div>
            )
    }
});

LayerPreview.displayName="LayerPreview"