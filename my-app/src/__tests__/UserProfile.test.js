import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserProfile from '../UserProfile';

test('displays loading text while fetching user data', async () => {

    global.fetch = jest.fn().mockResolvedValueOnce(
        new Promise(resolve => setTimeout(() => resolve({
            ok: true,
            json: () => Promise.resolve({ name: 'John Doe', email: 'john.doe@example.com' })
        }), 1000)) // Add delay of 1 second
    );


    render(<UserProfile userId={1} />);


    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();


    await waitFor(() => expect(screen.getByText(/John Doe/i)).toBeInTheDocument());
});



test('displays an error message if the fetch fails', async () => {

    global.fetch = jest.fn(() =>
        Promise.reject(new Error('Failed to fetch user data'))
    );


    await act(async () => {
        render(<UserProfile userId={1} />);
    });


    await waitFor(() =>
        expect(screen.getByText(/Error: Failed to fetch user data/i)).toBeInTheDocument()
    );
});

test('displays user data when fetch is successful', async () => {
    const userData = { name: 'John Doe', email: 'john.doe@example.com' };


    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve(userData),
        })
    );


    await act(async () => {
        render(<UserProfile userId={1} />);
    });


    await waitFor(() =>
        expect(screen.getByText(/John Doe/i)).toBeInTheDocument()
    );
});
test('re-fetches data when userId changes', async () => {
    // Mock fetch to resolve with different user data for each call
    global.fetch = jest.fn()
        .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ name: 'John Doe', email: 'john.doe@example.com' })
        })
        .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ name: 'Jane Doe', email: 'jane.doe@example.com' })
        });

    const { rerender } = render(<UserProfile userId={1} />);

    // Initially check for John Doe
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/John Doe/i)).toBeInTheDocument());

    // Now re-render with a different userId
    rerender(<UserProfile userId={2} />);

    // Check for Jane Doe after re-render
    await waitFor(() => expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument());
    expect(screen.getByText(/Email: jane.doe@example.com/i)).toBeInTheDocument();
});
test('does not crash if userId prop is missing', () => {
    render(<UserProfile />); // No userId provided

    // Check for loading text, even without a userId
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
});