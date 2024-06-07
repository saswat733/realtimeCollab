"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogClose,
    DialogFooter,
    DialogTitle
} from "@/components/ui/dialog"
import { userRenameModal } from "@/store/use-rename-modal"
import { FormEvent, FormEventHandler, useEffect, useState } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useApiMutation } from "@/hooks/use-api-mutation"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"

export const RenameModal=()=>{
    const {
        isOpen,
        onClose,
        initialValues
    }=userRenameModal();

    const [title,setTitle]=useState(initialValues.title)
   
    useEffect(() => {
        setTitle(initialValues.title)

    }, [initialValues.title]);
    
    const {mutate,pending}=useApiMutation(api.board.update)
   
    const onSubmit:FormEventHandler<HTMLFormElement>=(e,)=>{
        e.preventDefault();
        mutate({id:initialValues.id,title})
        .then(()=>{
            toast.success('Board title updated')
            onClose();
        }).catch(()=>{
            toast.error('Failed to update board title')
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Edit Board title
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Enter a new title for this board
                    <form onSubmit={onSubmit} className="space-y-4">
                        <Input value={title} placeholder="Board Title" onChange={(e)=>setTitle(e.target.value)} disabled={pending} required maxLength={60}/>
                        <DialogFooter>
                            <DialogClose>
                                <Button type="button" variant={"outline"}>
                                Cancel
                                </Button>
                            </DialogClose>
                            <Button disabled={pending} type="submit">
                                    Save
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}

