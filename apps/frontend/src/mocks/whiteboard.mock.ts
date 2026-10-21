import type { ExcalidrawElementSkeleton } from "@excalidraw/excalidraw/data/transform";

// Independently recreated from the public ReUI whiteboard-1 preview.
export const whiteboardTitle = "Checkout Review";
export const boardTemplates = [
  {
    id: "review",
    name: "Design review",
    description: "Goals, user flow, questions and decisions",
  },
  {
    id: "retro",
    name: "Team retrospective",
    description: "What went well, what to improve, next steps",
  },
  {
    id: "blank",
    name: "Blank canvas",
    description: "A fresh space for your next idea",
  },
] as const;

export function createBoardTemplate(
  template = "review",
): ExcalidrawElementSkeleton[] {
  if (template === "blank") return [];
  const elements: ExcalidrawElementSkeleton[] = [];
  const yellow = "#fff3bf",
    blue = "#d0ebff",
    green = "#d3f9d8",
    purple = "#e5dbff",
    red = "#ffe3e3";
  function frame(
    id: string,
    name: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    elements.push({
      id,
      type: "frame",
      name,
      x,
      y,
      width,
      height,
      children: [],
    });
  }
  function text(
    id: string,
    frameId: string,
    value: string,
    x: number,
    y: number,
    fontSize = 20,
  ) {
    elements.push({
      id,
      type: "text",
      frameId,
      text: value,
      x,
      y,
      fontSize,
      fontFamily: 1,
      strokeColor: "#343a40",
    });
  }
  function box(
    id: string,
    frameId: string,
    x: number,
    y: number,
    width: number,
    height: number,
    backgroundColor = "transparent",
  ) {
    elements.push({
      id,
      type: "rectangle",
      frameId,
      x,
      y,
      width,
      height,
      backgroundColor,
      fillStyle: "solid",
      strokeColor:
        backgroundColor === "transparent" ? "#495057" : backgroundColor,
      strokeWidth: 1,
      roughness: 1,
      roundness: { type: 3 },
    });
  }
  function note(
    id: string,
    frameId: string,
    value: string,
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
  ) {
    box(id, frameId, x, y, width, height, color);
    text(`${id}-label`, frameId, value, x + 16, y + 14);
  }
  function arrow(id: string, x: number, y: number, points: [number, number][]) {
    elements.push({
      id,
      type: "arrow",
      frameId: "flow",
      x,
      y,
      points,
      strokeColor: "#495057",
      endArrowhead: "arrow",
    });
  }
  if (template === "retro") {
    ["What went well", "What to improve", "Next steps"].forEach((name, i) => {
      frame(`retro-${i}`, name, i * 380, 0, 340, 420);
      note(
        `note-${i}`,
        `retro-${i}`,
        "Double-click to add\nyour thoughts",
        i * 380 + 20,
        30,
        300,
        130,
        [green, yellow, blue][i]!,
      );
    });
    return elements;
  }
  frame("goals", "Goals", 0, 0, 320, 340);
  note(
    "goal-1",
    "goals",
    "Mobile: 38% quit\nat the payment step",
    40,
    40,
    240,
    76,
    yellow,
  );
  note(
    "goal-2",
    "goals",
    "Goal: 30% payment\ndrop off by Q4",
    40,
    134,
    240,
    76,
    green,
  );
  note(
    "goal-3",
    "goals",
    "No new PCI scope.\nMetric owner: Priya",
    40,
    228,
    240,
    76,
    blue,
  );
  frame("flow", "User Flow", 410, 0, 1080, 400);
  for (const [id, label, x] of [
    ["cart", "Cart", 450],
    ["shipping", "Shipping", 660],
    ["review", "Review", 1120],
    ["done", "Done", 1330],
  ] as const) {
    box(id, "flow", x, 74, 122, 56);
    text(`${id}-label`, "flow", label, x + 20, 88);
  }
  elements.push({
    id: "saved-card",
    type: "diamond",
    frameId: "flow",
    x: 868,
    y: 44,
    width: 160,
    height: 112,
    strokeColor: "#495057",
    roughness: 1,
  });
  text("saved-card-label", "flow", "Saved\ncard?", 916, 74, 19);
  arrow("cart-shipping", 580, 102, [
    [0, 0],
    [70, 0],
  ]);
  arrow("shipping-card", 790, 102, [
    [0, 0],
    [68, 0],
  ]);
  arrow("card-review", 1036, 102, [
    [0, 0],
    [74, 0],
  ]);
  arrow("review-done", 1250, 102, [
    [0, 0],
    [70, 0],
  ]);
  text("yes-label", "flow", "Yes", 1060, 78, 18);
  text("pay-label", "flow", "Pay", 1270, 78, 18);
  arrow("no-card", 948, 162, [
    [0, 0],
    [0, 83],
  ]);
  text("no-label", "flow", "No", 963, 193, 18);
  box("add-card", "flow", 892, 253, 122, 56);
  text("add-card-label", "flow", "Add Card", 906, 268, 19);
  arrow("add-review", 1020, 280, [
    [0, 0],
    [160, 0],
    [160, -142],
  ]);
  note(
    "flow-note",
    "flow",
    "Most exits happen\non the card form",
    450,
    240,
    240,
    76,
    red,
  );
  text("flow-caption", "flow", "Mobile web, signed-in shoppers", 450, 340, 18);
  frame("checkout", "Checkout v2", 0, 520, 490, 390);
  box("phone", "checkout", 40, 560, 154, 310, "#f8f9fa");
  text("phone-title", "checkout", "Checkout", 53, 586, 12);
  box("phone-order", "checkout", 53, 614, 128, 42, "#e9ecef");
  box("phone-pay1", "checkout", 53, 667, 60, 24, "#ced4da");
  box("phone-pay2", "checkout", 121, 667, 60, 24, "#ced4da");
  box("phone-field1", "checkout", 53, 714, 128, 24);
  box("phone-field2", "checkout", 53, 748, 59, 24);
  elements.push({
    id: "phone-error",
    type: "rectangle",
    frameId: "checkout",
    x: 121,
    y: 748,
    width: 60,
    height: 24,
    strokeColor: "#e03131",
    roughness: 0,
  });
  box("phone-submit", "checkout", 53, 826, 128, 28, "#ced4da");
  note(
    "checkout-1",
    "checkout",
    "Wallet buttons\nabove the card form",
    212,
    560,
    238,
    76,
    yellow,
  );
  note(
    "checkout-2",
    "checkout",
    "Billing copies\nshipping",
    212,
    654,
    238,
    76,
    blue,
  );
  note(
    "checkout-3",
    "checkout",
    "Card errors are\neasy to miss",
    212,
    748,
    238,
    76,
    red,
  );
  note("checkout-more", "checkout", "+3", 212, 840, 56, 35, purple);
  frame("questions", "Open Questions", 580, 520, 490, 310);
  note(
    "question-1",
    "questions",
    "Express wallets\non web in scope?\nKenji",
    620,
    560,
    200,
    98,
    yellow,
  );
  note(
    "question-2",
    "questions",
    "Keep guest\ncheckout?\nPriya",
    835,
    560,
    200,
    98,
    yellow,
  );
  note(
    "question-3",
    "questions",
    "Card scan on\nAndroid only?\nOmar",
    620,
    676,
    200,
    98,
    blue,
  );
  note(
    "question-4",
    "questions",
    "Which saved card\nis the default?\nEmma",
    835,
    676,
    200,
    98,
    purple,
  );
  frame("decisions", "Decisions", 1160, 520, 320, 350);
  note(
    "decision-1",
    "decisions",
    "Wallet buttons ship\nfirst. Kenji, Oct 8",
    1200,
    560,
    240,
    76,
    green,
  );
  note(
    "decision-2",
    "decisions",
    "exp_express_pay\nstays at 10%. Priya",
    1200,
    654,
    240,
    76,
    green,
  );
  note(
    "decision-3",
    "decisions",
    "One page review\nstays. Sofia, Oct 2",
    1200,
    748,
    240,
    76,
    green,
  );
  return elements;
}
