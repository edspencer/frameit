/**
 * UI State Management - Persists user interface preferences to localStorage
 * Separate from thumbnail config to keep concerns separated
 */

const UI_STATE_STORAGE_KEY = 'thumbnailGeneratorUIState'

export interface UIState {
  collapsedSections: Record<string, boolean> // sectionId -> isExpanded
}

function getDefaultUIState(): UIState {
  return {
    collapsedSections: {
      // Default all sections to expanded
      platform: true,
      layout: true,
      gradient: true,
    }
  }
}

export function loadUIState(): UIState {
  try {
    const stored = localStorage.getItem(UI_STATE_STORAGE_KEY)
    if (!stored) return getDefaultUIState()

    const parsed = JSON.parse(stored)
    return {
      collapsedSections: parsed.collapsedSections || {},
    }
  } catch (err) {
    console.error('Failed to load UI state:', err)
    return getDefaultUIState()
  }
}

export function saveUIState(state: UIState): void {
  try {
    localStorage.setItem(UI_STATE_STORAGE_KEY, JSON.stringify(state))
  } catch (err) {
    console.error('Failed to save UI state:', err)
  }
}

export function getSectionExpandedState(sectionId: string, defaultExpanded = true): boolean {
  const state = loadUIState()
  return state.collapsedSections[sectionId] ?? defaultExpanded
}

export function setSectionExpandedState(sectionId: string, isExpanded: boolean): void {
  const state = loadUIState()
  state.collapsedSections[sectionId] = isExpanded
  saveUIState(state)
}
