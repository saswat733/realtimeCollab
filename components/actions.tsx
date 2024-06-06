"use client"

import { DropdownMenuArrowProps, DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Link2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { ConfirmModal } from "./confirm-modal";
import { Button } from "@/components/ui/button";


interface ActionsProps{
    children:React.ReactNode;
    side?:DropdownMenuContentProps["side"];
    sideOffset?:DropdownMenuContentProps["sideOffset"];
    id:string;
    title:string;
}

export const Actions=({
    children,
    side,
    sideOffset,
    id,
    title
}:ActionsProps)=>{

    const {mutate ,pending} = useApiMutation(api.board.remove)
   
    const onCopyLink=()=>{
        navigator.clipboard.writeText(`https://collabtimely.com/board/${id}`)
        .then(()=>toast.success('Link copied to clipboard'))
        .catch(()=>toast.error('Failed to copy link'))
    }
   
    const onDelete = ()=>{
        mutate({id})
        .then(()=>toast.success('Board deleted'))
        .catch(()=>toast.error('Failed to delete board'))
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent side={side} onClick={(e)=>e.stopPropagation()} sideOffset={sideOffset} className="w-60">
                <DropdownMenuItem className="p-3 cursor-pointer " onClick={onCopyLink}>
                    <Link2 className="h-4 w-4 mr-2"/>
                    Copy board Link
                </DropdownMenuItem>
                <ConfirmModal 
                header={"Delete Board"}
                description="This will delete the board and all of its contents."
                disabled={pending}
                onConfirm={onDelete}
                >
                <Button variant={"ghost"} className="p-3 cursor-pointer text-sm w-full justify-start font-normal" >
                    <Trash2 className="h-4 w-4 mr-2"/>
                    Delete
                </Button>
                </ConfirmModal>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}