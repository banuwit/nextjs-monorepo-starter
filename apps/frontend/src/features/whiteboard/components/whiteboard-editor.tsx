"use client";

import { useEffect, useRef, useState } from "react";
import {
  CaptureUpdateAction,
  Excalidraw,
  Footer,
  convertToExcalidrawElements,
  exportToBlob,
  exportToSvg,
  restore,
  serializeAsJSON,
} from "@excalidraw/excalidraw";
import type {
  AppState,
  BinaryFiles,
  ExcalidrawImperativeAPI,
  ToolType,
} from "@excalidraw/excalidraw/types";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import {
  ArrowRightIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleIcon,
  DiamondIcon,
  DownloadIcon,
  EraserIcon,
  EyeIcon,
  FolderOpenIcon,
  FrameIcon,
  Grid2X2Icon,
  HandIcon,
  ImageIcon,
  LayoutTemplateIcon,
  LibraryIcon,
  MagnetIcon,
  MaximizeIcon,
  MenuIcon,
  MinusIcon,
  MousePointer2Icon,
  PanelRightIcon,
  PencilIcon,
  PlusIcon,
  SaveIcon,
  Share2Icon,
  SquareIcon,
  TypeIcon,
  XIcon,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  boardTemplates,
  createBoardTemplate,
  whiteboardTitle,
} from "@/mocks/whiteboard.mock";
import { getFrames, parseBoard, prependVersion } from "../utils/whiteboard";
import { savedBoardSchema } from "../schemas/whiteboard.schema";
import type { BoardVersion } from "../types/whiteboard";
import "@excalidraw/excalidraw/index.css";

const storageKey = "whiteboard:v1";
const tools: { type: ToolType; label: string; icon: typeof HandIcon }[] = [
  { type: "hand", label: "Hand", icon: HandIcon },
  { type: "selection", label: "Selection", icon: MousePointer2Icon },
  { type: "rectangle", label: "Rectangle", icon: SquareIcon },
  { type: "diamond", label: "Diamond", icon: DiamondIcon },
  { type: "ellipse", label: "Ellipse", icon: CircleIcon },
  { type: "arrow", label: "Arrow", icon: ArrowRightIcon },
  { type: "line", label: "Line", icon: MinusIcon },
  { type: "freedraw", label: "Draw", icon: PencilIcon },
  { type: "text", label: "Text", icon: TypeIcon },
  { type: "image", label: "Image", icon: ImageIcon },
  { type: "eraser", label: "Eraser", icon: EraserIcon },
  { type: "frame", label: "Frame", icon: FrameIcon },
];

function restoredScene(json: string) {
  const parsed = parseBoard(json);
  // Excalidraw restores missing element defaults after validating the file envelope.
  return restore(
    parsed as unknown as Parameters<typeof restore>[0],
    null,
    null,
  );
}

function initialBoard() {
  try {
    const value = localStorage.getItem(storageKey);
    if (value) {
      const saved = savedBoardSchema.parse(JSON.parse(value));
      saved.versions.forEach((version) => parseBoard(version.scene));
      return {
        ...saved,
        data: { ...restoredScene(saved.scene), scrollToContent: true },
        error: "",
      };
    }
  } catch {
    return {
      ...emptyBoard(),
      error:
        "The saved board could not be loaded. Your stored copy will stay untouched until you edit this board.",
    };
  }
  return emptyBoard();
}

