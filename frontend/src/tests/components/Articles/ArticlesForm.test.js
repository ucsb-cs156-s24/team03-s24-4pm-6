import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import ArticlesForm from "main/components/Articles/ArticlesForm";
import { articlesFixtures } from "fixtures/articlesFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("ArticlesForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Title", "URL", "Explanation", "E-Mail", "Date Added (iso format)"];
    const testId = "ArticlesForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ArticlesForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ArticlesForm initialContents={articlesFixtures.oneArticles} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
        expect(screen.getByText(`Id`)).toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ArticlesForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });
    
       test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <ArticlesForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId(`${testId}-title`);

        const titleField = screen.getByTestId(`${testId}-title`);
        const urlField = screen.getByTestId(`${testId}-url`);
        const explanationField = screen.getByTestId(`${testId}-explanation`);
        const emailField = screen.getByTestId(`${testId}-email`);
        const dateAddedField = screen.getByTestId(`${testId}-dateAdded`);
        const submitButton = screen.getByTestId(`${testId}-submit`);

        fireEvent.change(titleField, { target: { value: 'Article 2' } });
        fireEvent.change(urlField, { target: { value: '127.0.0.1/article2.html' } });
        fireEvent.change(explanationField, { target: { value: 'This is Article 2' } });
        fireEvent.change(emailField, { target: { value: 'anon@127.0.0.1' } });                
        fireEvent.change(dateAddedField, { target: { value: '1970-01-01T00:00' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());
        
        expect(screen.queryByText(/Title is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/URL is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Explanation is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/E-Mail is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Date is required. /)).not.toBeInTheDocument();

    }); 
    
      test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <ArticlesForm />
            </Router>   
        );
        
        await screen.findByTestId(`${testId}-submit`);
        const submitButton = screen.getByTestId(`${testId}-submit`);

        fireEvent.click(submitButton);

        await screen.findByText(/Title is required./);
        //expect(screen.queryByText(/Title is required./)).toBeInTheDocument();
        expect(screen.getByText(/URL is required./)).toBeInTheDocument();
        expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
        expect(screen.getByText(/E-Mail is required./)).toBeInTheDocument();
        expect(screen.getByText(/Date is required./)).toBeInTheDocument();

    });

});
