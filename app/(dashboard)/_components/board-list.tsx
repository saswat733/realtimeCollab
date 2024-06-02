"use client"

import { EmptyBoards } from "./empty-boards";
import { EmptyFavorites } from "./empty-favorites";
import { EmptySearch } from "./empty-serach";

interface BoardListProps{
    orgId:string;
    query:{
        search?:string;
        favorites?:string;
    }
}

export const BoardList=({orgId,query}:BoardListProps)=>{

    const data=[]       //todo: fetch data from server
    
    if(!data?.length  && query.search){
        return (
            <div>
               <EmptySearch/>
            </div>
        )
    }

    if(!data?.length && query.favorites){
        return (
            <div>
                <EmptyFavorites/>
            </div>
        )
    }

    if(!data?.length){
        return (
            <div>
                <EmptyBoards/>
            </div>
        )
    }

    return (
        <div>
            {JSON.stringify(query)}
        </div>
    )
}