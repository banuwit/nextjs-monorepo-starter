import type { ReactNode } from "react";
import type { ProductIllustration } from "../types/product";

// Colors come from CSS variables set by ProductArt, so one drawing follows the
// selected color and the active theme. Full class names keep Tailwind happy.
const EDGE = "stroke-(--art-ink) [stroke-opacity:0.3]";
const BASE = `fill-(--art-base) ${EDGE}`;
const SHADE = `fill-(--art-shade) ${EDGE}`;
const LIGHT = `fill-(--art-light) ${EDGE}`;
const DEEP = `fill-(--art-deep) ${EDGE}`;
const FOLD = "fill-black stroke-none opacity-15";
const SHEEN = "fill-white stroke-none opacity-10";
const SEAM = "fill-none stroke-(--art-seam)";
const METAL = "fill-none stroke-(--art-metal)";
const METAL_FILL = "fill-(--art-metal) stroke-none";

function Mirror({ children }: { children: ReactNode }) {
  return <g transform="matrix(-1 0 0 1 200 0)">{children}</g>;
}

function BikerJacket() {
  const sleeve = (
    <>
      <path
        className={BASE}
        d="M66 45 C52 50 44 59 40 73 L22 146 C21 150 23 153 27 154 L43 158 C47 159 49 157 50 153 L72 90 Z"
      />
      <path
        className={FOLD}
        d="M56 62 L36 150 L43 158 C47 159 49 157 50 153 L72 90 L66 60 Z"
      />
      <path
        className={SHEEN}
        d="M48 66 C44 72 42 78 40 86 L30 128 L35 129 L52 72 Z"
      />
      <path className={SEAM} strokeDasharray="2.5 2" d="M26 136 L46 141" />
      <path className={METAL} strokeWidth="1.75" d="M30 126 L39 148" />
    </>
  );

  return (
    <>
      {sleeve}
      <Mirror>{sleeve}</Mirror>
      <path
        className={BASE}
        d="M70 40 C82 49 118 49 130 40 L148 51 C150 72 150 102 147 130 L149 164 C130 169 70 169 51 164 L53 130 C50 102 50 72 52 51 Z"
      />
      <path
        className={FOLD}
        d="M120 62 C126 90 128 130 124 167 C134 166 142 165 149 164 L147 130 C150 102 150 72 148 51 L140 46 Z"
      />
      <path
        className={SHEEN}
        d="M60 92 C58 110 58 128 60 148 L72 150 C70 130 70 112 72 96 Z"
      />
      <path className={DEEP} d="M84 42 C92 48 108 48 116 42 L106 74 L95 74 Z" />
      <path
        className={LIGHT}
        d="M77 38 L62 50 L68 80 L80 75 L77 92 L97 112 L100 72 C92 62 84 50 77 38 Z"
      />
      <path
        className={SHADE}
        d="M123 38 L138 50 L133 76 L122 72 L125 90 L106 104 L103 70 C110 60 117 49 123 38 Z"
      />
      <path
        className={SHADE}
        d="M51 150 L149 150 L149 164 C130 169 70 169 51 164 Z"
      />
      <rect
        x="92"
        y="150"
        width="17"
        height="14"
        rx="2"
        className={METAL_FILL}
      />
      <rect
        x="96"
        y="153.5"
        width="9"
        height="7"
        rx="1"
        className="fill-(--art-shade)"
      />
      <path
        className={METAL}
        strokeWidth="2.25"
        d="M101 74 C104 100 106 124 110 150"
      />
      <path
        className={METAL}
        strokeWidth="1.75"
        d="M62 124 L82 114 M134 112 L140 132"
      />
      <path
        className={SEAM}
        strokeDasharray="2.5 2"
        d="M58 104 C70 100 82 100 92 104 M112 102 C124 98 134 98 144 100"
      />
    </>
  );
}

const PUFFER_ROWS = [52, 74, 96, 118, 140];
const PUFFER_SLEEVE_ROWS = [58, 80, 102, 124];

