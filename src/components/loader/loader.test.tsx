import { render, screen } from '@testing-library/react';

import { Loader } from './loader';

describe('Loader', () => {
    it('renders loading indicator', () => {
        render(<Loader />);

        expect(screen.getByText(/loading\.\.\./i)).toBeInTheDocument();
        expect(screen.getByText(/loading\.\.\./i).closest('.loader')).toBeInTheDocument();
    });
});