import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy-load components
const ContextProvider = lazy(() => import('@/provider'));
const Option = lazy(() => import('@/option/option'));
const Popup = lazy(() => import('@/popup/popup'));
const SidePanel = lazy(() => import('@/sidepanel/sidepanel'));
const App = lazy(() => import('./app'));
const Error = lazy(() => import('./error'));
const Dashboard = lazy(() => import('./dashboard'));
const Profile = lazy(() => import('./profile'));
const Login = lazy(() => import('./login'));
const Register = lazy(() => import('./register'));
const Ai = lazy(() => import('./ai'));
const Chat = lazy(() => import('./chat'));
const ChangePassword = lazy(() => import('./changePassword'));
const Sonner = lazy(() =>
  import('@/components/ui/sonner').then((module) => ({
    default: module.Toaster,
  }))
);
const Toaster = lazy(() =>
  import('@/components/ui/toaster').then((module) => ({
    default: module.Toaster,
  }))
);
const Initial = lazy(() =>
  import('@/components').then((module) => ({
    default: module.Initial,
  }))
);

// const Mail = lazy(() => import('./dashboard/mail'));

const Router = ({ loc }: { loc?: string }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {loc && <Initial loc={loc} />}
      <ContextProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/popup" element={<Popup />} />
          <Route path="/option" element={<Option />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sidepanel" element={<SidePanel />} />
          <Route path="/register" element={<Register />} />
          <Route path="/changepassword" element={<ChangePassword />} />
          <Route path="/ai" element={<Ai />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<Chat />} />
          {/*<Route path="/dashboard/mail" element={<Mail />} /> */}
          <Route path="*" element={<Error />} />
        </Routes>
      </ContextProvider>
      <Sonner />
      <Toaster />
    </Suspense>
  );
};

export default Router;
