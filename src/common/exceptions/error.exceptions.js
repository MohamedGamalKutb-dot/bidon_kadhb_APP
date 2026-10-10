export const ApplicationExeption=({
    message="error",
    options={
       cause: {status:400}
    }
})=>{
   throw new Error(message,options)
}

export const ConflictExeception=(message="conflict" ,issues=undefined)=>{
    return ApplicationExeption({
        message,
        options:{
            cause:{status: 409, issues}
        }
    })

}

export const NotfoundExeception=(message="Notfound" ,issues=undefined)=>{
    return ApplicationExeption({
        message,
        options:{
            cause:{status: 404, issues}
        }
    })

}

export const BadExeception=(message="Bad request Exeception" ,issues=undefined)=>{
    return ApplicationExeption({
        message,
        options:{
            cause:{status: 400, issues}
        }
    })

}
export const UnauthorizedExeception=(message="Unauthorized" ,issues=undefined)=>{
    return ApplicationExeption({
        message,
        options:{
            cause:{status: 401, issues}
        }
    })

}
export const ForbiddenExeception=(message="Forbidden" ,issues=undefined)=>{
    return ApplicationExeption({
        message,
        options:{
            cause:{status: 403, issues}
        }
    })

}