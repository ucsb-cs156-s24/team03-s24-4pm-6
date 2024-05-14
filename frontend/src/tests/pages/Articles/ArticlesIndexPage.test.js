import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ArticlesIndexPage from "main/pages/Articles/ArticlesIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";
import { articlesFixtures } from "fixtures/articlesFixtures";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("ArticlesIndexPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "ArticlesTable";

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };


    const queryClient = new QueryClient();

    test("Renders with Create Button for admin user", async () => {
        setupAdminUser();
        axiosMock.onGet("/api/articles/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticlesIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Create Articles/)).toBeInTheDocument();
        });
        const button = screen.getByText(/Create Articles/);
        expect(button).toHaveAttribute("href", "/articles/create");
        expect(button).toHaveAttribute("style", "float: right;");
    });

    test("renders three articles correctly for regular user", async () => {
        setupUserOnly();
        axiosMock.onGet("/api/articles/all").reply(200, articlesFixtures.threeArticles);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticlesIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2"); });
        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("4");

        const createArticlesButton = screen.queryByText("Create Articles");
        expect(createArticlesButton).not.toBeInTheDocument();

	const titleField = screen.getByText("Article 2");
   	const urlField = screen.getByText("127.0.0.1/article3.html");
       	const explanationField = screen.getByText("This is Article 2");
        const emailField = screen.getByText("anon@127.0.0.1");
        //const dateAddedField = screen.getAllByText("1970-01-01T00:00");

        expect(titleField).toBeInTheDocument();
        //expect(titleField).toHaveValue("Article 2");
        expect(urlField).toBeInTheDocument();
        //expect(urlField).toHaveValue("127.0.0.1/article3.html");
        expect(explanationField).toBeInTheDocument();
        //expect(explanationField).toHaveValue("This is Article 2");
        expect(emailField).toBeInTheDocument();
        //expect(emailField).toHaveValue("anon@127.0.0.1");
        //expect(dateAddedField).toBeInTheDocument();
        //expect(dateAddedField).toHaveValue("1970-01-01T00:00");

        // for non-admin users, details button is visible, but the edit and delete buttons should not be visible
        expect(screen.queryByTestId("ArticlesTable-cell-row-0-col-Delete-button")).not.toBeInTheDocument();
        expect(screen.queryByTestId("ArticlesTable-cell-row-0-col-Edit-button")).not.toBeInTheDocument();
    });

    test("renders empty table when backend unavailable, user only", async () => {
        setupUserOnly();

        axiosMock.onGet("/api/articles/all").timeout();

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticlesIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });
        
        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch("Error communicating with backend via GET on /api/articles/all");
        restoreConsole();

    });

    test("what happens when you click delete, admin", async () => {
        setupAdminUser();

        axiosMock.onGet("/api/articles/all").reply(200, articlesFixtures.threeArticles);
        axiosMock.onDelete("/api/articles").reply(200, "Article with id 1 was deleted");


        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticlesIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument(); });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");


        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();

        fireEvent.click(deleteButton);

        await waitFor(() => { expect(mockToast).toBeCalledWith("Article with id 1 was deleted") });

        await waitFor(() => { expect(axiosMock.history.delete.length).toBe(1); });
        expect(axiosMock.history.delete[0].url).toBe("/api/articles");
        expect(axiosMock.history.delete[0].url).toBe("/api/articles");
        expect(axiosMock.history.delete[0].params).toEqual({ id: 2 });
    });

});


