---
originalPath: Web/React/react-router/V6/Router Auth.md
primaryCategory: 计算机/前端/React
categories:
  - path: 计算机/前端/React
    reason: >-
      核心学习对象为“Router Auth”，正文依据：“src\components\RouterGuard
      src\components\RouterView”；据其实体与学习对象归入计算机/前端/React。
classificationStatus: confirmed
relations: []
tags:
  - 实体/React
---
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
