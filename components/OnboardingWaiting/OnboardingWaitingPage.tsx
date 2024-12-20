import { Alert, Container, Stack, Title } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

const OnboardingWaitingPage = () => {
  return (
    <Container>
      <Stack>
        <Title order={1} variant="dimmed">
          Onboarding Waiting Page
        </Title>
        <Alert variant="outline" color="yellow" icon={<IconInfoCircle />}>
          Your account is currently pending approval. Please wait for your
          account to be approved by the admin.
        </Alert>
      </Stack>
    </Container>
  );
};

export default OnboardingWaitingPage;
