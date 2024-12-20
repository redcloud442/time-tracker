import { Metadata } from "next";
import LoginPage from "../../../components/LoginPage/LoginPage";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

const Page = async () => {
  return <LoginPage />;
};

export default Page;
