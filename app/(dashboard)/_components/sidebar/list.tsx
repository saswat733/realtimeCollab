"use client"
import { useOrganizationList } from "@clerk/nextjs";
import { Item } from "./item";

export const List = () => {
    const { userMemberships } = useOrganizationList({
        userMemberships:{
            infinite:true,
        },
    });

  if(!userMemberships.data?.length) return null;

    return (
      <>
      <ul>
        {userMemberships.data?.map((mem)=>(
            <Item
            key={mem.organization.id}
            name={mem.organization.name}
            id={mem.organization.id}
            imageUrl={mem.organization.imageUrl}
            />
        ))}
      </ul>
      </>
    );
};
