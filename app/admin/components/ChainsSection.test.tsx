import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

// Create mock functions
const mockOrder = vi.fn()
const mockInsert = vi.fn()
const mockEq = vi.fn()

// Mock supabase before importing the component
vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        order: mockOrder,
      }),
      update: () => ({
        eq: mockEq,
      }),
      insert: mockInsert,
      delete: () => ({
        eq: mockEq,
      }),
    }),
  },
}))

import ChainsSection from './ChainsSection'

describe('ChainsSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockOrder.mockReset()
    mockEq.mockReset()
    mockInsert.mockReset()
  })

  it('renders collapsed by default', () => {
    render(<ChainsSection />)
    expect(screen.getByText('Chains')).toBeDefined()
    expect(screen.queryByText('Add New Chain')).toBeNull()
  })

  it('expands when clicked and shows loading state', async () => {
    mockOrder.mockImplementation(() =>
      new Promise((resolve) => setTimeout(() => resolve({ data: [], error: null }), 100))
    )

    render(<ChainsSection />)
    const header = screen.getByText('Chains')
    fireEvent.click(header)

    // Should show expanded content with loading skeletons
    expect(screen.getByText('+ Add Chain')).toBeDefined()
  })

  it('displays chains after loading', async () => {
    const mockChains = [
      { id: 'ethereum', name: 'Ethereum', icon: 'eth.svg', explorer_prefix: 'https://etherscan.io/token/' },
      { id: 'solana', name: 'Solana', icon: 'sol.svg', explorer_prefix: 'https://solscan.io/token/' },
    ]

    mockOrder.mockResolvedValue({ data: mockChains, error: null })

    render(<ChainsSection />)
    const header = screen.getByText('Chains')
    fireEvent.click(header)

    await waitFor(() => {
      expect(screen.getByText('ethereum')).toBeDefined()
      expect(screen.getByText('solana')).toBeDefined()
    })

    expect(screen.getByDisplayValue('Ethereum')).toBeDefined()
    expect(screen.getByDisplayValue('Solana')).toBeDefined()
  })

  it('shows empty state when no chains', async () => {
    mockOrder.mockResolvedValue({ data: [], error: null })

    render(<ChainsSection />)
    const header = screen.getByText('Chains')
    fireEvent.click(header)

    await waitFor(() => {
      expect(screen.getByText('No chains found')).toBeDefined()
    })
  })

  it('shows error message on fetch failure', async () => {
    mockOrder.mockResolvedValue({ data: null, error: { message: 'Database error' } })

    render(<ChainsSection />)
    const header = screen.getByText('Chains')
    fireEvent.click(header)

    await waitFor(() => {
      expect(screen.getByText('Database error')).toBeDefined()
    })
  })

  it('updates a chain when save is clicked', async () => {
    const mockChains = [
      { id: 'ethereum', name: 'Ethereum', icon: 'eth.svg', explorer_prefix: 'https://etherscan.io/token/' },
    ]

    mockOrder.mockResolvedValue({ data: mockChains, error: null })
    mockEq.mockResolvedValue({ error: null })

    render(<ChainsSection />)
    fireEvent.click(screen.getByText('Chains'))

    await waitFor(() => {
      expect(screen.getByDisplayValue('Ethereum')).toBeDefined()
    })

    const nameInput = screen.getByDisplayValue('Ethereum')
    fireEvent.change(nameInput, { target: { value: 'Ethereum Mainnet' } })

    const saveButton = screen.getByText('Save Changes')
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText('Chain updated successfully')).toBeDefined()
    })
  })

  it('shows add chain form when add button is clicked', async () => {
    mockOrder.mockResolvedValue({ data: [], error: null })

    render(<ChainsSection />)
    fireEvent.click(screen.getByText('Chains'))

    await waitFor(() => {
      expect(screen.getByText('No chains found')).toBeDefined()
    })

    fireEvent.click(screen.getByText('+ Add Chain'))

    expect(screen.getByText('Add New Chain')).toBeDefined()
    expect(screen.getByPlaceholderText('e.g. ethereum')).toBeDefined()
    expect(screen.getByPlaceholderText('e.g. Ethereum')).toBeDefined()
  })

  it('adds a new chain', async () => {
    mockOrder.mockResolvedValue({ data: [], error: null })
    mockInsert.mockResolvedValue({ error: null })

    render(<ChainsSection />)
    fireEvent.click(screen.getByText('Chains'))

    await waitFor(() => {
      expect(screen.getByText('No chains found')).toBeDefined()
    })

    fireEvent.click(screen.getByText('+ Add Chain'))

    const idInput = screen.getByPlaceholderText('e.g. ethereum')
    const nameInput = screen.getByPlaceholderText('e.g. Ethereum')

    fireEvent.change(idInput, { target: { value: 'polygon' } })
    fireEvent.change(nameInput, { target: { value: 'Polygon' } })

    fireEvent.click(screen.getByText('Add Chain'))

    await waitFor(() => {
      expect(screen.getByText('Chain added successfully')).toBeDefined()
    })

    expect(mockInsert).toHaveBeenCalledWith({
      id: 'polygon',
      name: 'Polygon',
      icon: null,
      explorer_prefix: null,
    })
  })

  it('validates required fields when adding chain', async () => {
    mockOrder.mockResolvedValue({ data: [], error: null })

    render(<ChainsSection />)
    fireEvent.click(screen.getByText('Chains'))

    await waitFor(() => {
      expect(screen.getByText('No chains found')).toBeDefined()
    })

    fireEvent.click(screen.getByText('+ Add Chain'))
    fireEvent.click(screen.getByText('Add Chain'))

    await waitFor(() => {
      expect(screen.getByText('ID and Name are required')).toBeDefined()
    })
  })

  it('deletes a chain after confirmation', async () => {
    const mockChains = [
      { id: 'ethereum', name: 'Ethereum', icon: 'eth.svg', explorer_prefix: 'https://etherscan.io/token/' },
    ]

    mockOrder.mockResolvedValue({ data: mockChains, error: null })
    mockEq.mockResolvedValue({ error: null })

    vi.stubGlobal('confirm', vi.fn(() => true))

    render(<ChainsSection />)
    fireEvent.click(screen.getByText('Chains'))

    await waitFor(() => {
      expect(screen.getByText('ethereum')).toBeDefined()
    })

    fireEvent.click(screen.getByText('Delete'))

    await waitFor(() => {
      expect(screen.getByText('Chain deleted successfully')).toBeDefined()
    })
  })

  it('does not delete chain when cancelled', async () => {
    const mockChains = [
      { id: 'ethereum', name: 'Ethereum', icon: 'eth.svg', explorer_prefix: 'https://etherscan.io/token/' },
    ]

    mockOrder.mockResolvedValue({ data: mockChains, error: null })

    vi.stubGlobal('confirm', vi.fn(() => false))

    render(<ChainsSection />)
    fireEvent.click(screen.getByText('Chains'))

    await waitFor(() => {
      expect(screen.getByText('ethereum')).toBeDefined()
    })

    fireEvent.click(screen.getByText('Delete'))

    expect(mockEq).not.toHaveBeenCalled()
  })

  it('shows chain count badge', async () => {
    const mockChains = [
      { id: 'ethereum', name: 'Ethereum', icon: 'eth.svg', explorer_prefix: 'https://etherscan.io/token/' },
      { id: 'solana', name: 'Solana', icon: 'sol.svg', explorer_prefix: 'https://solscan.io/token/' },
    ]

    mockOrder.mockResolvedValue({ data: mockChains, error: null })

    render(<ChainsSection />)
    fireEvent.click(screen.getByText('Chains'))

    await waitFor(() => {
      expect(screen.getByText('2')).toBeDefined()
    })
  })

  it('collapses when clicked again', async () => {
    mockOrder.mockResolvedValue({ data: [], error: null })

    render(<ChainsSection />)
    const header = screen.getByText('Chains')

    fireEvent.click(header)
    await waitFor(() => {
      expect(screen.getByText('No chains found')).toBeDefined()
    })

    fireEvent.click(header)
    expect(screen.queryByText('No chains found')).toBeNull()
  })
})
