import { Outlet } from 'react-router';
import { CursorEffect } from './components/CursorEffect';

export function RootLayout() {
  return (
    <div className="relative min-h-screen">
      <CursorEffect />
      <div className="relative z-10">
        <Outlet />
      </div>
    </div>
  );
}
