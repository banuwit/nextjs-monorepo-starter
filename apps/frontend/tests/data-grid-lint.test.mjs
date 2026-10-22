import assert from "node:assert/strict"
import { fileURLToPath } from "node:url"
import test from "node:test"

import { ESLint } from "eslint"

test("frontend lint checks TSX React hooks instead of ignoring the file", async () => {
  const frontendDir = fileURLToPath(new URL("..", import.meta.url))
  const eslint = new ESLint({ cwd: frontendDir })
  const [result] = await eslint.lintText(
    'import { useState } from "react"; export function Bad() { if (true) useState(0); return <div /> }',
    { filePath: "src/components/data-grid/lint-probe.tsx" },
  )

  assert.ok(
    result.messages.some(
      (message) => message.ruleId === "react-hooks/rules-of-hooks",
    ),
  )
})
