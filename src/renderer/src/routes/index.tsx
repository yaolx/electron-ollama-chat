import { lazy } from 'react'
import { useRoutes, RouteObject } from 'react-router-dom'

import Layout from '@/components/layout'

const Home = lazy(() => import('@/page/home'))
const Ai = lazy(() => import('@/page/ai'))
const Demo = lazy(() => import('@/page/demo'))
const MyBlog = lazy(() => import('@/page/myBlog'))
const Apps = lazy(() => import('@/page/apps'))
const Tool = lazy(() => import('@/page/tool'))
const routesConfig: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: '/demo',
        element: <Demo />
      },
      {
        path: '/myBlog',
        element: <MyBlog />
      },
      {
        path: '/ai',
        element: <Ai />
      },
      {
        path: '/apps',
        element: <Apps />
      },
      {
        path: '/Tool',
        element: <Tool />
      }
    ]
  }
]

const Router = () => {
  const appRouter = useRoutes(routesConfig)
  return appRouter
}

export default Router
