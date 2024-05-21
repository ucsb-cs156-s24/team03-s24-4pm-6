import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const testId = "ArticlesForm";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("ArticlesEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/articles", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Articles");
            expect(screen.queryByTestId("Articles-title")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/articles", { params: { id: 17 } }).reply(200, {
                id: 17,
            	title: "Article 3",
           	url: "127.0.0.1/article3.html",
            	explanation: "This is Article 3",
            	email: "anon@127.0.0.1",
            	dateAdded: "1970-01-01T00:00"
            });
            axiosMock.onPut('/api/articles').reply(200, {
                id: "17",
            	title: "Article 3",
           	url: "127.0.0.1/article3.html",
            	explanation: "This is Article 3",
            	email: "anon@127.0.0.1",
            	dateAdded: "1970-01-01T00:00"
            });
        });

        const queryClient = new QueryClient();
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("ArticlesForm-id");

            const idField = screen.getByTestId("ArticlesForm-id");
     	    const titleField = screen.getByTestId(`${testId}-title`);
   	    const urlField = screen.getByTestId(`${testId}-url`);
       	    const explanationField = screen.getByTestId(`${testId}-explanation`);
            const emailField = screen.getByTestId(`${testId}-email`);
            const dateAddedField = screen.getByTestId(`${testId}-dateAdded`);
            const submitButton = screen.getByTestId(`${testId}-submit`);

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("17");
            expect(titleField).toBeInTheDocument();
            expect(titleField).toHaveValue("Article 3");
            expect(urlField).toBeInTheDocument();
            expect(urlField).toHaveValue("127.0.0.1/article3.html");
            expect(explanationField).toBeInTheDocument();
            expect(explanationField).toHaveValue("This is Article 3");
            expect(emailField).toBeInTheDocument();
            expect(emailField).toHaveValue("anon@127.0.0.1");
            expect(dateAddedField).toBeInTheDocument();
            expect(dateAddedField).toHaveValue("1970-01-01T00:00");

            expect(submitButton).toHaveTextContent("Update");

     	    fireEvent.change(titleField, { target: { value: 'Article 3' } });
      	    fireEvent.change(urlField, { target: { value: '127.0.0.1/article3.html' } });
    	    fireEvent.change(explanationField, { target: { value: 'This is Article 3' } });
   	    fireEvent.change(emailField, { target: { value: 'anon@127.0.0.1' } });                
   	    fireEvent.change(dateAddedField, { target: { value: '1970-01-01T00:00' } });
    	    fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Article Updated - id: 17 title: Article 3");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/articles" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
            	title: "Article 3",
           	url: "127.0.0.1/article3.html",
            	explanation: "This is Article 3",
            	email: "anon@127.0.0.1",
            	dateAdded: "1970-01-01T00:00"
            })); // posted object


        });
/*
        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RestaurantEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("RestaurantForm-id");

            const idField = screen.getByTestId("RestaurantForm-id");
            const nameField = screen.getByTestId("RestaurantForm-name");
            const descriptionField = screen.getByTestId("RestaurantForm-description");
            const submitButton = screen.getByTestId("RestaurantForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("Freebirds");
            expect(descriptionField).toHaveValue("Burritos");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(nameField, { target: { value: 'Freebirds World Burrito' } })
            fireEvent.change(descriptionField, { target: { value: 'Big Burritos' } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Restaurant Updated - id: 17 name: Freebirds World Burrito");
            expect(mockNavigate).toBeCalledWith({ "to": "/restaurants" });
        });
*/
       
    });
});
