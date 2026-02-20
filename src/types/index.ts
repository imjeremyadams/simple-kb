export interface Card {
  id: string
  title: string
  description: string
}

export interface Column {
  id: string
  title: string
  color: string
  cardIds: string[]
}

export interface Board {
  columns: Column[]
  cards: Record<string, Card>
}
