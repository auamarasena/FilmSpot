import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import { AuthProvider } from "./context/AuthContext";

//Layout component
import Layout from "./components/Layout/Layout";

//Page components
import Home from "./components/Home/Home";
import Aboutus from "./components/AboutUs/About";
import Offer from "./components/Offer/Offer";
import Movies from "./components/MovieList/Movies";
import MovieDetails from "./components/MovieDetails/MovieDetails";
import MovieBooking from "./components/MovieBooking/MovieBooking";
import SeatSelection from "./components/MovieSelectionPage/SeatSelection";
import PaymentPage from "./components/PaymentSection/PaymentPage";
import BookingSuccess from "./components/BookingSuccess/BookingSuccess";
import BookingHistoryP from "./components/BookingHistory/BookingHistory";
import ChangePasswordForm from "./components/ChangePassword/ChangePasswordForm";
import SignIn from "./components/SignIn/SignIn";
import RegistrationForm from "./components/RegistrationForm/RegistrationForm";
import ProfilePage from "./components/ProfilePage/ProfilePage";

// Admin Components
import AdminSignIn from "./components/AdminSignIn/AdminSign";
import AdminDash from "./components/AdminDashboard/AdminDash";
import MMHeader from "./components/MMHeader/MMHeader";
import ShowtimeMG from "./components/ShowtimeMG/ShowtimeMG";
import TheatreManage from "./components/TheatreManage/TheatreManage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* All pages now render inside the Layout component */}
          <Route path='/' element={<Layout />}>
            {/*Public-facing routes (have Navbar)*/}
            <Route index element={<Home />} />
            <Route path='about' element={<Aboutus />} />
            <Route path='offer' element={<Offer />} />
            <Route path='movies' element={<Movies />} />
            <Route path='movie/:id' element={<MovieDetails />} />
            <Route path='booking/:id' element={<MovieBooking />} />
            <Route path='select-seat' element={<SeatSelection />} />
            <Route path='payment' element={<PaymentPage />} />
            <Route path='booking-success' element={<BookingSuccess />} />
            <Route path='booking-history' element={<BookingHistoryP />} />
            <Route path='change-pw' element={<ChangePasswordForm />} />
            <Route path='profile' element={<ProfilePage />} />{" "}
            {/*Auth routes (No Navbar) */}
            <Route path='sign-in' element={<SignIn />} />
            <Route path='reg-form' element={<RegistrationForm />} />
            <Route path='sign-in-admin' element={<AdminSignIn />} />
            {/*Admin Panel routes (No Navbar) ---*/}
            <Route path='admin-dash' element={<AdminDash />} />
            <Route path='movie-manage' element={<MMHeader />} />
            <Route path='time-manage' element={<ShowtimeMG />} />
            <Route path='theatre-manage' element={<TheatreManage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
