import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChangePasswordForm } from "./change-password-form";

export function ChangePasswordPage() {
  return (
    <AppBody>
      <PageHeading
        title="Change Password"
        currentPage="Change Password"
        description="Use a strong password you do not use anywhere else."
      />
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Update your password</CardTitle>
          <CardDescription>
            Enter your current password, then choose a new one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </AppBody>
  );
}
