export const SITE = {
  name: "Pause Prompt Wiki",
  nameJa: "一時停止",
  nameEn: "Pause Prompt Wiki",
  tagline: "凝視一個 Prompt 的重量",
  taglineEn: "The weight of a single prompt",
  description:
    "日系風格 AI Prompt 共享平台，精選高品質提示詞、模組化組裝，靈感從這裡開始。",
  url: "https://pause-prompt-wiki.vercel.app",
  repo: "https://github.com/linsamsir/pause-prompt-wiki",
  kofi: "https://ko-fi.com/pauselin",
} as const;

/**
 * The ordered list of builder element types.
 *
 * Order matters twice:
 *  1. It's the top-to-bottom display order in the Builder form.
 *  2. It's the concatenation order when we assemble the preview prompt
 *     (everything except `negative`, which is emitted separately).
 *
 * Keep natural prompt-writing flow: who → how positioned → wearing →
 * body details → feeling → doing → where → how lit → how framed →
 * what style → what quality → what sounds → what to avoid.
 */
export const BUILDER_ELEMENT_TYPES = [
  "subject",
  "pose",
  "wardrobe",
  "anatomy",
  "emotion",
  "action",
  "scene",
  "lighting",
  "camera",
  "style",
  "quality",
  "audio",
  "negative",
] as const;

export type BuilderElementType = (typeof BUILDER_ELEMENT_TYPES)[number];

export const BUILDER_ELEMENT_LABELS: Record<
  BuilderElementType,
  { zh: string; en: string; hint: string }
> = {
  subject: { zh: "主體", en: "Subject", hint: "人物、角色、主體描述" },
  pose: { zh: "姿勢", en: "Pose", hint: "身體姿態、重心、肢體位置" },
  wardrobe: { zh: "服裝", en: "Wardrobe", hint: "衣物、布料、配件質感" },
  anatomy: { zh: "身體", en: "Anatomy", hint: "身體局部、特徵、質感特寫" },
  emotion: { zh: "表情", en: "Emotion", hint: "表情、氛圍、情緒狀態" },
  action: { zh: "動作", en: "Action", hint: "動作、律動、進行式描述" },
  scene: { zh: "場景", en: "Scene", hint: "環境、背景、氛圍" },
  lighting: { zh: "光線", en: "Lighting", hint: "打光方向與氛圍" },
  camera: { zh: "鏡頭", en: "Camera", hint: "焦段、角度、構圖" },
  style: { zh: "風格", en: "Style", hint: "藝術風格、畫師參考" },
  quality: { zh: "品質", en: "Quality", hint: "解析度、材質修飾詞" },
  audio: { zh: "音效", en: "Audio", hint: "影片生成用的聲音與背景音" },
  negative: { zh: "反向", en: "Negative", hint: "要避免出現的內容" },
};
