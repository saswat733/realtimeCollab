"use client";


import { BoardList } from "./_components/board-list";
import { EmptyOrg } from "./_components/empty-org";
import { useOrganization } from "@clerk/nextjs";

interface DashBoardProps{
  searchParams:{
    search?:string;
    favorites?:string;
  };
};



export default function DashBoard({searchParams}:DashBoardProps) {
  const {organization}=useOrganization();

  return (
      <div className="flex-1 h-[clac(100%-80px)] p-6">
        {/* {JSON.stringify(searchParams)} */}
        {
          !organization?( <EmptyOrg/>):(
            <BoardList
              orgId={organization.id}
              query={searchParams}
            />
          )
        }
       
      </div>
  );
  
}



