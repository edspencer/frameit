import type { LayoutComponent } from './types'
import { DefaultLayout } from './DefaultLayout'
import { ClassicLayout } from './ClassicLayout'
import { MinimalLayout } from './MinimalLayout'
import { PhotoEssayLayout } from './PhotoEssayLayout'
import { SidebarLayout } from './SidebarLayout'
import { AccentSplitLayout } from './AccentSplitLayout'
import { QuoteLayout } from './QuoteLayout'
import { FeatureCardLayout } from './FeatureCardLayout'
import { BottomTitleLayout } from './BottomTitleLayout'
import { SimpleCenteredLayout } from './SimpleCenteredLayout'
import { ListMySaasLayout } from './ListMySaasLayout'
import { DomainAndTitleLayout } from './DomainAndTitleLayout'
import { OGImageLayout } from './OGImageLayout'
import { CenteredLongLayout } from './CenteredLongLayout'
import { StackedTextRightLayout } from './StackedTextRightLayout'
import { FeaturedImageLeftLayout } from './FeaturedImageLeftLayout'

export type { LayoutProps, LayoutComponent } from './types'

// Layout registry - maps layout IDs to JSX components
export const LAYOUT_COMPONENTS: Record<string, LayoutComponent> = {
  'default': DefaultLayout,
  'classic': ClassicLayout,
  'minimal': MinimalLayout,
  'photo-essay': PhotoEssayLayout,
  'sidebar': SidebarLayout,
  'accent-split': AccentSplitLayout,
  'quote': QuoteLayout,
  'feature-card': FeatureCardLayout,
  'bottom-title': BottomTitleLayout,
  'simple-centered': SimpleCenteredLayout,
  'listmysaas': ListMySaasLayout,
  'domain-and-title': DomainAndTitleLayout,
  'ogimage': OGImageLayout,
  'centered-long': CenteredLongLayout,
  'stacked-text-right': StackedTextRightLayout,
  'featured-image-left': FeaturedImageLeftLayout,
}

export function getLayoutComponent(layoutId: string): LayoutComponent {
  return LAYOUT_COMPONENTS[layoutId] || LAYOUT_COMPONENTS['default']
}
