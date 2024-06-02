import { Button } from "@/components/ui/button";
import Image from "next/image";


export const EmptyBoards=()=>{

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <Image src="/notes.svg" alt="Empty" height={200} width={200}/>
            <h2 className="text-2xl font-semibold mt-6"> Create your first board! </h2>
            <p className="text-muted-foreground text-sm mt-2">
                Start by creating first board for your organization
            </p>
            <div className="mt-6">
                <Button size={'lg'}>
                    Create Board
                </Button>

            </div>
        </div>
    )
}