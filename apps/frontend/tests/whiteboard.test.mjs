import assert from "node:assert/strict";
import { test } from "node:test";
import {
  parseBoard,
  getFrames,
  prependVersion,
} from "../src/features/whiteboard/whiteboard-model.ts";
import { createBoardTemplate } from "../src/mocks/whiteboard.mock.ts";

test("review and retrospective templates have unique shapes in valid frames", () => {
  for (const [template, expectedFrames] of [
    ["review", 5],
    ["retro", 3],
  ]) {
    const shapes = createBoardTemplate(template);
    const frames = shapes.filter((shape) => shape.type === "frame");
    assert.equal(frames.length, expectedFrames);
    assert.equal(new Set(shapes.map((shape) => shape.id)).size, shapes.length);
    for (const shape of shapes.filter((shape) => shape.frameId)) {
      assert.ok(frames.some((frame) => frame.id === shape.frameId));
    }
  }
  assert.deepEqual(createBoardTemplate("blank"), []);
});

const scene = {
  type: "excalidraw",
  version: 2,
  elements: [
    { id: "shape-1", type: "rectangle", x: 10, y: 20, width: 120, height: 80 },
  ],
  appState: { viewBackgroundColor: "#ffffff" },
  files: {},
};

test("board files round-trip drawings and reject malformed imports", () => {
  assert.deepEqual(parseBoard(JSON.stringify(scene)), scene);
  for (const value of [
    null,
    {},
    { ...scene, type: "other" },
    { ...scene, elements: [{}] },
    { ...scene, elements: [{ ...scene.elements[0], x: "10" }] },
    { ...scene, files: { image: { dataURL: "javascript:alert(1)" } } },
  ]) {
    assert.throws(() => parseBoard(JSON.stringify(value)));
  }
  assert.throws(() => parseBoard("broken json"));
});

test("frame navigation follows current names and excludes deleted shapes", () => {
  assert.deepEqual(
    getFrames([
      { id: "frame", type: "frame", name: "Updated goal" },
      { id: "shape", type: "rectangle", frameId: "frame" },
      { id: "removed", type: "text", frameId: "frame", isDeleted: true },
      { id: "deleted-frame", type: "frame", isDeleted: true },
    ]),
    [{ id: "frame", name: "Updated goal", count: 1 }],
  );
});

test("saved versions preserve a restorable scene and cap history at twenty", () => {
  const versions = Array.from({ length: 20 }, (_, i) => ({
    id: String(i),
    name: "Earlier",
    createdAt: "2026-10-21T00:00:00Z",
    scene: JSON.stringify(scene),
  }));
  const next = {
    id: "new",
    name: "Review",
    createdAt: "2026-10-21T01:00:00Z",
    scene: JSON.stringify(scene),
  };
  const result = prependVersion(versions, next);
  assert.equal(result.length, 20);
  assert.equal(result[0].id, "new");
  assert.deepEqual(parseBoard(result[0].scene), scene);
  assert.equal(versions[0].id, "0");
});
