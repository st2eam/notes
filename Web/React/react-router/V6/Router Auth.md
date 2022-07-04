## Auth Example

src\components\RouterGuard

```tsx
import { Navigate } from "react-router-dom";
interface Props {
  guard: boolean;
  element: JSX.Element;
}
export default function RouterGuard(props: Props) {
  const authed = props.guard;
  return (
    authed ? props.element : < Navigate to="/login" replace />
  )
}
```

src\components\RouterView

```tsx
import './style.css';
import Home from '../../pages/Home';
import Login from '../../pages/Login';
import NotFound from '../../pages/NotFound';
import RouterGuard from '../RouterGuard';
import { Routes, Route, Outlet } from "react-router-dom";

export default function RouterView() {
  return (
    <div className="router-view">
      <Routes>
        <Route path="/" element={<RouterGuard guard={false} element={<Home />} />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Outlet />
    </div>
  );
}
```
