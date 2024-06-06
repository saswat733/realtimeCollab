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

export const RenameModal=()=>{
    const {
        isOpen,
        onClose,
        initialValues
    }=userRenameModal();

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
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}

