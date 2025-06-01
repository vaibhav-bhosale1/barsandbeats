import React from 'react'

export default function ({
    params:{
        creatorId
    }
}:{
    params:{
        creatorId:string
    }
}){
  return (
    <div>{creatorId}</div>
  )
}

