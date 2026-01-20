export interface BreadcrumbItem {
  label: string
  name?: string
}

export type LanguageType = 'chinese' | 'vietnamese'

const languageConfig: Record<LanguageType, { homeRoute: string; label: string }> = {
  chinese: { homeRoute: 'ChineseHome', label: 'Chinese' },
  vietnamese: { homeRoute: 'VietnameseHome', label: 'Vietnamese' },
}

export function getLanguageBreadcrumbs(
  language: LanguageType,
  page?: { name: string; label: string },
): BreadcrumbItem[] {
  const config = languageConfig[language]
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Home', label: 'Home' },
    { name: config.homeRoute, label: config.label },
  ]

  if (page) {
    breadcrumbs.push({ name: page.name, label: page.label })
  }

  return breadcrumbs
}
