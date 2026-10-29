import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog } from "../ui/Dialog";
import { Button } from "../ui/Button";
import { logout } from "../../features/user/authSlice";
import { SESSION_EXPIRED_EVENT } from "../../services/api/axiosClient";

// Session expired (§4.8 "System states"): a dialog to sign in again, which
// returns the user to the page they were on.
export function SessionExpiredDialog() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onExpired = () => setOpen(true);
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, []);

  const signIn = () => {
    setOpen(false);
    dispatch(logout());
    navigate("/login", { state: { from: location.pathname + location.search } });
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      title="انتهت جلستك"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            لاحقًا
          </Button>
          <Button onClick={signIn}>تسجيل الدخول</Button>
        </>
      }
    >
      <p className="text-sm text-text-secondary">
        انتهت صلاحية جلستك ولن تُحفظ التغييرات حتى تسجّل الدخول مرة أخرى. ستعود إلى هذه الصفحة بعد تسجيل الدخول.
      </p>
    </Dialog>
  );
}

export default SessionExpiredDialog;
