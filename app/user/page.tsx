import OnboardingWaitingPage from "@/components/OnboardingWaiting/OnboardingWaitingPage";
import { serverProtectionMember } from "@/utils/serverProtection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Waiting for approval",
};

const Page = async () => {
  await serverProtectionMember();
  return <OnboardingWaitingPage />;
};

export default Page;
