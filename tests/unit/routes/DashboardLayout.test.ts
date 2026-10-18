import React from 'react'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, useLocation } from 'react-router-dom'

const mockStore = vi.hoisted(() => {
  const state = {
    connectedAddress: null as string | null,
    network: { networkId: 'testnet' },
    activeTab: 'wallet',
    theme: 'dark',
    isMobileMenuOpen: false,
    preferencesOpen: false,
    debugAssistantOpen: false,
    debugAssistantIssueCount: 0,
    isDemoMode: false,
    setMobileMenuOpen: vi.fn(),
    setActiveTab: vi.fn(),
    setConnectedAddress: vi.fn(),
    setContractId: vi.fn(),
    setSelectedTxHash: vi.fn(),
    setPreferencesOpen: vi.fn(),
    toggleDebugAssistant: vi.fn(),
    exitDemoMode: vi.fn(),
  }
  const hook = Object.assign(() => state, { getState: () => state })
  return { state, hook }
})

vi.mock('../../../src/lib/store', () => ({ useStore: mockStore.hook }))
vi.mock('../../../src/hooks/useResponsive', () => ({ useResponsive: () => ({ isMobile: false, isTablet: false }) }))
vi.mock('../../../src/hooks/useRealTimeNotifications', () => ({ useRealTimeNotifications: () => ({ unreadCount: 0 }) }))
vi.mock('../../../src/hooks/useWriteGuard', () => ({ useWriteGuard: () => ({ isReadOnlyLocked: false, lockReadOnly: vi.fn(), unlockReadOnly: vi.fn() }) }))
vi.mock('../../../src/hooks/useSwipeGesture', () => ({ useSwipeGesture: () => null }))
vi.mock('../../../src/hooks/useRouteFocus', () => ({ useRouteFocus: vi.fn() }))
vi.mock('../../../src/hooks/useStorageQuotaAlerts', () => ({ useStorageQuotaAlerts: vi.fn() }))
vi.mock('../../../src/hooks/useExpertiseTracking', () => ({ useExpertiseTracking: () => ({ trackFeatureInteraction: vi.fn() }) }))
vi.mock('../../../src/hooks/useWalletSessionListeners', () => ({ useWalletSessionListeners: vi.fn() }))
vi.mock('../../../src/hooks/useSharedView', () => ({ useSharedView: () => ({ exitSharedView: vi.fn(), switchToSnapshotNetwork: vi.fn() }) }))
vi.mock('../../../src/context/ExpertiseContext', () => ({ useExpertise: () => ({ level: 'novice', isNovice: true, setLevel: vi.fn(), updateSignals: vi.fn() }) }))
vi.mock('../../../src/context/AIKillSwitchContext', () => ({ useAIKillSwitch: () => ({ enabled: false, ready: true }) }))
vi.mock('../../../src/lib/cacheInit', () => ({ initCache: vi.fn(async () => undefined) }))
vi.mock('../../../src/lib/errorReporting', () => ({ initializeErrorReporting: vi.fn(), addBreadcrumb: vi.fn() }))
vi.mock('../../../src/lib/securityEvents', () => ({ installSecurityEventListeners: vi.fn(), trackSecurityEvent: vi.fn(), SecurityEventType: { CONFIG_CHANGED: 'config_changed' } }))
vi.mock('../../../src/lib/demoMode', () => ({ DEMO_MODE_LABEL: 'Demo', DEMO_MODE_BADGE: 'DEMO', getDemoFixtureSummarySafe: vi.fn() }))
vi.mock('../../../src/routes/routeComponents', () => ({
  getRouteComponent: (routeId: string) => () => `${routeId}-route-content`,
}))