function PufferRow({
  x,
  y,
  w,
  h,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={h / 2.2} className={BASE} />
      <path
        className={FOLD}
        d={`M${x + 3} ${y + h - 7} Q${x + w / 2} ${y + h + 1} ${x + w - 3} ${y + h - 7} Q${x + w / 2} ${y + h - 2} ${x + 3} ${y + h - 7} Z`}
      />
      <rect
        x={x + 8}
        y={y + 4}
        width={w - 16}
        height="3.5"
        rx="1.75"
        className="fill-white stroke-none opacity-25"
      />
    </>
  );
}

function PufferJacket() {
  const sleeve = (
    <g transform="rotate(7 40 90)">
      {PUFFER_SLEEVE_ROWS.map((y) => (
        <PufferRow key={y} x={26} y={y} w={32} h={23} />
      ))}
      <rect x="31" y="146" width="22" height="9" rx="3" className={SHADE} />
    </g>
  );

  return (
    <>
      {sleeve}
      <Mirror>{sleeve}</Mirror>
      {PUFFER_ROWS.map((y) => (
        <PufferRow key={y} x={52} y={y} w={96} h={23} />
      ))}
      <rect x="56" y="162" width="88" height="10" rx="4" className={SHADE} />
      <path
        className={DEEP}
        d="M78 40 C88 34 112 34 122 40 L116 54 C108 58 92 58 84 54 Z"
      />
      <path
        className={SHADE}
        d="M74 30 C86 24 114 24 126 30 L128 46 C118 54 108 56 101 58 L100 44 L99 58 C92 56 82 54 72 46 Z"
      />
      <path className={METAL} strokeWidth="2.25" d="M100 44 L100 172" />
      <rect
        x="97.5"
        y="60"
        width="5"
        height="9"
        rx="1.5"
        className={METAL_FILL}
      />
      <path
        className={SEAM}
        strokeWidth="1.75"
        d="M64 124 L66 138 M136 124 L134 138"
      />
    </>
  );
}

function TankSet() {
  return (
    <>
      <path
        className={BASE}
        d="M82 12 L91 12 C91 28 109 28 109 12 L118 12 C118 30 123 40 131 46 L127 90 C110 94 90 94 73 90 L69 46 C77 40 82 30 82 12 Z"
      />
      <path
        className={FOLD}
        d="M112 34 C116 54 116 74 112 93 C118 92 123 91 127 90 L131 46 C124 41 120 35 118 26 Z"
      />
      {[78, 84, 90, 96, 102, 108, 114, 120].map((x) => (
        <path
          key={x}
          className={SEAM}
          strokeWidth="0.75"
          opacity="0.6"
          d={`M${x} 46 L${x} 91`}
        />
      ))}
      <path
        className={SEAM}
        strokeWidth="1.25"
        d="M84 13 C84 34 116 34 116 13"
      />
      <path
        className={SHADE}
        d="M77 100 L123 100 C128 122 136 150 134 180 C134 184 131 186 128 186 L114 186 C111 186 110 184 110 181 C108 160 104 140 100 126 C96 140 92 160 90 181 C90 184 89 186 86 186 L72 186 C69 186 66 184 66 180 C64 150 72 122 77 100 Z"
      />
      <path
        className={FOLD}
        d="M112 112 C116 134 122 158 122 186 L128 186 C131 186 134 184 134 180 C136 150 128 122 123 100 Z"
      />
      <path
        className={SHEEN}
        d="M84 116 C80 134 76 154 74 176 L80 176 C82 156 86 136 90 120 Z"
      />
      <path className={LIGHT} d="M76 96 L124 96 L125 108 L75 108 Z" />
      <path
        className={SEAM}
        strokeWidth="0.75"
        d="M82 96 L82 108 M90 96 L90 108 M98 96 L98 108 M106 96 L106 108 M114 96 L114 108"
      />
      <path
        className={METAL}
        strokeWidth="1.5"
        d="M100 104 C96 112 92 114 90 120 M100 104 C104 112 108 114 110 120"
      />
      <path
        className={SEAM}
        strokeWidth="1"
        d="M68 170 L90 170 M110 170 L132 170"
      />
    </>
  );
}

