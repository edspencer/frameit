import type { LayoutComponent } from './types.js'
import { DefaultLayout } from './DefaultLayout.js'
import { ClassicLayout } from './ClassicLayout.js'
import { MinimalLayout } from './MinimalLayout.js'
import { PhotoEssayLayout } from './PhotoEssayLayout.js'
import { SidebarLayout } from './SidebarLayout.js'
import { AccentSplitLayout } from './AccentSplitLayout.js'
import { QuoteLayout } from './QuoteLayout.js'
import { FeatureCardLayout } from './FeatureCardLayout.js'
import { BottomTitleLayout } from './BottomTitleLayout.js'
import { SimpleCenteredLayout } from './SimpleCenteredLayout.js'
import { ListMySaasLayout } from './ListMySaasLayout.js'
import { DomainAndTitleLayout } from './DomainAndTitleLayout.js'
import { OGImageLayout } from './OGImageLayout.js'
import { CenteredLongLayout } from './CenteredLongLayout.js'
import { StackedTextRightLayout } from './StackedTextRightLayout.js'
import { FeaturedImageLeftLayout } from './FeaturedImageLeftLayout.js'

export type { LayoutProps, LayoutComponent } from './types.js'

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