vi.mock('../../../src/components/layout/Sidebar', () => ({ default: () => null }))
vi.mock('../../../src/components/layout/MobileHeader', () => ({ default: () => null }))
vi.mock('../../../src/components/layout/MobileSidebar', () => ({ default: () => null }))
vi.mock('../../../src/components/dashboard/ConnectPanel', () => ({ default: () => 'connect-panel' }))
vi.mock('../../../src/components/dashboard/PriceTicker', () => ({ default: () => null }))
vi.mock('../../../src/components/notifications/RealTimeNotificationCenter', () => ({ default: () => null }))
vi.mock('../../../src/components/tutorial', () => ({ TourLauncher: () => null }))
vi.mock('../../../src/components/search/GlobalSearch', () => ({ default: () => null }))
vi.mock('../../../src/components/preferences/UserPreferences', () => ({ default: () => null }))
vi.mock('../../../src/components/layout/NetworkIndicator', () => ({ default: () => null }))
vi.mock('../../../src/components/layout/NetworkSafetyBadge', () => ({ default: () => null }))
vi.mock('../../../src/components/dashboard/SubmissionTray', () => ({ default: () => null }))
vi.mock('../../../src/components/accessibility/KeyboardNavigation', () => ({ default: () => null }))
vi.mock('../../../src/components/accessibility/SkipLink', () => ({ default: () => null }))
vi.mock('../../../src/components/accessibility/FocusManager', () => ({ default: ({ children }: { children: React.ReactNode }) => children }))
vi.mock('../../../src/components/layout/ThemeToggle', () => ({ default: () => null }))
vi.mock('../../../src/components/layout/OfflineBanner', () => ({ default: () => null }))
vi.mock('../../../src/components/PWAInstallBanner', () => ({ default: () => null }))
vi.mock('../../../src/components/SWUpdatePrompt', () => ({ default: () => null }))
vi.mock('../../../src/components/security/WalletIdlePrompt', () => ({ default: () => null }))
vi.mock('../../../src/components/dashboard/DevToolbar', () => ({ default: () => null }))
vi.mock('../../../src/components/debug/DebugAssistantButton', () => ({ default: () => null }))
vi.mock('../../../src/components/debug/DebugAssistantPanel', () => ({ default: () => null }))
vi.mock('../../../src/components/conversation/ConversationPanel', () => ({ default: () => null }))
vi.mock('../../../src/components/expertise/ExpertiseBadge', () => ({ default: () => null }))
vi.mock('../../../src/components/dashboard/PredictiveFeatureSuggestions', () => ({ default: () => null }))
vi.mock('../../../src/components/ai/TipButton', () => ({ default: () => null }))
vi.mock('../../../src/components/share/ShareViewButton', () => ({ default: () => null }))
vi.mock('../../../src/components/share/SharedViewBanner', () => ({ default: () => null }))
vi.mock('../../../src/components/ErrorBoundary', () => ({ default: ({ children }: { children: React.ReactNode }) => children }))
vi.mock('../../../src/components/routes/RouteErrorBoundary', () => ({ default: ({ children }: { children: React.ReactNode }) => children }))
vi.mock('../../../src/routes/NotFound', () => ({ default: () => 'not-found' }))
vi.mock('../../../src/design-system/components', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => children,
  Card: ({ children }: { children: React.ReactNode }) => children,
  Skeleton: () => null,
  Stack: ({ children }: { children: React.ReactNode }) => children,
}))

import DashboardLayout from '../../../src/routes/DashboardLayout'

function LocationProbe() {
  const { pathname } = useLocation()
  return React.createElement('div', { 'data-testid': 'pathname' }, pathname)
}

function renderLayout(path: string) {
  mockStore.state.activeTab = path === '/wallet' ? 'wallet' : 'overview'
  return render(React.createElement(
    MemoryRouter,
    { initialEntries: [path] },
    React.createElement(React.Fragment, null,
      React.createElement(DashboardLayout),
      React.createElement(LocationProbe),
    ),
  ))
}

beforeEach(() => {
  vi.clearAllMocks()
  mockStore.state.connectedAddress = null
})

afterEach(() => cleanup())

describe('DashboardLayout connection gate', () => {
  it('keeps a disconnected user on the wallet route', async () => {
    renderLayout('/wallet')

    await waitFor(() => expect(screen.getByTestId('pathname')).toHaveTextContent('/wallet'))
    expect(screen.getByText('wallet-route-content')).toBeInTheDocument()
    expect(screen.queryByText('connect-panel')).not.toBeInTheDocument()
  })

  it('redirects a disconnected user from other routes to connect', async () => {
    renderLayout('/overview')

    await waitFor(() => expect(screen.getByTestId('pathname')).toHaveTextContent('/connect'))
    expect(screen.getByText('connect-panel')).toBeInTheDocument()
  })
})
