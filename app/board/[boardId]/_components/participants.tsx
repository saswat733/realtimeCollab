"use client";

import { Skeleton } from "@/components/ui/skeleton"
import { UserAvatar } from "./user-avatar";
import { useOthers,useSelf } from "@/liveblocks.config";
import { connectionIdToColor } from "@/lib/utils";

const MAX_PARTICIPANTS=3;
export const Participants=()=>{

    const users=useOthers();
    const currentuser=useSelf();

    const hasMoreUsers=users.length>MAX_PARTICIPANTS;

    return (
        <div className="absolute h-12 top-2 right-2 items-center rounded p-3 flex shadow-md">
            <div className="flex gap-x-2">
                {users.slice(0,MAX_PARTICIPANTS).map(({connectionId,info})=>{
                    return (
                        <UserAvatar borderColor={connectionIdToColor(currentuser.connectionId)} key={connectionId} src={info?.picture} name={info?.name} fallback={info?.name?.[0] || "T"}>

                        </UserAvatar>
                    )
                })}

                {currentuser && (
                    <UserAvatar src={currentuser?.info?.picture} name={`${currentuser.info?.name}(You)`} fallback={currentuser.info?.name?.[0]}/>
                )}

                {hasMoreUsers && (
                    <UserAvatar name={`${users.length-MAX_PARTICIPANTS} more`} fallback={`+${users.length-MAX_PARTICIPANTS}`}/>
                )}
            </div>
        </div>
    )
}

export const ParticipantsSkeleton=()=>{
    return (
        <div className="absolute h-12 top-2 right-2 items-center rounded p-3 flex shadow-md w-[100px]">

        </div>
    )
}