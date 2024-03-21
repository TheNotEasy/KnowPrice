import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'

import App from "@/App.tsx";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {Item} from "@/pages/Item/Item.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/tabs" replace />} />
      <Route path="/tabs" Component={App} />
      <Route path="/item/:id" Component={Item} />
    </Routes>
  </BrowserRouter>,
)
