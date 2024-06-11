
import {  Loader } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { InfoSkeleton } from "./info"
import {  ParticipantsSkeleton } from "./participants"
import { ToolbarSkeleton } from "./toolbar"




export const Loading=()=>{

    return (
        <main className="h-screen w-full relative bg-neutral-100 touch-none flex items-center justify-center">
            <Loader className="h-6 w-6 text-muted-foreground animate-spin"/>
            <InfoSkeleton/>
            <ParticipantsSkeleton/>
            <ToolbarSkeleton/>
        </main>
    )
}