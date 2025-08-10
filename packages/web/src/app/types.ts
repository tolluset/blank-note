export type Page = { id: string; content: string }
export type PositionedPage = { id: string; page: Page; x: number; y: number }
export type View = "note" | "list" | "trash" 