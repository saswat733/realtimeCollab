import { Button } from "@/components/ui/button";
import Image from "next/image";


export const EmptyFavorites=()=>{

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <Image src="/search.svg" alt="Empty" height={200} width={200}/>
            <h2 className="text-2xl font-semibold mt-6"> No favorite boards! </h2>
            <p className="text-muted-foreground text-sm mt-2">
                Try favoring a board to see it here
            </p>
           
        </div>
    )
}