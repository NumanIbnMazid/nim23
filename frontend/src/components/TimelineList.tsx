import { ReactNode } from 'react'


type TimelineComponentProps = {
  children: ReactNode
}


export function TimelineList({ children }: TimelineComponentProps) {
  return <div>{children}</div>
}