function DenimSet() {
  return (
    <>
      <path
        className={LIGHT}
        d="M86 8 L92 8 C92 20 108 20 108 8 L114 8 C114 22 118 30 124 34 L121 66 L79 66 L76 34 C82 30 86 22 86 8 Z"
      />
      <path
        className={FOLD}
        d="M110 28 C113 42 113 54 111 66 L121 66 L124 34 C118 30 115 26 114 20 Z"
      />
      <path
        className={BASE}
        d="M70 64 L130 64 C136 96 150 150 160 184 C160 188 158 190 154 190 L116 192 C113 192 112 190 112 188 L100 108 L88 188 C88 190 87 192 84 192 L46 190 C42 190 40 188 40 184 C50 150 64 96 70 64 Z"
      />
      <path
        className={FOLD}
        d="M118 88 C126 120 136 160 142 191 L154 190 C158 190 160 188 160 184 C150 150 136 96 130 64 L126 64 Z"
      />
      <path
        className="fill-white stroke-none opacity-20"
        d="M78 92 C72 120 64 150 58 182 L72 184 C76 154 82 124 88 104 C86 96 82 92 78 92 Z"
      />
      <path
        className="fill-white stroke-none opacity-15"
        d="M118 104 C120 130 124 158 128 186 L138 186 C132 156 126 126 120 100 Z"
      />
      <path className={SHADE} d="M69 62 L131 62 L133 74 L67 74 Z" />
      <path
        className={SEAM}
        strokeWidth="1"
        strokeDasharray="2 1.5"
        d="M68 71 L132 71"
      />
      {[80, 118].map((x) => (
        <rect
          key={x}
          x={x}
          y="60"
          width="3"
          height="15"
          rx="1"
          className={LIGHT}
        />
      ))}
      <circle cx="100" cy="68" r="2.25" className={METAL_FILL} />
      <path
        className={SEAM}
        strokeWidth="1"
        strokeDasharray="2 1.5"
        d="M100 74 L100 108 M94 74 L94 94 C94 99 97 101 100 102"
      />
      <path
        className={SEAM}
        strokeWidth="1"
        strokeDasharray="2 1.5"
        d="M72 76 C74 88 80 92 90 90 M128 76 C126 88 120 92 110 90"
      />
      <path
        className={SEAM}
        strokeWidth="1"
        strokeDasharray="2 1.5"
        d="M42 180 L86 183 M114 183 L158 180"
      />
    </>
  );
}

function RunningShoe() {
  return (
    <>
      <path
        className={SHADE}
        d="M92 74 L100 52 C102 49 106 48 109 50 L124 60 C126 62 126 64 124 67 L112 82 Z"
      />
      <path
        className={BASE}
        d="M30 126 C25 108 26 92 33 82 C38 76 46 76 50 83 C56 93 68 92 78 84 L96 68 C101 64 108 65 112 70 L140 100 C152 110 172 112 184 122 C190 128 190 136 184 140 L42 146 Z"
      />
      <path
        className={DEEP}
        d="M36 84 C40 79 46 80 49 86 C56 98 70 97 82 88 L90 80 C76 104 56 106 40 96 C37 93 35 88 36 84 Z"
      />
      <path
        className={SHADE}
        d="M26 112 C38 110 50 118 54 132 L56 146 L38 146 C30 136 26 124 26 112 Z"
      />
      <path
        className={LIGHT}
        d="M70 138 C96 134 124 118 142 102 L158 110 C136 128 106 142 82 144 Z"
      />
      <path
        className={SHEEN}
        d="M104 76 C118 92 132 104 150 110 L146 114 C126 108 112 96 100 82 Z"
      />
      {[0, 1, 2, 3].map((step) => (
        <path
          key={step}
          className="fill-none stroke-(--art-light)"
          strokeWidth="4"
          d={`M${92 + step * 10} ${90 + step * 9} L${110 + step * 9} ${74 + step * 9}`}
        />
      ))}
      <path
        className={SEAM}
        strokeWidth="1"
        strokeDasharray="2 1.5"
        d="M150 112 C160 118 164 128 162 140"
      />
      {[0, 1, 2].flatMap((row) =>
        [0, 1, 2].map((column) => (
          <circle
            key={`${row}-${column}`}
            cx={166 + column * 6}
            cy={122 + row * 5}
            r="0.9"
            className="fill-(--art-seam) stroke-none"
          />
        )),
      )}
      <path
        className={LIGHT}
        d="M24 136 C60 148 120 148 188 132 C194 140 194 152 184 158 C140 166 72 166 40 162 C26 160 20 148 24 136 Z"
      />
      <path
        className={FOLD}
        d="M26 150 C70 158 140 158 192 146 C191 151 188 155 184 158 C140 166 72 166 40 162 C33 161 29 156 26 150 Z"
      />
      <path
        className={SHADE}
        d="M36 162 C72 166 140 166 184 158 L180 166 C140 172 76 172 44 169 Z"
      />
    </>
  );
}

