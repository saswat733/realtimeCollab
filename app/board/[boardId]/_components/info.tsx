"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Hint } from "@/components/hint";
import { userRenameModal } from "@/store/use-rename-modal";
import { Actions } from "@/components/actions";
import { MenuIcon } from "lucide-react";
interface InfoProps{
    boardId:string;
}

const font=Poppins({
    subsets:["latin"],
    weight:['600'],
})


const TabSeparator=()=>{
    return (
        <div className="text-neutral-300 px-1.5">
            |
        </div>
    )
}

export const Info=({boardId,}:InfoProps)=>{
    const {onOpen} = userRenameModal()
    const data=useQuery(api.board.get,{
        id:boardId as Id<"boards">
    })

    if(!data){
        return <InfoSkeleton/>
    }
    return (
        <div className="absolute top-2 flex left-2 bg-white rounded-md px-1.5 h-12 items-center shadow-md">
           <Hint label="Go to boards" side="bottom" sideOffset={10}>
           <Button variant={"board"} className="px-2 flex">
              <Link href={'/'} className="flex">
              <Image
                src={"/logo.svg"}
                alt="logo"
                height={40}
                width={40}
                />
                <span className={cn("font-semibold text-xl ml-2 text-black",font.className)}>
                    Board
                </span>
              </Link>
            </Button>
           </Hint>
           <TabSeparator/>
          <Hint label="Edit title" side="bottom" sideOffset={10}>
          <Button onClick={() => onOpen(data?._id,data?.title)} variant={"board"} className="text-base font-normal px-2">
            {data.title}
           </Button>
          </Hint>
          <TabSeparator/>
          <Actions id={data._id} title={data.title} side="bottom" children={''} sideOffset={10}/>
          <div>
            <Hint label="Main Menu" side="bottom" sideOffset={10}>
                <Button size={"icon"} variant={"board"}>
                    <MenuIcon/>
                </Button>

            </Hint>
          </div>
        </div>
    )
}



export const InfoSkeleton=()=>{
    return (
        <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md w-[300px]">

        </div>
    )
}