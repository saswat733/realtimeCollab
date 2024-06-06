"use client"

import { Overlay } from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { OverLay } from "./overlay";
import {formatDistanceToNow} from 'date-fns'
import { useAuth } from "@clerk/nextjs";
import { Footer } from "./footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Actions } from "../../../../components/actions";
import { MoreHorizontal } from "lucide-react";


interface BoardCardProps{
    id:string;
    title:string;
    authorName:string;
    authorId:string;
    createdAt:number;
    imageUrl:string;
    orgId:string;
    isFavorite:boolean;
}


export const BoardCard=({id,title,authorId,authorName,createdAt,imageUrl,orgId,isFavorite}:BoardCardProps)=>{
    const {userId} = useAuth()
    
    const authorLabel = userId === authorId ? "You" : authorName;
    const createdAtLabel = formatDistanceToNow(createdAt,{addSuffix:true});

    return (
       <Link href={`/board/${id}`}>
            <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden">
                <div className="relative flex-1 bg-amer-50">
                    <Image src={imageUrl} alt={title} fill className="object-fit" />
                    <OverLay />
                    <Actions
                    title={title}
                    side={'right'}
                    id={id}
                    >
                        <button className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-2 outline-none">
                           <MoreHorizontal className="text-white opacity-75 hover:opacity-100 transition-opacity"/>
                        </button>
                    </Actions>
                </div>
                <Footer title={title} authorLabel={authorLabel} createdAtLabel={createdAtLabel} isFavorite={isFavorite} onClick={()=>{}} disabled={false}></Footer>
            </div>
       </Link>
    )
}



BoardCard.Skeleton= function BoardCardSkeleton(){
    return (
        <div className="aspect-[100/127] rounded-lg overflow-hidden">
            <Skeleton className="h-full w-full" />
        </div>
    )
}

