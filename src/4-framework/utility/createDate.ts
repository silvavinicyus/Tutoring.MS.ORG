const dateFormats = {
  br: (dd, mm, yyyy) => `${dd}/${mm}/${yyyy}`,
  en: (dd, mm, yyyy) => `${mm}/${dd}/${yyyy}`,
}

export const convertToDate = (date: string): Date => {
  if (!date) {
    return new Date(0)
  }

  return new Date(!Number.isNaN(Number(date)) ? +date : date)
}

export const formatDate = (
  date: string | number | Date,
  format: keyof typeof dateFormats
): string => {
  const treatedDate = new Date(date)

  const day = treatedDate.getDate()
  const month = treatedDate.getMonth() + 1
  const year = treatedDate.getFullYear()

  return dateFormats[format](day, month < 10 ? `0${month}` : month, year)
}
