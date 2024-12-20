"use client";

import { loginSubmission } from "@/services/Auth/Auth";
import { escapeFormData } from "@/utils/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AspectRatio,
  Button,
  Container,
  Divider,
  em,
  Flex,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconBrandGoogle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import AuthLogo from "../../public/AuthLogo";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const router = useRouter();
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const escapedData = escapeFormData(data);
      const response = await loginSubmission(
        escapedData.email,
        escapedData.password
      );

      notifications.show({
        title: "Login successful",
        message: response.message,
        color: "green",
      });
      router.push(response.redirect);
    } catch (e) {
      notifications.show({
        title: "Login failed",
        message: "Please try again",
        color: "red",
      });
    }
  };

  return (
    <Container size="md" h="70vh">
      <Flex justify="center" align="center" h="100%">
        <Paper shadow="sm" withBorder p="xl" radius="md" w="100%" maw={1000}>
          <Flex align="center" gap="xl">
            {!isMobile ? (
              <>
                <Stack w="50%" h="100%">
                  <AspectRatio ratio={1} h={400} maw={500}>
                    <AuthLogo />
                  </AspectRatio>
                  <Title order={2} ta="center">
                    Track Time Easily
                  </Title>
                  <Text ta="center">
                    Manage your tasks efficiently with our intuitive
                    time-tracking tools.
                  </Text>
                </Stack>
                <Divider orientation="vertical" />
              </>
            ) : null}

            <Stack w="50%">
              <Title order={3} mb="md">
                Login
              </Title>

              <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
                <Stack>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        label="Email"
                        placeholder="Enter your email"
                        {...field}
                        error={errors.email?.message}
                        withAsterisk
                      />
                    )}
                  />

                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <PasswordInput
                        label="Password"
                        placeholder="Enter your password"
                        {...field}
                        error={errors.password?.message}
                        withAsterisk
                      />
                    )}
                  />
                  <Button type="submit" fullWidth mt="lg">
                    Login
                  </Button>
                  <Divider label="OR" labelPosition="center" />
                  <Button
                    leftSection={<IconBrandGoogle color="orange" />}
                    variant="outline"
                    fullWidth
                  >
                    Login with Google
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Flex>
        </Paper>
      </Flex>
    </Container>
  );
};

export default LoginPage;
