  import Navbar from './components/shared/Navbar'
  import { createBrowserRouter } from 'react-router-dom'

  const appRouter= createBrowserRouter([
    {
      path:'/',
      element:<Home/>
    },
    {
      path:'/login',
      element:<Login/>
    },
    {
      path:'/signup',
      element:<Signup/>
    },
    {
      path:'/',
      element:<Home/>
    },
    {
      path:'/',
      element:<Home/>
    },
    {
      path:'/',
      element:<Home/>
    },
  ])

function App() {
  return(
    <>
    <Navbar/>
    </>
  )
}

export default App
