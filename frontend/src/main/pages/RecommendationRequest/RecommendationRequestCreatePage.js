import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RecommendationRequestCreatePage({storybook=false}) {

  const objectToAxiosParams = (recommendationRequest) => ({
    url: "/api/recommendationrequests/post",
    method: "POST",
    params: {
      requestorEmail: recommendationRequest.requestorEmail,
      professorEmail: recommendationRequest.professorEmail, 
      explanation: recommendationRequest.explanation,
      dateRequested: recommendationRequest.dateRequested,
      dateNeeded: recommendationRequest.dateNeeded,
      done: recommendationRequest.done
    }
  });

  const onSuccess = (recommendationRequest) => {
    toast(`New recommendationRequest Created - id: ${recommendationRequest.id} requestorEmail: ${recommendationRequest.requestorEmail}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/recommendationrequests/all"]
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/recommendationrequests" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New RecommendationRequest</h1>

        <RecommendationRequestForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  )
}