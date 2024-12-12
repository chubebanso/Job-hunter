import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/Home'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import Companies from './components/admin/Companies'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from "./components/admin/AdminJobs"
import PostJob from './components/admin/PostJob'
import Applicants from './components/admin/Applicants'
import ApplicantsCreate from './components/admin/ApplicantsCreate'
import AdminMain from './components/admin/AdminMain'


// Loại bỏ ProtectedRoute khỏi import

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },

  {
    path: "/company/:id",
    element: <JobDescription />
  },
 
  {
    path: "/profile",
    element: <Profile />
  },
  // admin routes
  {
    path: "/admin",
    element: <AdminMain/>
  },
  {
    path: "/admin/companies",
    element: <Companies />
  },

  {
    path: "/admin/companies/:id",
    element: <CompanySetup />
  },
  {
    path: "/admin/jobs",
    element: <AdminJobs />
  },
  {
    path: "/admin/jobs/create",
    element: <PostJob />
  },
  {
    path: "/admin/:id/applicants",
    element: <Applicants />
  },
  {
    path: "/admin/applicants/create",
    element: <ApplicantsCreate/>
  },
 
  
])

function App() {
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default App
