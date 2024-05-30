"use client"

import { UserButton } from "@clerk/nextjs"

export const Navbar= ()=>{
    return (
        <div className="flex items-center p-5 gap-x-4 bg-black text-white">
            <div className="hidden lg:flex lg:flex-1">
                {/* add serach */}
            </div>
            <UserButton/>
        </div>
    )
}