import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('CareConnect routes', () => {
  it('renders the overview route and primary navigation', async () => {
    render(<MemoryRouter initialEntries={['/overview']}><App /></MemoryRouter>)
    expect(await screen.findByRole('heading', { name: 'Good morning, Jordan' })).toBeInTheDocument()
    expect(screen.getAllByRole('navigation', { name: 'Primary navigation' }).length).toBeGreaterThan(0)
  })

  it('renders a feature route', async () => {
    render(<MemoryRouter initialEntries={['/medications']}><App /></MemoryRouter>)
    expect(await screen.findByRole('heading', { name: 'Medications' })).toBeInTheDocument()
    expect(screen.getAllByText('Lisinopril').length).toBeGreaterThan(0)
  })
})