function RollTopBackpack() {
  return (
    <>
      <path
        className="fill-none stroke-(--art-shade)"
        strokeWidth="5"
        d="M86 26 C86 8 114 8 114 26"
      />
      <path
        className={BASE}
        d="M58 52 L142 52 C154 52 162 62 162 76 L164 164 C164 176 156 184 144 184 L56 184 C44 184 36 176 36 164 L38 76 C38 62 46 52 58 52 Z"
      />
      <path
        className={FOLD}
        d="M136 54 C144 60 146 70 146 80 L148 183 C158 182 164 176 164 164 L162 76 C162 62 154 52 142 52 Z"
      />
      <path
        className={SHEEN}
        d="M48 70 C46 100 46 130 46 160 L56 164 L58 62 Z"
      />
      <path
        className={SHADE}
        d="M54 26 C54 22 58 20 62 20 L138 20 C142 20 146 22 146 26 L148 56 C148 60 145 62 141 62 L59 62 C55 62 52 60 52 56 Z"
      />
      <path
        className={SEAM}
        strokeWidth="1"
        d="M56 32 L144 32 M54 44 L146 44"
      />
      <path className={SHEEN} d="M60 24 L140 24 L140 30 L60 30 Z" />
      <rect x="72" y="22" width="12" height="74" rx="2" className={LIGHT} />
      <rect x="116" y="22" width="12" height="74" rx="2" className={LIGHT} />
      <rect
        x="70"
        y="70"
        width="16"
        height="12"
        rx="2"
        className={METAL_FILL}
      />
      <rect
        x="114"
        y="70"
        width="16"
        height="12"
        rx="2"
        className={METAL_FILL}
      />
      <path
        className={SHADE}
        d="M58 112 C58 106 62 102 68 102 L132 102 C138 102 142 106 142 112 L144 164 C144 170 140 174 134 174 L66 174 C60 174 56 170 56 164 Z"
      />
      <path
        className={SEAM}
        strokeWidth="1"
        strokeDasharray="2.5 2"
        d="M62 124 L138 124"
      />
      <path className={METAL} strokeWidth="2" d="M70 118 L130 118" />
      <rect x="94" y="115" width="12" height="16" rx="2" className={LIGHT} />
    </>
  );
}

const TICKS = Array.from({ length: 12 }, (_, index) => {
  const angle = (index * Math.PI) / 6;
  const inner = index % 3 === 0 ? 29 : 33;
  // Rounded so server and client render identical attribute strings.
  const point = (radius: number) => ({
    x: Number((100 + Math.sin(angle) * radius).toFixed(2)),
    y: Number((100 - Math.cos(angle) * radius).toFixed(2)),
  });
  const start = point(inner);
  const end = point(37);
  return { index, x1: start.x, y1: start.y, x2: end.x, y2: end.y };
});

