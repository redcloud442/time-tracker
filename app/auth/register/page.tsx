import RegisterPage from "@/components/RegisterPage/RegisterPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Register an account",
};

const Page = async () => {
  return <RegisterPage />;
};

export default Page;
