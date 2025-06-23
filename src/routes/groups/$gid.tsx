import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/groups/$gid')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/groups/$gid"!</div>
}
