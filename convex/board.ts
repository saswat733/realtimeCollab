import {v} from 'convex/values';
import {mutation} from './_generated/server';

const Images=[
    
]


export const create = mutation({
    args:{
        orgId: v.string(),
        title: v.string(),
    },
    handler: async (ctx,args)=>{
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            throw new Error("Unauthenticated");
        }
    }
})