import { render, screen } from '@testing-library/react';

import { Loader } from './loader';

describe('Loader', () => {
    it('renders loading indicator', () => {
        render(<Loader />);

        expect(screen.getByTestId('loader')).toBeInTheDocument();
    });
});