function emptyBoard() {
  return {
    title: whiteboardTitle,
    versions: [] as BoardVersion[],
    scene: "",
    error: "",
    data: {
      elements: convertToExcalidrawElements(createBoardTemplate(), {
        regenerateIds: false,
      }),
      appState: {
        viewBackgroundColor: "#ffffff",
        currentItemFontFamily: 1,
        gridModeEnabled: true,
      },
      files: {},
      scrollToContent: true,
    },
  };
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function IconButton({
  label,
  icon: Icon,
  onClick,
  pressed,
  disabled,
}: {
  label: string;
  icon: typeof HandIcon;
  onClick: () => void;
  pressed?: boolean;
  disabled?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant={pressed ? "secondary" : "ghost"}
            size="icon"
            aria-label={label}
            aria-pressed={pressed}
            disabled={disabled}
            onClick={onClick}
          />
        }
      >
        <Icon />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export default function WhiteboardEditor() {
  const [boot] = useState(initialBoard);
  const [api, setApi] = useState<ExcalidrawImperativeAPI | null>(null);
  const [title, setTitle] = useState(boot.title);
  const [versions, setVersions] = useState(boot.versions);
  const [elements, setElements] = useState<readonly ExcalidrawElement[]>(
    boot.data.elements,
  );
  const [status, setStatus] = useState(
    boot.scene ? "Saved in this browser" : "Local board",
  );
  const [error, setError] = useState(boot.error);
  const [panel, setPanel] = useState(false);
  const [tab, setTab] = useState("frames");
  const [search, setSearch] = useState("");
  const [activeTool, setActiveTool] = useState("selection");
  const [viewOnly, setViewOnly] = useState(false);
  const [grid, setGrid] = useState(false);
  const [snap, setSnap] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );
  const [activeFrame, setActiveFrame] = useState("");
  const [share, setShare] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [pending, setPending] = useState<{
    name: string;
    apply: () => void;
  } | null>(null);
  const [library, setLibrary] = useState<
    { name: string; elements: readonly ExcalidrawElement[] }[]
  >([]);
  const fileInput = useRef<HTMLInputElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef({
    title: boot.title,
    versions: boot.versions,
    scene: boot.scene,
  });
  const sceneKey = useRef("");
  const frames = getFrames(elements);

  useEffect(() => {
    if (!api) return;
    const frame = requestAnimationFrame(() => {
      api.scrollToContent(api.getSceneElements(), {
        fitToContent: true,
        viewportZoomFactor: 0.75,
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [api]);

  useEffect(() => {
    const update = () =>
      setTheme(
        document.documentElement.classList.contains("dark") ? "dark" : "light",
      );
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Flush a pending edit when navigating away or closing the tab.
    const flush = () => {
      if (!saveTimer.current) return;
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
      try {
        localStorage.setItem(storageKey, JSON.stringify(latest.current));
      } catch {
        /* The visible save error already offers file export. */
      }
    };
    window.addEventListener("pagehide", flush);
    return () => {
      flush();
      window.removeEventListener("pagehide", flush);
    };
  }, []);

  function persist() {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = null;
    try {
      localStorage.setItem(storageKey, JSON.stringify(latest.current));
      setStatus("Saved in this browser");
      setError("");
    } catch {
      setStatus("Not saved");
      setError(
        "Browser storage is full or unavailable. Download the board file to keep your changes.",
      );
    }
  }

  function changed(
    next: readonly ExcalidrawElement[],
    state: AppState,
    files: BinaryFiles,
  ) {
    setActiveTool(state.activeTool.type);
    setGrid(state.gridModeEnabled);
    setSnap(state.objectsSnapModeEnabled);
    // Avoid serializing images and the full scene for every pointer/viewport update.
    const key =
      next
        .map(
          (item) =>
            `${item.id}:${item.version}:${item.versionNonce}:${item.isDeleted}`,
        )
        .join("|") +
      state.viewBackgroundColor +
      state.gridModeEnabled +
      state.objectsSnapModeEnabled;
    if (key === sceneKey.current) return;
    const first = sceneKey.current === "";
    sceneKey.current = key;
    setElements(next);
    latest.current.scene = serializeAsJSON(next, state, files, "local");
    if (first) return;
    setStatus("Saving…");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(persist, 500);
  }

  function showFrame(id?: string) {
    if (!api) return;
    const target = id
      ? api.getSceneElements().find((item) => item.id === id)
      : api.getSceneElements();
    api.scrollToContent(target, {
      fitToContent: true,
      viewportZoomFactor: 0.75,
      animate: false,
    });
    setActiveFrame(id || "");
  }

  function saveVersion() {
    if (!latest.current.scene) return;
    const next = prependVersion(latest.current.versions, {
      id: crypto.randomUUID(),
      name: `Version ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      createdAt: new Date().toISOString(),
      scene: latest.current.scene,
    });
    latest.current.versions = next;
    setVersions(next);
    persist();
    setPanel(true);
    setTab("history");
  }

  function replaceScene(json: string) {
    if (!api) return;
    const scene = restoredScene(json);
    api.addFiles(Object.values(scene.files || {}));
    api.updateScene({
      elements: scene.elements,
      appState: {
        selectedElementIds: {},
        viewBackgroundColor: scene.appState.viewBackgroundColor || "#ffffff",
      },
      captureUpdate: CaptureUpdateAction.IMMEDIATELY,
    });
    api.scrollToContent(scene.elements, {
      fitToContent: true,
      viewportZoomFactor: 0.75,
    });
    setActiveFrame("");
  }

  async function exportImage(format: "png" | "svg") {
    if (!api) return;
    setExporting(true);
    try {
      const options = {
        elements: api.getSceneElements(),
        appState: {
          ...api.getAppState(),
          exportWithDarkMode: theme === "dark",
          exportBackground: true,
        },
        files: api.getFiles(),
      };
      const blob =
        format === "svg"
          ? new Blob([(await exportToSvg(options)).outerHTML], {
              type: "image/svg+xml",
            })
          : await exportToBlob({ ...options, mimeType: "image/png" });
      download(blob, `${title}.${format}`);
    } catch {
      setError(
        "Image export failed. Try again, or download the editable board file.",
      );
    } finally {
      setExporting(false);
    }
  }

  function downloadBoard() {
    if (!latest.current.scene) return;
    download(
      new Blob([latest.current.scene], { type: "application/json" }),
      `${title}.excalidraw`,
    );
  }

  async function openFile(file?: File) {
    if (!file) return;
    try {
      if (file.size > 20 * 1024 * 1024) throw new Error("File too large");
      const json = await file.text();
      restoredScene(json);
      setPending({
        name: `Open ${file.name}? Your current board will be saved as a version first.`,
        apply: () => {
          saveVersion();
          replaceScene(json);
        },
      });
    } catch {
      setError(
        "This is not a valid Excalidraw board file (maximum 20 MB). Your board has not changed.",
      );
    }
    if (fileInput.current) fileInput.current.value = "";
  }

  function addToLibrary() {
    if (!api) return;
    const selected = api
      .getSceneElements()
      .filter((item) => api.getAppState().selectedElementIds[item.id]);
    if (!selected.length) {
      setError("Select one or more shapes on the canvas first.");
      return;
    }
    setLibrary((items) => [
      ...items,
      {
        name: `Selection ${items.length + 1}`,
        elements: structuredClone(selected),
      },
    ]);
  }

  function insertLibrary(selection: readonly ExcalidrawElement[]) {
    if (!api) return;
    // The converter remaps IDs and bound text/arrows for reusable shape groups.
    const copies = convertToExcalidrawElements(
      structuredClone(selection) as Parameters<
        typeof convertToExcalidrawElements
      >[0],
    );
    api.updateScene({
      elements: [...api.getSceneElements(), ...copies],
      appState: {
        selectedElementIds: Object.fromEntries(
          copies.map((item) => [item.id, true]),
        ),
      },
      captureUpdate: CaptureUpdateAction.IMMEDIATELY,
    });
    api.scrollToContent(copies, { fitToContent: true });
  }

  const viewControls = (
    <div className="whiteboard-footer flex items-center gap-1">
      <IconButton
        label="Zoom to Fit"
        icon={MaximizeIcon}
        onClick={() => showFrame()}
      />
      <IconButton
        label="Grid"
        icon={Grid2X2Icon}
        pressed={grid}
        onClick={() =>
          api?.updateScene({ appState: { gridModeEnabled: !grid } })
        }
      />
      <IconButton
        label="Snap to Objects"
        icon={MagnetIcon}
        pressed={snap}
        onClick={() =>
          api?.updateScene({ appState: { objectsSnapModeEnabled: !snap } })
        }
      />
      <IconButton
        label="View Only"
        icon={EyeIcon}
        pressed={viewOnly}
        onClick={() => setViewOnly(!viewOnly)}
      />
    </div>
  );

  return (
    <>
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b px-3 py-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Input
            aria-label="Board title"
            value={title}
            maxLength={120}
            disabled={viewOnly}
            className="w-44 border-transparent shadow-none sm:w-56"
            onChange={(event) => setTitle(event.target.value)}
            onBlur={() => {
              const name = title.trim() || "Untitled board";
              setTitle(name);
              if (name !== latest.current.title) {
                latest.current.title = name;
                persist();
              }
            }}
          />
          <span
            role="status"
            className="hidden items-center gap-1 text-xs text-muted-foreground md:flex"
          >
            <CheckIcon className="size-3" />
            {status}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Only you are on this local board"
                />
              }
            >
              <Avatar className="size-6">
                <AvatarFallback>Y</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>Only you · Local board</TooltipContent>
          </Tooltip>
          <Button
            variant="outline"
            size="sm"
            aria-label="Share"
            onClick={() => setShare(true)}
          >
            <Share2Icon data-icon="inline-start" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  aria-label="Export"
                  disabled={!api || exporting}
                />
              }
            >
              <DownloadIcon data-icon="inline-start" />
              <span className="hidden sm:inline">
                {exporting ? "Exporting…" : "Export"}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => void exportImage("png")}>
                  Export PNG
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => void exportImage("svg")}>
                  Export SVG
                </DropdownMenuItem>
                <DropdownMenuItem onClick={downloadBoard}>
                  Download board file
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <IconButton
            label="Board panel"
            icon={PanelRightIcon}
            pressed={panel}
            onClick={() => setPanel(!panel)}
          />
        </div>
      </header>
      {error && (
        <Alert
          variant="destructive"
          className="shrink-0 rounded-none border-x-0 border-t-0"
        >
          <AlertDescription className="flex items-center justify-between gap-2">
            {error}
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Dismiss message"
              onClick={() => setError("")}
            >
              <XIcon />
            </Button>
          </AlertDescription>
        </Alert>
      )}
      <div className="relative flex min-h-0 flex-1">
        <div
          className="whiteboard-canvas relative min-w-0 flex-1"
          role="region"
          aria-label={`${title} board`}
        >
          <Excalidraw
            initialData={boot.data}
            excalidrawAPI={setApi}
            onChange={changed}
            theme={theme}
            viewModeEnabled={viewOnly}
            name={title}
            autoFocus={false}
            UIOptions={{
              canvasActions: {
                loadScene: false,
                saveToActiveFile: false,
                export: false,
                clearCanvas: false,
                changeViewBackgroundColor: true,
                toggleTheme: false,
              },
              tools: { image: true },
            }}
          >
            <Footer>{viewControls}</Footer>
          </Excalidraw>
          <div className="whiteboard-mobile-controls absolute bottom-14 left-3 z-10">
            {viewControls}
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-3 z-10 flex items-start gap-2 px-3">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    className="pointer-events-auto shrink-0 shadow-sm"
                    variant="outline"
                    size="icon"
                    aria-label="Board menu"
                  />
                }
              >
                <MenuIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    disabled={viewOnly}
                    onClick={() => fileInput.current?.click()}
                  >
                    <FolderOpenIcon />
                    Open board
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={downloadBoard}>
                    <DownloadIcon />
                    Save board file
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled={viewOnly} onClick={saveVersion}>
                    <SaveIcon />
                    Save version
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={viewOnly}
                    onClick={() => {
                      setTab("library");
                      setPanel(true);
                    }}
                  >
                    <LayoutTemplateIcon />
                    Templates
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    disabled={viewOnly}
                    onClick={() =>
                      setPending({
                        name: "Clear the board? A version of your current work will be saved first.",
                        apply: () => {
                          saveVersion();
                          api?.updateScene({
                            elements: [],
                            captureUpdate: CaptureUpdateAction.IMMEDIATELY,
                          });
                        },
                      })
                    }
                  >
                    Clear board
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="pointer-events-auto mx-auto min-w-0 overflow-x-auto rounded-lg border bg-background p-1 shadow-sm">
              <ToggleGroup
                aria-label="Drawing tools"
                spacing={0}
                value={[activeTool]}
                onValueChange={(values) => {
                  const tool = tools.find((item) => item.type === values[0]);
                  if (tool) api?.setActiveTool({ type: tool.type });
                }}
              >
                {tools.map(({ type, label, icon: Icon }) => (
                  <Tooltip key={type}>
                    <TooltipTrigger
                      render={
                        <ToggleGroupItem
                          value={type}
                          aria-label={label}
                          disabled={!api || (viewOnly && type !== "hand")}
                        />
                      }
                    >
                      <Icon />
                    </TooltipTrigger>
                    <TooltipContent>{label}</TooltipContent>
                  </Tooltip>
                ))}
              </ToggleGroup>
            </div>
            <Button
              className="pointer-events-auto shrink-0 shadow-sm"
              variant="outline"
              size="icon"
              aria-label="Library"
              onClick={() => {
                setTab("library");
                setPanel(true);
              }}
            >
              <LibraryIcon />
            </Button>
          </div>
          {viewOnly && (
            <Badge
              variant="secondary"
              className="absolute left-1/2 top-16 z-10 -translate-x-1/2"
            >
              View only
            </Badge>
          )}
          <div className="absolute right-3 bottom-3 z-10 flex items-center rounded-lg border bg-background p-1 shadow-sm">
            <IconButton
              label="Previous Frame"
              icon={ChevronLeftIcon}
              disabled={!frames.length}
              onClick={() => {
                const i = frames.findIndex((frame) => frame.id === activeFrame);
                showFrame(frames[(i - 1 + frames.length) % frames.length]?.id);
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setTab("frames");
                setPanel(true);
              }}
            >
              <FrameIcon data-icon="inline-start" />
              {frames.length} Frames
            </Button>
            <IconButton
              label="Next Frame"
              icon={ChevronRightIcon}
              disabled={!frames.length}
              onClick={() => {
                const i = frames.findIndex((frame) => frame.id === activeFrame);
                showFrame(frames[(i + 1) % frames.length]?.id);
              }}
            />
          </div>
        </div>
        {panel && (
          <aside
            aria-label="Board panel"
            className="absolute inset-y-0 right-0 z-20 flex w-[min(19rem,100%)] flex-col border-l bg-background shadow-lg xl:static xl:w-72 xl:shrink-0 xl:shadow-none"
          >
            <div className="flex items-center justify-between px-3 pt-3">
              <span className="text-sm font-medium">Board panel</span>
              <IconButton
                label="Close board panel"
                icon={XIcon}
                onClick={() => setPanel(false)}
              />
            </div>
            <Tabs
              value={tab}
              onValueChange={(value) => setTab(String(value))}
              className="min-h-0 flex-1 p-3"
            >
              <TabsList className="w-full">
                <TabsTrigger value="frames">Frames</TabsTrigger>
                <TabsTrigger value="library">Library</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <TabsContent value="frames" className="overflow-y-auto">
                <Input
                  aria-label="Search board"
                  placeholder="Search board…"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="my-3"
                />
                <div className="flex flex-col gap-1">
                  <Button
                    variant={!activeFrame ? "secondary" : "ghost"}
                    className="h-auto justify-start gap-3 py-3"
                    onClick={() => showFrame()}
                  >
                    <MaximizeIcon />
                    <span className="flex flex-col items-start">
                      <span>Whole Board</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        {frames.length} frames ·{" "}
                        {
                          elements.filter(
                            (item) => !item.isDeleted && item.type !== "frame",
                          ).length
                        }{" "}
                        items
                      </span>
                    </span>
                  </Button>
                  {frames
                    .filter((frame) =>
                      frame.name.toLowerCase().includes(search.toLowerCase()),
                    )
                    .map((frame) => (
                      <Button
                        key={frame.id}
                        variant={
                          activeFrame === frame.id ? "secondary" : "ghost"
                        }
                        className="h-auto justify-start gap-3 py-3"
                        onClick={() => showFrame(frame.id)}
                      >
                        <FrameIcon />
                        <span className="flex min-w-0 flex-col items-start">
                          <span className="max-w-full truncate">
                            {frame.name}
                          </span>
                          <span className="text-xs font-normal text-muted-foreground">
                            {frame.count} items
                          </span>
                        </span>
                      </Button>
                    ))}
                  {!frames.length && (
                    <p className="p-3 text-sm text-muted-foreground">
                      Use the Frame tool to organize your canvas.
                    </p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="library" className="overflow-y-auto">
                <div className="flex flex-col gap-3 py-3">
                  <h3 className="text-sm font-medium">Start with a template</h3>
                  {boardTemplates.map((template) => (
                    <Button
                      key={template.id}
                      variant="outline"
                      disabled={viewOnly}
                      className="h-auto justify-start gap-3 whitespace-normal p-3 text-left"
                      onClick={() =>
                        setPending({
                          name: `Use ${template.name}? Your current board will be saved as a version first.`,
                          apply: () => {
                            saveVersion();
                            const next = convertToExcalidrawElements(
                              createBoardTemplate(template.id),
                              { regenerateIds: false },
                            );
                            api?.updateScene({
                              elements: next,
                              captureUpdate: CaptureUpdateAction.IMMEDIATELY,
                            });
                            api?.scrollToContent(next, {
                              fitToContent: true,
                              viewportZoomFactor: 0.75,
                            });
                          },
                        })
                      }
                    >
                      <LayoutTemplateIcon />
                      <span className="flex flex-col gap-1">
                        <span>{template.name}</span>
                        <span className="text-xs font-normal text-muted-foreground">
                          {template.description}
                        </span>
                      </span>
                    </Button>
                  ))}
                  <h3 className="mt-3 text-sm font-medium">My shapes</h3>
                  <p className="text-xs text-muted-foreground">
                    Reuse selections during this session. Download your board to
                    keep all shapes.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={viewOnly}
                    onClick={addToLibrary}
                  >
                    <PlusIcon data-icon="inline-start" />
                    Add selection
                  </Button>
                  {library.map((item, i) => (
                    <Button
                      variant="ghost"
                      key={i}
                      disabled={viewOnly}
                      onClick={() => insertLibrary(item.elements)}
                    >
                      <SquareIcon data-icon="inline-start" />
                      {item.name} · {item.elements.length} shapes
                    </Button>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="history" className="overflow-y-auto">
                <div className="flex flex-col gap-3 py-3">
                  <Button
                    variant="outline"
                    disabled={viewOnly}
                    onClick={saveVersion}
                  >
                    <SaveIcon data-icon="inline-start" />
                    Save version
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    The latest 20 snapshots are saved in this browser.
                  </p>
                  {versions.map((version) => (
                    <div
                      key={version.id}
                      className="flex flex-col gap-2 rounded-lg border p-3"
                    >
                      <span className="text-sm font-medium">
                        {version.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(version.createdAt).toLocaleString()}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={viewOnly}
                        onClick={() =>
                          setPending({
                            name: `Restore ${version.name}? Your current board will be saved as a version first.`,
                            apply: () => {
                              saveVersion();
                              replaceScene(version.scene);
                            },
                          })
                        }
                      >
                        Restore
                      </Button>
                    </div>
                  ))}
                  {!versions.length && (
                    <p className="py-5 text-center text-sm text-muted-foreground">
                      No saved versions yet.
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </aside>
        )}
      </div>
      <input
        ref={fileInput}
        type="file"
        accept=".excalidraw,.json"
        aria-label="Open board file"
        className="hidden"
        onChange={(event) => void openFile(event.target.files?.[0])}
      />
      <Dialog open={share} onOpenChange={setShare}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share your board</DialogTitle>
            <DialogDescription>
              This board is saved only in your browser. Send an editable board
              file or an image to share your work.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Button onClick={downloadBoard}>
              <DownloadIcon data-icon="inline-start" />
              Download editable board
            </Button>
            <Button
              variant="outline"
              disabled={exporting}
              onClick={() => void exportImage("png")}
            >
              Download PNG
            </Button>
            <p className="text-xs text-muted-foreground">
              Live collaboration and shared links need a connected server.
            </p>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={Boolean(pending)}
        onOpenChange={(open) => {
          if (!open) setPending(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Replace board content</DialogTitle>
            <DialogDescription>{pending?.name}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPending(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                pending?.apply();
                setPending(null);
              }}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
