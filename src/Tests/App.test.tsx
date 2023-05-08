import React from 'react';
import {render, screen} from '@testing-library/react';
import LogReader from '../LogReader/LogReader';

test('renders learn react link', () => {
    render(<LogReader/>);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
});
