"use client";

import { registerSubmission } from "@/services/Auth/Auth";
import { escapeFormData } from "@/utils/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AspectRatio,
  Button,
  Container,
  Divider,
  em,
  Flex,
  Loader,
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

const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const escapedData = escapeFormData(data);
      await registerSubmission(escapedData.email, escapedData.password);

      notifications.show({
        title: "Registration successful",
        message: "Please Wait",
        color: "green",
      });

      router.push("/user/onboarding");
    } catch (e) {
      notifications.show({
        title: "Registration failed",
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
                <Stack w="100%" h="100%">
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

            <Stack w="100%">
              <Title order={3} mb="md">
                Register
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

                  <Controller
                    name="confirmPassword"
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
                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    fullWidth
                    mt="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader color="white" size="xs" /> Register
                      </>
                    ) : (
                      "Register"
                    )}
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

export default RegisterPage;
