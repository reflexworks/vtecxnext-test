'use client'

export const Header = ({title} : {title:string}) => {
  let text = title ? title : 'Default title'
  if (process.env.NEXT_PUBLIC_STAGE) {
    text += ` (${process.env.NEXT_PUBLIC_STAGE})`
  }
  return <h1>{text}</h1>
}
