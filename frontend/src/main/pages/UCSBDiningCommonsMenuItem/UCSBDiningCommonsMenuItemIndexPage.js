import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBDiningCommonsMenuItemTable from 'main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemTable';
import { useCurrentUser , hasRole} from 'main/utils/currentUser'
import { Button } from 'react-bootstrap';

export default function UCSBDiningCommonsMenuItemIndexPage() {

    const currentUser = useCurrentUser();

    const { data: menuItems, error: _error, status: _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            ["/api/UCSBDiningCommonsMenuItem/all"],
            { method: "GET", url: "/api/UCSBDiningCommonsMenuItem/all" },
            // Stryker disable next-line all : don't test default value of empty list
            []
        );

    const createButton = () => {
        if (hasRole(currentUser, "ROLE_ADMIN")) {
            return (
                <Button
                    variant="primary"
                    href="/diningcommonsmenuitem/create"
                    style={{ float: "right" }}
                >
                    Create UCSBDiningCommonsMenuItem
                </Button>
            )
        } 
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                {createButton()}
                <h1>UCSBDiningCommonsMenuItems</h1>
                <UCSBDiningCommonsMenuItemTable menuItems={menuItems} currentUser={currentUser} />
            </div>
        </BasicLayout>
    );
}