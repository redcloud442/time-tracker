import OnboardingPage from "@/components/OnboardingPage/OnboardingPage";
import { serverProtectionMember } from "@/utils/serverProtection";

const Page = async () => {
  await serverProtectionMember();

  return <OnboardingPage />;
};

export default Page;
