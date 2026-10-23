import {fireEvent, render, screen} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import App from './App'

describe('CareConnect routes', () => {
    let errorSpy: ReturnType<typeof vi.spyOn>
    let warningSpy: ReturnType<typeof vi.spyOn>

    beforeEach(() => {
        localStorage.clear()
        errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
        warningSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    })

    afterEach(() => {
        expect(errorSpy).not.toHaveBeenCalled()
        expect(warningSpy).not.toHaveBeenCalled()
        errorSpy.mockRestore()
        warningSpy.mockRestore()
    })

    it('renders the overview route and primary navigation', async () => {
        render(<MemoryRouter initialEntries={['/overview']}><App/></MemoryRouter>)
        expect(await screen.findByRole('heading', {name: 'Good morning, Jordan'})).toBeInTheDocument()
        expect(screen.getAllByRole('navigation', {name: 'Primary navigation'}).length).toBeGreaterThan(0)
    })

    it('renders a feature route', async () => {
        render(<MemoryRouter initialEntries={['/medications']}><App/></MemoryRouter>)
        expect(await screen.findByRole('heading', {name: 'Medications'})).toBeInTheDocument()
        expect(screen.getAllByText('Lisinopril').length).toBeGreaterThan(0)
    })

    it('navigates when an overview summary is activated', async () => {
        render(<MemoryRouter initialEntries={['/overview']}><App/></MemoryRouter>)
        fireEvent.click(await screen.findByRole('button', {name: /upcoming appointments/i}))
        expect(await screen.findByRole('heading', {name: 'Appointments'})).toBeInTheDocument()
    })

    it('distinguishes appointment search results and opens the matching tab', async () => {
        render(<MemoryRouter initialEntries={['/overview']}><App/></MemoryRouter>)
        fireEvent.change(await screen.findByRole('textbox', {name: 'Search CareConnect'}), {target: {value: 'sarah'}})
        const pastResult = await screen.findByRole('option', {name: /Dr. Sarah Chen.*Aug 12, 2026.*Past/i})
        fireEvent.click(pastResult)
        expect(await screen.findByRole('tab', {name: 'Past'})).toHaveAttribute('aria-selected', 'true')
        expect(screen.getByText(/Aug 12, 2026/)).toBeInTheDocument()
    })

    it('supports the mobile list-to-thread message workflow', async () => {
        render(<MemoryRouter initialEntries={['/messages']}><App/></MemoryRouter>)
        fireEvent.click(await screen.findByRole('button', {name: /dr. sarah chen/i}))
        expect(screen.getByRole('button', {name: /back to messages/i})).toBeInTheDocument()
        expect(screen.getByRole('heading', {name: 'Your recent lab results'})).toBeInTheDocument()
        expect(screen.queryByText('Hi Jordan,')).not.toBeInTheDocument()
    })
})
