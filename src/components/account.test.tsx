import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AuthSection } from "./account";
import { STRINGS } from "../i18n-tables";

vi.mock("@tauri-apps/api/core", () => ({ invoke: vi.fn() }));
vi.mock("@tauri-apps/plugin-opener", () => ({ openUrl: vi.fn() }));
afterEach(cleanup);
const s = STRINGS.en;
const props = () => ({
  s,
  auth: { status: "anonymous" as const },
  onAuthenticate: vi.fn(async () => {}),
  onLogout: vi.fn(),
  onResendVerification: vi.fn(async () => {}),
  onForgotPassword: vi.fn(async () => {}),
  onDeleteAccount: vi.fn(async () => {}),
});

it("login forwards the real remember-me choice", async () => {
  const p = props();
  const { container } = render(<AuthSection {...p} />);
  fireEvent.change(screen.getByPlaceholderText(s.auth.email), {
    target: { value: "person@example.com" },
  });
  fireEvent.change(screen.getByPlaceholderText(s.auth.password), {
    target: { value: "valid-password" },
  });
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.submit(container.querySelector("form")!);
  await waitFor(() =>
    expect(p.onAuthenticate).toHaveBeenCalledWith(
      "login",
      "person@example.com",
      "valid-password",
      undefined,
      false,
    ),
  );
});

it("shows authentication failure and makes the form usable again", async () => {
  const p = props();
  p.onAuthenticate.mockRejectedValue(new Error("Invalid credentials"));
  const { container } = render(<AuthSection {...p} />);
  fireEvent.change(screen.getByPlaceholderText(s.auth.email), {
    target: { value: "person@example.com" },
  });
  fireEvent.change(screen.getByPlaceholderText(s.auth.password), {
    target: { value: "valid-password" },
  });
  fireEvent.submit(container.querySelector("form")!);
  expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
  expect(screen.getByText(s.auth.loginButton)).not.toBeDisabled();
});

it("authenticated account can sign out and resend verification", async () => {
  const p = props();
  render(
    <AuthSection
      {...p}
      auth={{
        status: "authenticated",
        email: "person@example.com",
        emailVerified: false,
        plan: null,
        hasBilling: false,
      }}
    />,
  );
  fireEvent.click(screen.getByText(s.auth.resendVerification));
  await waitFor(() => expect(p.onResendVerification).toHaveBeenCalledOnce());
  fireEvent.click(screen.getByText(s.auth.logout));
  expect(p.onLogout).toHaveBeenCalledOnce();
});

it("deletes the account only after the password and the confirmation word", async () => {
  const p = props();
  render(
    <AuthSection
      {...p}
      auth={{
        status: "authenticated",
        email: "person@example.com",
        emailVerified: true,
        plan: null,
        hasBilling: false,
      }}
    />,
  );

  // The danger zone is folded away until it is opened, and the submit stays
  // disabled until both fields are filled in properly.
  fireEvent.click(screen.getByText(s.auth.deleteAccount));
  expect(screen.getByText(s.auth.deleteAccountBody)).toBeInTheDocument();
  const submit = screen.getByText(s.auth.deleteAccountSubmit);
  expect(submit).toBeDisabled();

  fireEvent.change(screen.getByLabelText(s.auth.deleteAccountPassword), {
    target: { value: "correct horse battery" },
  });
  fireEvent.change(screen.getByLabelText(s.auth.deleteAccountConfirmLabel), {
    target: { value: "delete" },
  });
  expect(submit).toBeDisabled();

  fireEvent.change(screen.getByLabelText(s.auth.deleteAccountConfirmLabel), {
    target: { value: "DELETE" },
  });
  expect(submit).not.toBeDisabled();
  fireEvent.click(submit);
  await waitFor(() =>
    expect(p.onDeleteAccount).toHaveBeenCalledWith("correct horse battery", "DELETE"),
  );
});

it("explains a refused deletion in the reader's language", async () => {
  const p = props();
  p.onDeleteAccount.mockRejectedValue(
    Object.assign(new Error("SERVER TEXT: active subscription, code 409"), {
      problem: "active-subscription",
    }),
  );
  render(
    <AuthSection
      {...p}
      auth={{
        status: "authenticated",
        email: "person@example.com",
        emailVerified: true,
        plan: "monthly",
        hasBilling: true,
      }}
    />,
  );
  fireEvent.click(screen.getByText(s.auth.deleteAccount));
  fireEvent.change(screen.getByLabelText(s.auth.deleteAccountPassword), {
    target: { value: "correct horse battery" },
  });
  fireEvent.change(screen.getByLabelText(s.auth.deleteAccountConfirmLabel), {
    target: { value: "DELETE" },
  });
  fireEvent.click(screen.getByText(s.auth.deleteAccountSubmit));
  expect(await screen.findByText(s.auth.deleteAccountBlocked)).toBeInTheDocument();
  // The server's own sentence is replaced by the translated one.
  expect(screen.queryByText(/SERVER TEXT/)).not.toBeInTheDocument();

  // Cancelling closes the form and clears both fields, so a half-typed
  // password is not left sitting in the window.
  fireEvent.click(screen.getByText(s.auth.deleteAccountCancel));
  fireEvent.click(screen.getByText(s.auth.deleteAccount));
  expect(screen.getByLabelText(s.auth.deleteAccountPassword)).toHaveValue("");
  expect(screen.getByLabelText(s.auth.deleteAccountConfirmLabel)).toHaveValue("");
});
