import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "main/pages/HomePage";
import ProfilePage from "main/pages/ProfilePage";
import AdminUsersPage from "main/pages/AdminUsersPage";

import UCSBDatesIndexPage from "main/pages/UCSBDates/UCSBDatesIndexPage";
import UCSBDatesCreatePage from "main/pages/UCSBDates/UCSBDatesCreatePage";
import UCSBDatesEditPage from "main/pages/UCSBDates/UCSBDatesEditPage";

import UCSBOrganizationIndexPage from "main/pages/UCSBOrganization/UCSBOrganizationIndexPage";
import UCSBOrganizationCreatePage from "main/pages/UCSBOrganization/UCSBOrganizationCreatePage";
import UCSBOrganizationEditPage from "main/pages/UCSBOrganization/UCSBOrganizationEditPage";

import RestaurantIndexPage from "main/pages/Restaurants/RestaurantIndexPage";
import RestaurantCreatePage from "main/pages/Restaurants/RestaurantCreatePage";
import RestaurantEditPage from "main/pages/Restaurants/RestaurantEditPage";

import PlaceholderIndexPage from "main/pages/Placeholder/PlaceholderIndexPage";
import PlaceholderCreatePage from "main/pages/Placeholder/PlaceholderCreatePage";
import PlaceholderEditPage from "main/pages/Placeholder/PlaceholderEditPage";


import { hasRole, useCurrentUser } from "main/utils/currentUser";

import "bootstrap/dist/css/bootstrap.css";

function App() {
  const { data: currentUser } = useCurrentUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/profile" element={<ProfilePage />} />
        {
          hasRole(currentUser, "ROLE_ADMIN") && <Route exact path="/admin/users" element={<AdminUsersPage />} />
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/ucsbdates" element={<UCSBDatesIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/ucsbdates/edit/:id" element={<UCSBDatesEditPage />} />
              <Route exact path="/ucsbdates/create" element={<UCSBDatesCreatePage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/ucsborganization" element={<UCSBOrganizationIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/ucsborganization/edit/1" element={<UCSBOrganizationEditPage />} />
              <Route exact path="/ucsborganization/create" element={<UCSBOrganizationCreatePage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/restaurants" element={<RestaurantIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/restaurants/edit/:id" element={<RestaurantEditPage />} />
              <Route exact path="/restaurants/create" element={<RestaurantCreatePage />} />
            </>
          )
        }
         {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/placeholder" element={<PlaceholderIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/placeholder/edit/:id" element={<PlaceholderEditPage />} />
              <Route exact path="/placeholder/create" element={<PlaceholderCreatePage />} />
            </>
          )
        }
      </Routes>
    </BrowserRouter>
  );
}

export default App;
