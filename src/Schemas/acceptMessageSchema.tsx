//  We are creating another folder for schema because we are using ZOD LIBRARY , 
//  as this lib is used only for validation , while the model folder is used for for database Schema 

import {z} from "zod"

export const AcceptMessagesSchema = z.object({
    acceptMessages : z.boolean(),
    
})