function FieldWatch() {
  return (
    <>
      <path
        className={BASE}
        d="M82 6 L118 6 C120 6 121 7 121 9 L125 60 L75 60 L79 9 C79 7 80 6 82 6 Z"
      />
      <path
        className={BASE}
        d="M75 140 L125 140 L121 191 C121 193 120 194 118 194 L82 194 C80 194 79 193 79 191 Z"
      />
      <path
        className={FOLD}
        d="M106 6 L118 6 C120 6 121 7 121 9 L125 60 L108 60 Z"
      />
      <path
        className={FOLD}
        d="M108 140 L125 140 L121 191 C121 193 120 194 118 194 L106 194 Z"
      />
      <path
        className={SEAM}
        strokeWidth="1"
        strokeDasharray="2.5 2"
        d="M84 10 L81 52 M116 10 L119 52 M81 148 L84 190 M119 148 L116 190"
      />
      {[166, 176].map((cy) => (
        <ellipse
          key={cy}
          cx="100"
          cy={cy}
          rx="2"
          ry="2.75"
          className="fill-(--art-deep) stroke-none"
        />
      ))}
      <rect
        x="148"
        y="93"
        width="9"
        height="14"
        rx="2.5"
        className={METAL_FILL}
      />
      <circle cx="100" cy="100" r="50" className={METAL_FILL} />
      <path
        className="fill-black stroke-none opacity-20"
        d="M135 65 A50 50 0 0 1 65 135 A44 44 0 0 0 135 65 Z"
      />
      <circle
        cx="100"
        cy="100"
        r="43"
        className="fill-(--art-deep) stroke-(--art-metal)"
        strokeWidth="1.5"
      />
      {TICKS.map((tick) => (
        <line
          key={tick.index}
          x1={tick.x1}
          y1={tick.y1}
          x2={tick.x2}
          y2={tick.y2}
          className="stroke-(--art-metal)"
          strokeWidth={tick.index % 3 === 0 ? 3 : 1.25}
        />
      ))}
      <path
        className={METAL}
        strokeWidth="3.5"
        d="M100 100 L100 72 M100 100 L121 88"
      />
      <path
        className="fill-none stroke-(--art-light)"
        strokeWidth="1"
        d="M100 110 L84 124"
      />
      <circle cx="100" cy="100" r="3.5" className={METAL_FILL} />
      <path
        className="fill-white stroke-none opacity-10"
        d="M70 72 A42 42 0 0 1 126 66 L80 120 A42 42 0 0 1 70 72 Z"
      />
    </>
  );
}

const LENS_PATH =
  "M18 76 C18 68 24 66 32 66 L82 66 C90 66 94 70 94 78 L92 98 C90 118 76 128 58 128 C36 128 22 112 18 76 Z";
const LENS_GLASS_PATH =
  "M25 78 C25 73 28 72 34 72 L80 72 C85 72 87 74 87 79 L85 97 C83 113 72 121 58 121 C40 121 29 108 25 78 Z";

function Lens() {
  return (
    <>
      <path className={BASE} d={LENS_PATH} />
      <path className="fill-(--art-deep) stroke-none" d={LENS_GLASS_PATH} />
      <path
        className="fill-white stroke-none opacity-15"
        d="M36 72 L62 72 L42 114 C36 110 32 104 30 96 Z"
      />
      <path
        className="fill-white stroke-none opacity-10"
        d="M68 72 L76 72 L54 120 L48 118 Z"
      />
      <path className={SHEEN} d="M24 68 L88 68 L90 71 L22 71 Z" />
    </>
  );
}

function Sunglasses() {
  const side = (
    <>
      <path
        className={SHADE}
        d="M18 70 C10 66 6 66 2 70 L2 76 C8 74 12 74 18 78 Z"
      />
      <Lens />
      <rect x="20" y="68" width="6" height="4" rx="1" className={METAL_FILL} />
    </>
  );

  return (
    <g transform="translate(0 -6)">
      {side}
      <Mirror>{side}</Mirror>
      <path
        className={BASE}
        d="M92 74 C96 68 104 68 108 74 L108 82 C104 78 96 78 92 82 Z"
      />
    </g>
  );
}

export const PRODUCT_ILLUSTRATIONS: Record<
  ProductIllustration,
  () => ReactNode
> = {
  "biker-jacket": BikerJacket,
  "puffer-jacket": PufferJacket,
  "tank-set": TankSet,
  "denim-set": DenimSet,
  runner: RunningShoe,
  backpack: RollTopBackpack,
  watch: FieldWatch,
  sunglasses: Sunglasses,
};
