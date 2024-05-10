import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import UCSBDiningCommonsMenuItemForm from 'main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm';
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBDiningCommonsMenuItemEditPage({storybook=false}) {
    let { id } = useParams();

    const { data: menuItem, _error, _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/UCSBDiningCommonsMenuItem?id=${id}`],
            {  // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
                method: "GET",
                url: `/api/UCSBDiningCommonsMenuItem`,
                params: {
                    id
                }
            }
        );

    const objectToAxiosPutParams = (menuItem) => ({
        url: "/api/UCSBDiningCommonsMenuItem",
        method: "PUT",
        params: {
            id: menuItem.id,
        },
        data: {
            name: menuItem.name,
            diningCommonsCode: menuItem.diningCommonsCode,
            station: menuItem.station,
        }
    });

    const onSuccess = (menuItem) => {
        toast(`UCSBDiningCommonsMenuItem Updated - id: ${menuItem.id} name: ${menuItem.name} diningCommonsCode: ${menuItem.diningCommonsCode} station: ${menuItem.station}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/UCSBDiningCommonsMenuItem?id=${id}`]
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess && !storybook) {
        return <Navigate to="/diningcommonsmenuitem" />
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit UCSBDiningCommonsMenuItem</h1>
                {
                    menuItem && <UCSBDiningCommonsMenuItemForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={menuItem} />
                }
            </div>
        </BasicLayout>
    )

}