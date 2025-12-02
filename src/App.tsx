import { useCallback, useSyncExternalStore } from "react"
import { createBuilder } from "./core"
import { Button } from "./components/ui/button"
import { components } from "./fields"

const builder = createBuilder({
  components
})

export default function App() {
  const state = useSyncExternalStore(
    builder.subscribe,
    useCallback(() => builder.getState(), []),
    useCallback(() => builder.getState(), [])
  )

  console.log(state)
  return (
    <div>
      <h1>Schema</h1>
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <Button onClick={() => builder.insert({
        type: "Title",
        index: 0
      })}>add node</Button>
    </div>
  )
}
