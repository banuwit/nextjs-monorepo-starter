import assert from "node:assert/strict";
import test from "node:test";

import { transactionsCsv } from "./finance-export.ts";

test("transaction export quotes fields and retains signed amounts", () => {
  assert.equal(
    transactionsCsv([
      {
        name: 'Shop, "North"',
        date: "October 20, 2026",
        type: "Expense",
        amount: -86.5,
      },
    ]),
    '"Name","Date","Type","Amount (USD)"\r\n"Shop, ""North""","October 20, 2026","Expense","-86.50"\r\n',
  );
});
