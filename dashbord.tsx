// src/pages/dashbord.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardRedirect() {
  const navigate = useNavigate();
  useEffect(() => { navigate("/patients", { replace: true }); }, [navigate]);
  return null;
}
