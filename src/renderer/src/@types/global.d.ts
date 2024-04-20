interface Categories {
  title: string
  children: Menu[]
}

interface Menu {
  title: string
  id: string
  url?: string
  icon: string
  isDelete?: boolen
}
