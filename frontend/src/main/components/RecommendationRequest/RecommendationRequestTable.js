import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/RecommendationRequestUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function RecommendationRequestTable({ requests, currentUser }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/recommendationrequests/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/recommendationrequests/all"]
    );
    // Stryker restore all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }


    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'Requestor Email',
            accessor: 'requestorEmail',
        },
        {
            Header: 'Professor Email',
            accessor: 'professorEmail',
        },
        {
            Header: 'Explanation',
            accessor: 'explanation',
        },
        {
            Header: 'Date Requested',
            accessor: 'dateRequested',
        },
        {
            Header: 'Date Needed',
            accessor: 'dateNeeded',
        },
        {
            Header: 'Done',
            accessor: 'done',
        }
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, "RecommendationRequestTable"));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, "RecommendationRequestTable"));
    } 

    return <OurTable
        data={requests}
        columns={columns}
        testid={"RecommendationRequestTable"}
    />;
};