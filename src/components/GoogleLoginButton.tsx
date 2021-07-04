export default function GoogleLoginButton() {
  return (
    <div>
      <div
        id="g_id_onload"
        data-client_id="732283162920-fo65na0l33ahj1f02a6qdnhcg3hdq29n.apps.googleusercontent.com"
        data-context="signin"
        data-ux_mode="popup"
        data-callback="handleCredentialResponse"
        data-auto_prompt="false"
      ></div>
      <div
        className="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="outline"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left"
      ></div>
    </div>
  );
}
