import React from "react";
import {
    createBrowserRouter,
    Route,
    createRoutesFromElements,
    RouterProvider,
    Navigate,
} from "react-router-dom";
import RootLayout from "./components/layouts/RootLayout";
import ProfilLayout from "./components/layouts/profilLayout/ProfilLayout";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Profile from "./components/profil/Profile";
import Password from "./components/profil/PasswordChange";
import PasswordLayout from "./components/layouts/profilLayout/PasswordLayout";
import PrivateRouter from "./components/router/PrivateRouter";
import ForgotPassword from "./components/auth/ForgotPassword";
// import ConfirmPassword from "./components/auth/ConfirmPassword";
import NewPassword from "./components/auth/NewPassword";
// import ConfirmEmail from "./components/auth/ConfirmEmail";
import KeywordList from "./components/keyword/KeywordList";
import CreateKeyword from "./components/keyword/CreateKeyword";
import EditKeywords from "./components/keyword/EditKeyword";
import Error from "./components/error/Error";
import ResultKeywords from "./components/keyword/ResultKeywords";
// import ScheduleLayout from "./components/layouts/detailSettingsLayout/ScheduleLayout";
import Schedule from "./components/keyword/Schedule";
import GuestRouter from "./components/router/GuestRouter";
import Packages from "./components/packages/Packages";
import DetailSettingsLayout from "./components/layouts/detailSettingsLayout/DetailSettingsLayout";
import TelegramLayout from "./components/layouts/detailSettingsLayout/TelegramLayout";
import TelegramReport from "./components/keyword/TelegramReport";
import Home from "./components/pages/Home";
import CompareKeywords from "./components/keyword/CompareKeywords";
import TvAndRadio from "./components/keyword/TvAndRadio";

function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<RootLayout/>}>
                <Route element={<PrivateRouter/>}>
                    <Route index element={<Home/>}/>
                    <Route path="settings" element={<ProfilLayout/>}>
                        <Route index element={<Profile/>}/>
                        <Route path="changepassword" element={<PasswordLayout/>}>
                            <Route index element={<Password/>}/>
                        </Route>
                    </Route>
                    <Route path="topics-list" element={<KeywordList/>}/>
                    <Route path="tv-radio" element={<TvAndRadio/>}/>
                    <Route path="packages" element={<Packages/>}/>
                    <Route path="create-keywords" element={<CreateKeyword/>}/>
                    <Route path="settings-keyword" element={<DetailSettingsLayout/>}>
                        <Route index element={<Schedule/>}/>
                        <Route path="telegram-report" element={<TelegramLayout/>}>
                            <Route index element={<TelegramReport/>}/>
                        </Route>
                    </Route>
                    <Route path="edit-keywords" element={<EditKeywords/>}/>
                    <Route path="compare-keywords" element={<CompareKeywords/>}/>
                    <Route path="result-keyword" element={<ResultKeywords/>}/>
                </Route>
                <Route path="signin" element={<GuestRouter element={Login}/>}/>
                <Route path="register" element={<GuestRouter element={Register}/>}/>
                <Route
                    path="forgotpassword"
                    element={<GuestRouter element={ForgotPassword}/>}
                />
                <Route
                    path="reset-password"
                    element={<GuestRouter element={NewPassword}/>}
                />
                {/*    <Route
          path="password-reset/:slug"
          element={<GuestRouter element={ConfirmPassword} />}
        />
       
        <Route
          path="confirm-email/:slug"
          element={<GuestRouter element={ConfirmEmail} />}
        /> */}
                <Route path="*" element={<Navigate to="/error"/>}/>
                <Route path="/error" element={<Error/>}/>
            </Route>
        )
    );
    return (
        <div>
            <RouterProvider router={router}/>
        </div>
    );
}

export default App;
